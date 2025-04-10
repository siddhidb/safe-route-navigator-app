
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isDevelopmentMode } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and set the user
    const getSession = async () => {
      setLoading(true);
      
      if (isDevelopmentMode()) {
        // In development mode with placeholder credentials, check localStorage directly
        const storedUser = localStorage.getItem('devUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          localStorage.removeItem('isLoggedIn');
        }
        setLoading(false);
        return;
      }
      
      // Production mode with real Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      setUser(session?.user || null);
      
      // Set localStorage flag based on session
      if (session?.user) {
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        localStorage.removeItem('isLoggedIn');
      }
      
      setLoading(false);

      // Set up listener for auth changes
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user || null);
          
          // Update localStorage when auth state changes
          if (session?.user) {
            localStorage.setItem('isLoggedIn', 'true');
          } else {
            localStorage.removeItem('isLoggedIn');
          }
        }
      );

      return () => {
        listener?.subscription.unsubscribe();
      };
    };

    getSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (isDevelopmentMode()) {
        // For development mode, simulate authentication
        const mockUser = { 
          id: 'dev-user-id', 
          email,
          user_metadata: { username: email.split('@')[0] }
        };
        setUser(mockUser);
        localStorage.setItem('devUser', JSON.stringify(mockUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        toast({
          title: "Development Mode Login",
          description: "Logged in with mock credentials",
        });
        
        navigate('/location');
        return;
      }
      
      // Production mode with real Supabase
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // Set login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      navigate('/location');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
      localStorage.removeItem('isLoggedIn');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      
      if (isDevelopmentMode()) {
        // For development mode, simulate registration
        const mockUser = { 
          id: 'dev-user-id', 
          email,
          user_metadata: { username }
        };
        setUser(mockUser);
        localStorage.setItem('devUser', JSON.stringify(mockUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        toast({
          title: "Development Mode Registration",
          description: "Registered with mock credentials",
        });
        
        navigate('/location');
        return;
      }
      
      // Production mode with real Supabase
      const { error, data } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      // Create profile
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, username, email }]);
          
        if (profileError) throw profileError;
        
        // Set login state in localStorage
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
      
      navigate('/location');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive"
      });
      localStorage.removeItem('isLoggedIn');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      if (isDevelopmentMode()) {
        // For development mode, clear local storage
        localStorage.removeItem('devUser');
        localStorage.removeItem('isLoggedIn');
        setUser(null);
      } else {
        // Production mode with real Supabase
        await supabase.auth.signOut();
      }
      
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during logout",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
