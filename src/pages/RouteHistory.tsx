
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { RouteHistory as RouteHistoryType } from '@/types';

const RouteHistory: React.FC = () => {
  const [history, setHistory] = useState<RouteHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRouteHistory = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('route_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setHistory(data as RouteHistoryType[]);
      } catch (error) {
        console.error('Error fetching route history:', error);
        toast({
          title: "Error",
          description: "Failed to load route history",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRouteHistory();
  }, [user, toast]);

  const getSafetyScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 4) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')}
              className="text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Your Route History
              </CardTitle>
              <CardDescription>
                Records of your previous route searches and selected paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">
                            {item.source} to {item.destination}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className={`font-bold ${getSafetyScoreColor(item.safety_score)}`}>
                          {item.safety_score.toFixed(1)}/10
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Route type:</span> {item.route_taken.replace('Route', '')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No route history found</p>
                  <Button 
                    onClick={() => navigate('/location')} 
                    variant="outline"
                    className="mt-4"
                  >
                    Find a new route
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RouteHistory;
