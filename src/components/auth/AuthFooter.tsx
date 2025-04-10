
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthFooterProps {
  isLogin: boolean;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ isLogin }) => {
  const navigate = useNavigate();

  return (
    <>
      {isLogin ? (
        <div className="text-center space-y-2">
          <a href="#" className="text-secondary text-sm hover:underline block">
            Forgot Password?
          </a>
          <button 
            type="button"
            onClick={() => navigate('/register')}
            className="text-secondary text-sm hover:underline"
          >
            Create account
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            type="button" 
            onClick={() => navigate('/login')}
            className="text-secondary text-sm hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
      )}
    </>
  );
};

export default AuthFooter;
