
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import SafetyMap from '@/components/SafetyMap';

const Map: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
    }
    
    // Check if location is set
    const source = localStorage.getItem('source');
    const destination = localStorage.getItem('destination');
    if (!source || !destination) {
      navigate('/location');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/location')}
              className="text-sm"
            >
              ← Back to Location Selection
            </Button>
          </div>
          <SafetyMap />
        </div>
      </main>
    </div>
  );
};

export default Map;
