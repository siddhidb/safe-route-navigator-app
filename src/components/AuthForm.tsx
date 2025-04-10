
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  isLogin?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin = true }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate input
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      
      toast({
        title: isLogin ? "Login Successful" : "Account Created",
        description: `Welcome ${username}!`,
      });
      
      navigate('/location');
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-100 border-gray-300"
          placeholder="Enter your username"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-100 border-gray-300"
          placeholder="Enter your password"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={loading}
      >
        {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
      </Button>

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
    </form>
  );
};

export default AuthForm;
