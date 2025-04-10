import { supabase } from '@/lib/supabase';
import { CrimeData, RouteOptions, SafetyZone } from '@/types';

// Calculate safety score for a point based on its proximity to crime clusters
const calculateSafetyScore = (point: [number, number], safetyZones: SafetyZone[]): number => {
  // Default high safety score (10 is the safest)
  let score = 10;
  
  // Calculate distance from point to each safety zone
  safetyZones.forEach(zone => {
    const distance = calculateDistance(point, zone.center);
    
    // If point is inside or close to a safety zone, reduce safety score
    if (distance <= zone.radius) {
      // Calculate impact based on distance and zone's safety score
      const impact = (1 - distance / zone.radius) * (10 - zone.safety_score);
      score -= impact;
    }
  });
  
  // Ensure score stays within 0-10 range
  return Math.max(0, Math.min(10, score));
};

// Calculate Haversine distance between two points
const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Get crime data from Supabase
export const getCrimeData = async (): Promise<CrimeData[]> => {
  try {
    const { data, error } = await supabase
      .from('crime_data')
      .select('*');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching crime data:', error);
    return [];
  }
};

// Identify safety zones from crime data using a simplified clustering approach
export const identifySafetyZones = async (): Promise<SafetyZone[]> => {
  const crimeData = await getCrimeData();
  const safetyZones: SafetyZone[] = [];
  
  // This is a simplified approach instead of DBSCAN
  // Group nearby crimes and create safety zones
  
  // Track processed crimes
  const processed = new Set<number>();
  
  crimeData.forEach((crime, index) => {
    if (processed.has(index)) return;
    
    processed.add(index);
    const cluster: CrimeData[] = [crime];
    
    // Find nearby crimes
    crimeData.forEach((otherCrime, otherIndex) => {
      if (index === otherIndex || processed.has(otherIndex)) return;
      
      const distance = calculateDistance(
        [crime.latitude, crime.longitude],
        [otherCrime.latitude, otherCrime.longitude]
      );
      
      // If close enough, add to cluster
      if (distance < 1) { // 1km radius
        cluster.push(otherCrime);
        processed.add(otherIndex);
      }
    });
    
    // Only create safety zones for clusters with multiple crimes
    if (cluster.length > 1) {
      // Calculate center point
      const centerLat = cluster.reduce((sum, c) => sum + c.latitude, 0) / cluster.length;
      const centerLng = cluster.reduce((sum, c) => sum + c.longitude, 0) / cluster.length;
      
      // Calculate safety score (more crimes = lower score)
      const safetyScore = Math.max(1, 10 - cluster.length);
      
      safetyZones.push({
        center: [centerLat, centerLng],
        radius: 1, // 1km radius
        safety_score: safetyScore
      });
    }
  });
  
  return safetyZones;
};

// Generate route options between source and destination
export const getRouteOptions = async (
  source: [number, number], 
  destination: [number, number]
): Promise<RouteOptions> => {
  try {
    // Get safety zones
    const safetyZones = await identifySafetyZones();
    
    // For simplicity, we'll generate 3 routes with modified waypoints
    // In a real implementation, you would use proper routing algorithms
    
    // Safe Route (slightly longer but avoids unsafe areas)
    const safeRoute = generateSafeRoute(source, destination, safetyZones);
    
    // Normal Route (balanced between safety and distance)
    const normalRoute = generateNormalRoute(source, destination, safetyZones);
    
    // Fast Route (shortest but may pass through unsafe areas)
    const fastRoute = generateFastRoute(source, destination, safetyZones);
    
    return {
      safeRoute,
      normalRoute,
      unsafeRoute: fastRoute
    };
  } catch (error) {
    console.error('Error generating routes:', error);
    
    // Return mock data if failure occurs
    return {
      safeRoute: {
        coordinates: [source, destination],
        safety: 'safe' as const,
        distance: '5.2 miles',
        time: '18 mins',
        safety_score: 8.5
      },
      normalRoute: {
        coordinates: [source, destination],
        safety: 'normal' as const,
        distance: '4.5 miles',
        time: '15 mins',
        safety_score: 6.7
      },
      unsafeRoute: {
        coordinates: [source, destination],
        safety: 'unsafe' as const,
        distance: '4.2 miles',
        time: '12 mins',
        safety_score: 4.2
      }
    };
  }
};

