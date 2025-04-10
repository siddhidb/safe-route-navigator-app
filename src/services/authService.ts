
import { supabase, isDevelopmentMode } from '@/lib/supabase';

// Register new user
export const registerUser = async (email: string, password: string, username: string) => {
  if (isDevelopmentMode()) {
    // For development mode, simulate registration
    const mockUser = { 
      id: 'dev-user-id', 
      email,
      user_metadata: { username }
    };
    localStorage.setItem('devUser', JSON.stringify(mockUser));
    localStorage.setItem('isLoggedIn', 'true');
    return { success: true, user: mockUser };
  }

  try {
    // Register the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create profile record in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id, 
            username, 
            email 
          }
        ]);

      if (profileError) throw profileError;
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error };
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  if (isDevelopmentMode()) {
    // For development mode, simulate login
    const mockUser = { 
      id: 'dev-user-id', 
      email,
      user_metadata: { username: email.split('@')[0] }
    };
    localStorage.setItem('devUser', JSON.stringify(mockUser));
    localStorage.setItem('isLoggedIn', 'true');
    return { 
      success: true, 
      session: { user: mockUser },
      user: mockUser 
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, session: data.session, user: data.user };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error };
  }
};

// Log out user
export const logoutUser = async () => {
  if (isDevelopmentMode()) {
    // For development mode, clear local storage
    localStorage.removeItem('devUser');
    localStorage.removeItem('isLoggedIn');
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error };
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  if (isDevelopmentMode()) {
    // For development mode, get from localStorage
    const devUser = localStorage.getItem('devUser');
    if (devUser) {
      const user = JSON.parse(devUser);
      return { 
        success: true, 
        profile: {
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0],
          email: user.email,
          created_at: new Date().toISOString()
        } 
      };
    }
    return { success: false, error: 'User not found' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { success: true, profile: data };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error };
  }
};
