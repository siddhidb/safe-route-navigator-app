
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { MapPin, Shield, Navigation, AlertTriangle } from 'lucide-react';

const WelcomeInfo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-8 animate-fade-in">
      <div className="flex justify-center">
        <img src="/logo.svg" alt="Safe Route Logo" className="w-32 h-32" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Welcome to Safe Route</h2>
        <p className="text-gray-600">
          This app helps users find the safest route based on historical crime data, 
          real-time inputs, and other safety factors.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-medium">Safety First</h3>
          <p className="text-sm text-gray-500">Routes prioritized by safety data</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-gray-50">
          <Navigation className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-medium">Smart Routing</h3>
          <p className="text-sm text-gray-500">AI-powered path finding</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-gray-50">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-medium">Location Aware</h3>
          <p className="text-sm text-gray-500">Uses your current position</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-gray-50">
          <AlertTriangle className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-medium">Hazard Alerts</h3>
          <p className="text-sm text-gray-500">Real-time safety notifications</p>
        </div>
      </div>
      
      <Button 
        onClick={() => navigate('/login')} 
        className="w-full bg-primary hover:bg-primary/90 text-white"
      >
        Get Started
      </Button>
    </div>
  );
};

export default WelcomeInfo;