// Save route history to Supabase
export const saveRouteHistory = async (
  userId: string,
  source: string,
  destination: string,
  routeTaken: string,
  safetyScore: number
) => {
  try {
    const { data, error } = await supabase
      .from('route_history')
      .insert([
        {
          user_id: userId,
          source,
          destination,
          route_taken: routeTaken,
          safety_score: safetyScore
        }
      ]);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving route history:', error);
    return { success: false, error };
  }
};

// Helper functions to generate different route options
const generateSafeRoute = (
  source: [number, number], 
  destination: [number, number], 
  safetyZones: SafetyZone[]
) => {
  // Create waypoints for safe route (avoiding unsafe areas)
  const waypoints = generateSafeWaypoints(source, destination, safetyZones);
  
  // Calculate route stats
  const distance = calculateTotalDistance([source, ...waypoints, destination]);
  const time = Math.round(distance * 3.5); // Estimate: 3.5 mins per km
  
  // Calculate overall safety score
  let totalScore = 0;
  [source, ...waypoints, destination].forEach((point, i, arr) => {
    if (i === arr.length - 1) return; // Skip last point
    const midpoint: [number, number] = [
      (point[0] + arr[i+1][0]) / 2,
      (point[1] + arr[i+1][1]) / 2
    ];
    totalScore += calculateSafetyScore(midpoint, safetyZones);
  });
  
  const safetyScore = totalScore / (waypoints.length + 1);
  
  return {
    coordinates: [source, ...waypoints, destination],
    safety: 'safe' as const,
    distance: `${distance.toFixed(1)} km`,
    time: `${time} mins`,
    safety_score: safetyScore
  };
};

const generateNormalRoute = (
  source: [number, number], 
  destination: [number, number], 
  safetyZones: SafetyZone[]
) => {
  // Create waypoints for normal route (balance between safety and distance)
  const waypoints = generateNormalWaypoints(source, destination, safetyZones);
  
  // Calculate route stats
  const distance = calculateTotalDistance([source, ...waypoints, destination]);
  const time = Math.round(distance * 3); // Estimate: 3 mins per km
  
  // Calculate overall safety score
  let totalScore = 0;
  [source, ...waypoints, destination].forEach((point, i, arr) => {
    if (i === arr.length - 1) return; // Skip last point
    const midpoint: [number, number] = [
      (point[0] + arr[i+1][0]) / 2,
      (point[1] + arr[i+1][1]) / 2
    ];
    totalScore += calculateSafetyScore(midpoint, safetyZones);
  });
  
  const safetyScore = totalScore / (waypoints.length + 1);
  
  return {
    coordinates: [source, ...waypoints, destination],
    safety: 'normal' as const,
    distance: `${distance.toFixed(1)} km`,
    time: `${time} mins`,
    safety_score: safetyScore
  };
};

const generateFastRoute = (
  source: [number, number], 
  destination: [number, number], 
  safetyZones: SafetyZone[]
) => {
  // Create waypoints for fast route (prioritize shortest distance)
  const waypoints = generateFastWaypoints(source, destination);
  
  // Calculate route stats
  const distance = calculateTotalDistance([source, ...waypoints, destination]);
  const time = Math.round(distance * 2.5); // Estimate: 2.5 mins per km
  
  // Calculate overall safety score
  let totalScore = 0;
  [source, ...waypoints, destination].forEach((point, i, arr) => {
    if (i === arr.length - 1) return; // Skip last point
    const midpoint: [number, number] = [
      (point[0] + arr[i+1][0]) / 2,
      (point[1] + arr[i+1][1]) / 2
    ];
    totalScore += calculateSafetyScore(midpoint, safetyZones);
  });
  
  const safetyScore = totalScore / (waypoints.length + 1);
  
  return {
    coordinates: [source, ...waypoints, destination],
    safety: 'unsafe' as const,
    distance: `${distance.toFixed(1)} km`,
    time: `${time} mins`,
    safety_score: safetyScore
  };
};

