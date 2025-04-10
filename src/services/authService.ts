
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

// Register new user
export const registerUser = async (email: string, password: string, username: string) => {
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
