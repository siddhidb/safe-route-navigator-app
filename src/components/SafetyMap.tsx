
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from 'lucide-react';

// Mock data for safety routes
const safetyData = {
  safeRoute: {
    coordinates: [
      [40.7128, -74.006], // NYC
      [40.7500, -73.980], // Midpoint 1
      [40.7800, -73.950], // Midpoint 2
      [40.8000, -73.920]  // Upper Manhattan
    ],
    safety: "safe",
    distance: "5.2 miles",
    time: "18 mins"
  },
  normalRoute: {
    coordinates: [
      [40.7128, -74.006], // NYC
      [40.7300, -73.990], // Midpoint 1
      [40.7600, -73.960], // Midpoint 2
      [40.8000, -73.920]  // Upper Manhattan
    ],
    safety: "normal",
    distance: "4.5 miles",
    time: "15 mins"
  },
  unsafeRoute: {
    coordinates: [
      [40.7128, -74.006], // NYC
      [40.7200, -74.000], // Midpoint 1
      [40.7500, -73.980], // Midpoint 2
      [40.8000, -73.920]  // Upper Manhattan
    ],
    safety: "unsafe",
    distance: "4.2 miles",
    time: "12 mins"
  }
};

const SafetyMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Get location data from localStorage
    const sourceLocation = localStorage.getItem('source') || 'Unknown Source';
    const destLocation = localStorage.getItem('destination') || 'Unknown Destination';
    
    setSource(sourceLocation);
    setDestination(destLocation);
    
    // In a real app, we would initialize an actual map here
    // For this simulation, we'll just set a timeout
    const timer = setTimeout(() => {
      setMapLoaded(true);
      
      toast({
        title: "Routes Generated",
        description: `We've found 3 routes from ${sourceLocation} to ${destLocation}`,
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Route from {source} to {destination}</h2>
        <p className="text-sm text-gray-500">Showing 3 routes with safety ratings</p>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-[400px] bg-gray-100 rounded-lg relative overflow-hidden border border-gray-300"
      >
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading map and calculating safe routes...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            {/* This would be a real map in a production app */}
            <img 
              src="/lovable-uploads/18085a07-827b-4b20-b6a3-9e74811fc3c9.png" 
              alt="Map with Routes" 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-2 right-2 bg-white/90 p-2 rounded-md shadow-md">
              <div className="text-sm font-medium">Map Safety Score</div>
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-amber-500 mr-1" />
                <span className="text-amber-500 font-bold">7.2/10</span>
              </div>
            </div>
            
            <div className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-md shadow-md">
              <h3 className="text-sm font-bold mb-1">Routes Legend</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                  <span>: Safe</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-secondary mr-2"></div>
                  <span>: Normal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-destructive mr-2"></div>
                  <span>: Not Safe</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 space-y-4">
        <h3 className="font-bold text-lg">Available Routes</h3>
        
        <div className="border-l-4 border-primary p-3 bg-primary/10 rounded-r-md">
          <div className="font-bold flex justify-between">
            <span>Safe Route</span>
            <span>{safetyData.safeRoute.distance} • {safetyData.safeRoute.time}</span>
          </div>
          <p className="text-sm">Recommended for maximum safety. Avoids high-crime areas.</p>
        </div>
        
        <div className="border-l-4 border-secondary p-3 bg-secondary/10 rounded-r-md">
          <div className="font-bold flex justify-between">
            <span>Normal Route</span>
            <span>{safetyData.normalRoute.distance} • {safetyData.normalRoute.time}</span>
          </div>
          <p className="text-sm">Balanced route with moderate safety concerns.</p>
        </div>
        
        <div className="border-l-4 border-destructive p-3 bg-destructive/10 rounded-r-md">
          <div className="font-bold flex justify-between">
            <span>Fastest Route</span>
            <span>{safetyData.unsafeRoute.distance} • {safetyData.unsafeRoute.time}</span>
          </div>
          <p className="text-sm">Shortest path but passes through areas with safety concerns.</p>
        </div>
      </div>
    </div>
  );
};

export default SafetyMap;
