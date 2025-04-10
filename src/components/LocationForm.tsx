
import React, { useState } from 'react';
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

const LocationForm: React.FC = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const presetLocations = [
    "New York City",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Miami"
  ];

  const handleUseCurrentLocation = () => {
    toast({
      description: "Getting your current location...",
    });
    
    // Simulate getting location
    setTimeout(() => {
      setSource("Current Location");
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
      // Simulate route calculation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store location info for map page
      localStorage.setItem('source', source);
      localStorage.setItem('destination', destination);
      
      navigate('/map');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find route",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
          onClick={() => setSource('')}
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
