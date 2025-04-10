
import React from 'react';
import Header from '@/components/Header';
import AuthForm from '@/components/AuthForm';

const Register: React.FC = () => {
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
