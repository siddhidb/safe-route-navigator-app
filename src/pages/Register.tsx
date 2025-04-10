
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AuthForm from '@/components/AuthForm';
import useAuth from '@/hooks/useAuth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (user || localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/location');
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 p-6 flex items-center justify-center">
        <AuthForm isLogin={false} />
      </main>
    </div>
  );
};

export default Register;