// Helper function to calculate total distance of a route
const calculateTotalDistance = (points: Array<[number, number]>): number => {
  let totalDistance = 0;
  
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += calculateDistance(points[i], points[i + 1]);
  }
  
  return totalDistance;
};

// Helper function to generate waypoints for safe route
const generateSafeWaypoints = (
  source: [number, number], 
  destination: [number, number], 
  safetyZones: SafetyZone[]
): Array<[number, number]> => {
  // Get direct line between source and destination
  const directLine = getPointsBetween(source, destination, 3);
  
  // Adjust points to avoid unsafe areas
  return directLine.map(point => {
    // Find nearby safety zones
    const nearbySafetyZones = safetyZones.filter(zone => 
      calculateDistance(point, zone.center) <= zone.radius * 1.2
    );
    
    if (nearbySafetyZones.length === 0) return point;
    
    // Move away from unsafe areas
    let adjustedLat = point[0];
    let adjustedLng = point[1];
    
    nearbySafetyZones.forEach(zone => {
      const distance = calculateDistance(point, zone.center);
      const factor = 0.0005 * (10 - zone.safety_score) / distance;
      
      // Move in opposite direction of the safety zone
      const direction = [
        point[0] - zone.center[0],
        point[1] - zone.center[1]
      ];
      
      // Normalize direction
      const length = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1]);
      const normalizedDirection = [direction[0] / length, direction[1] / length];
      
      adjustedLat += normalizedDirection[0] * factor;
      adjustedLng += normalizedDirection[1] * factor;
    });
    
    return [adjustedLat, adjustedLng];
  });
};

// Helper function to generate waypoints for normal route
const generateNormalWaypoints = (
  source: [number, number], 
  destination: [number, number], 
  safetyZones: SafetyZone[]
): Array<[number, number]> => {
  // Get direct line between source and destination
  const directLine = getPointsBetween(source, destination, 2);
  
  // Adjust points to moderately avoid unsafe areas
  return directLine.map(point => {
    // Find nearby safety zones
    const nearbySafetyZones = safetyZones.filter(zone => 
      calculateDistance(point, zone.center) <= zone.radius * 0.8
    );
    
    if (nearbySafetyZones.length === 0) return point;
    
    // Move slightly away from unsafe areas
    let adjustedLat = point[0];
    let adjustedLng = point[1];
    
    nearbySafetyZones.forEach(zone => {
      const distance = calculateDistance(point, zone.center);
      const factor = 0.0003 * (10 - zone.safety_score) / distance;
      
      // Move in opposite direction of the safety zone
      const direction = [
        point[0] - zone.center[0],
        point[1] - zone.center[1]
      ];
      
      // Normalize direction
      const length = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1]);
      const normalizedDirection = [direction[0] / length, direction[1] / length];
      
      adjustedLat += normalizedDirection[0] * factor;
      adjustedLng += normalizedDirection[1] * factor;
    });
    
    return [adjustedLat, adjustedLng];
  });
};

// Helper function to generate waypoints for fast route
const generateFastWaypoints = (
  source: [number, number], 
  destination: [number, number]
): Array<[number, number]> => {
  // Just create a nearly direct route with minimal waypoints
  return getPointsBetween(source, destination, 1);
};

// Helper function to get points between two coordinates
const getPointsBetween = (
  start: [number, number], 
  end: [number, number], 
  numPoints: number
): Array<[number, number]> => {
  const points: Array<[number, number]> = [];
  
  for (let i = 1; i <= numPoints; i++) {
    const fraction = i / (numPoints + 1);
    const lat = start[0] + (end[0] - start[0]) * fraction;
    const lng = start[1] + (end[1] - start[1]) * fraction;
    points.push([lat, lng]);
  }
  
  return points;
};
