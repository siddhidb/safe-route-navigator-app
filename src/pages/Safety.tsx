
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Bell, Map, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Safety: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const safetyTips = [
    {
      id: 1,
      title: "Stay Aware of Surroundings",
      description: "Always pay attention to your surroundings, especially in unfamiliar areas. Keep your head up and avoid distractions like phones.",
      icon: <Shield className="h-8 w-8 text-primary" />
    },
    {
      id: 2,
      title: "Plan Your Route",
      description: "Before traveling, plan your route and let someone know your itinerary, especially if traveling alone or at night.",
      icon: <Map className="h-8 w-8 text-primary" />
    },
    {
      id: 3,
      title: "Trust Your Instincts",
      description: "If a situation or area doesn't feel right, trust your instincts and leave. Your intuition is a powerful safety tool.",
      icon: <AlertTriangle className="h-8 w-8 text-primary" />
    },
    {
      id: 4,
      title: "Stay Connected",
      description: "Keep your phone charged and accessible. Consider using location sharing with trusted friends or family.",
      icon: <Bell className="h-8 w-8 text-primary" />
    }
  ];

  const hazardAlerts = [
    {
      id: 1,
      title: "Downtown Construction Zone",
      description: "Major construction on Main Street causing detours and reduced visibility. Active between 7AM-7PM.",
      severity: "medium",
      date: "Apr 8, 2025"
    },
    {
      id: 2,
      title: "Flooding on Riverside Drive",
      description: "Recent rainfall has caused road flooding near the river crossing. Seek alternate routes.",
      severity: "high",
      date: "Apr 7, 2025"
    },
    {
      id: 3,
      title: "Spring Festival Road Closures",
      description: "Multiple downtown streets closed for Spring Festival this weekend. Expect heavy pedestrian traffic.",
      severity: "low",
      date: "Apr 5, 2025"
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">High</span>;
      case 'medium':
        return <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Medium</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Low</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Safety Overview</TabsTrigger>
              <TabsTrigger value="tips">Safety Tips</TabsTrigger>
              <TabsTrigger value="alerts">Hazard Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Safety Center
                  </CardTitle>
                  <CardDescription>
                    Your hub for safety information, alerts, and route guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => setActiveTab('tips')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <h3 className="font-medium text-lg">Safety Tips</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Learn how to stay safe while traveling with our expert safety recommendations.
                      </p>
                    </div>
                    
                    <div 
                      className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => setActiveTab('alerts')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Bell className="h-6 w-6 text-primary" />
                        <h3 className="font-medium text-lg">Hazard Alerts</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Stay informed about current hazards, road closures, and safety concerns.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-5 bg-gray-50">
                    <h3 className="font-medium text-lg mb-3">About Our Safety Ratings</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Our route safety algorithm analyzes multiple factors to provide you with the safest path:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                      <li>Historical crime data from local police departments</li>
                      <li>Real-time hazard reports from city services</li>
                      <li>Crowdsourced safety information from our user community</li>
                      <li>Time-of-day safety analysis based on lighting and activity</li>
                      <li>Walking conditions including sidewalk presence and road crossings</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Safety Tips
                  </CardTitle>
                  <CardDescription>
                    Follow these recommendations to stay safe while traveling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {safetyTips.map(tip => (
                      <div key={tip.id} className="flex gap-4">
                        <div className="mt-1">{tip.icon}</div>
                        <div>
                          <h3 className="font-medium text-lg">{tip.title}</h3>
                          <p className="text-gray-600">{tip.description}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
                      <h3 className="font-medium flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                        Emergency Contacts
                      </h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <p><strong>Emergency Services:</strong> 911</p>
                        <p><strong>Non-Emergency Police:</strong> 311</p>
                        <p><strong>Route Guardian Support:</strong> support@routeguardian.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Current Hazard Alerts
                  </CardTitle>
                  <CardDescription>
                    Stay informed about hazards that might affect your journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hazardAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {hazardAlerts.map(alert => (
                        <div key={alert.id} className="border rounded-lg p-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{alert.title}</h3>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-gray-500">Reported: {alert.date}</span>
                            <Button variant="outline" size="sm">View on Map</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No active hazard alerts in your area</p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Button className="w-full">Report a Hazard</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Safety;
