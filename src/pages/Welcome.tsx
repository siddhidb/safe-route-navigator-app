
import React from 'react';
import Header from '@/components/Header';
import WelcomeInfo from '@/components/WelcomeInfo';

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 p-6 flex items-center justify-center">
        <WelcomeInfo />
      </main>
    </div>
  );
};

export default Welcome;
