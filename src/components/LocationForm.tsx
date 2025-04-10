
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { getCurrentUser } from '@/lib/supabase';

const LocationForm: React.FC = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [geoSource, setGeoSource] = useState<[number, number] | null>(null);
  const [geoDest, setGeoDest] = useState<[number, number] | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const presetLocations = [
    "New York City",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Miami"
  ];

  // Mock geocoding function (in a real app, use a geocoding service)
  const geocodeLocation = async (location: string): Promise<[number, number]> => {
    // For demo purposes, return mock coordinates
    const mockCoordinates: Record<string, [number, number]> = {
      "New York City": [40.7128, -74.0060],
      "Los Angeles": [34.0522, -118.2437],
      "Chicago": [41.8781, -87.6298],
      "Houston": [29.7604, -95.3698],
      "Miami": [25.7617, -80.1918],
      "Current Location": [40.7500, -74.0000], // Mock current location
    };
    
    // Return mock coordinates or random ones for unknown locations
    return mockCoordinates[location] || [
      40.7 + (Math.random() * 0.1), 
      -74.0 + (Math.random() * 0.1)
    ];
  };

  const handleUseCurrentLocation = () => {
    toast({
      description: "Getting your current location...",
    });
    
    // Simulate getting location
    setTimeout(() => {
      setSource("Current Location");
      setGeoSource([40.7500, -74.0000]); // Mock coordinates
      toast({
        description: "Current location detected!",
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!source || !destination) {
      toast({
        title: "Error",
        description: "Please enter both source and destination",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Geocode locations if needed
      if (!geoSource) {
        const coords = await geocodeLocation(source);
        setGeoSource(coords);
      }
      
      if (!geoDest) {
        const coords = await geocodeLocation(destination);
        setGeoDest(coords);
      }
      
      // Store location info for map page
      localStorage.setItem('source', source);
      localStorage.setItem('destination', destination);
      localStorage.setItem('sourceCoords', JSON.stringify(geoSource || await geocodeLocation(source)));
      localStorage.setItem('destCoords', JSON.stringify(geoDest || await geocodeLocation(destination)));
      
      // Log this search for the current user
      if (user) {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // Log search history - this would typically go to Supabase
          console.log('Logging route search for user:', currentUser.id, {
            source,
            destination,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      navigate('/map');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to find route",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // When source location is selected from preset, geocode it
  useEffect(() => {
    if (source && presetLocations.includes(source)) {
      geocodeLocation(source).then(coords => {
        setGeoSource(coords);
      });
    }
  }, [source]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">Enter Location</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Source:
        </label>
        <Select onValueChange={setSource} value={source}>
          <SelectTrigger className="w-full bg-gray-100">
            <SelectValue placeholder="Select source location" />
          </SelectTrigger>
          <SelectContent>
            {presetLocations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          type="button" 
          variant="outline"
          className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300"
          onClick={handleUseCurrentLocation}
        >
          <MapPin className="w-4 h-4" />
          <span>Your Current Location</span>
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300"
          onClick={() => {
            setSource('');
            setGeoSource(null);
          }}
        >
          <Navigation className="w-4 h-4" />
          <span>Enter Location Manually</span>
        </Button>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Destination:
        </label>
        <Input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          className="w-full bg-gray-100"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white mt-6"
        disabled={loading}
      >
        {loading ? 'Finding Route...' : 'Find Route'}
      </Button>
    </form>
  );
};

export default LocationForm;
