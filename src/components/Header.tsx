
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-200 p-4 flex items-center justify-center shadow-md">
      <Link to="/" className="flex items-center space-x-2">
        <img src="/logo.svg" alt="Safe Route Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold text-center italic">
          Safe Route
          <span className="block text-sm not-italic font-normal">Recommendation System</span>
        </h1>
      </Link>
    </header>
  );
};

export default Header;
