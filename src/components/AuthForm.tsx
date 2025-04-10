
import React from 'react';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import AuthFooter from './auth/AuthFooter';

interface AuthFormProps {
  isLogin?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin = true }) => {
  return (
    <div className="w-full max-w-xs mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Login to Your Account' : 'Create a New Account'}
      </h2>
      
      {isLogin ? <LoginForm /> : <RegisterForm />}
      
      <AuthFooter isLogin={isLogin} />
    </div>
  );
};

export default AuthForm;
