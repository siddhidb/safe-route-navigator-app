
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { getUserProfile } from '@/services/authService';
import { UserProfile } from '@/types';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const result = await getUserProfile(user.id);
        
        if (result.success && result.profile) {
          setProfile(result.profile as UserProfile);
        } else {
          toast({
            title: "Error",
            description: "Failed to load profile",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user, toast]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Profile
            </CardTitle>
            <CardDescription>
              View and manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : profile ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input value={profile.username} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={profile.email} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Created</label>
                  <Input 
                    value={new Date(profile.created_at).toLocaleDateString()} 
                    readOnly 
                    className="bg-gray-50" 
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Profile information not available
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              className="w-full" 
              variant="default"
              onClick={() => navigate('/history')}
            >
              View Route History
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
