
import React from 'react';
import Header from '@/components/Header';
import LocationForm from '@/components/LocationForm';
import useAuth from '@/hooks/useAuth';

const Location: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 p-6 flex items-center justify-center">
        <LocationForm />
      </main>
    </div>
  );
};

export default Location;
