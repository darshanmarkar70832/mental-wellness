import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, ArrowLeft, Loader2, Users, Clock, LineChart } from "lucide-react";
import type { User, Payment, Conversation } from "@shared/schema";

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Fetch all users (admin only)
  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });
  
  if (!user || !user.isAdmin) {
    // Redirect non-admin users
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <GlassCard className="p-6 max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Button onClick={() => setLocation("/dashboard")}>
            Return to Dashboard
          </Button>
        </GlassCard>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top navigation */}
      <header className="bg-card border-b border-border fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Brain className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold">MindfulAI Admin</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Total Users</h3>
            </div>
            
            {loadingUsers ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <p>Loading...</p>
              </div>
            ) : (
              <p className="text-3xl font-bold">{users?.length || 0}</p>
            )}
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Total Minutes Used</h3>
            </div>
            
            <p className="text-3xl font-bold">0</p>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <LineChart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Revenue</h3>
            </div>
            
            <p className="text-3xl font-bold">₹0</p>
          </GlassCard>
        </div>
        
        {/* Main content tabs */}
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4">User Management</h3>
              
              {loadingUsers ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-3">ID</th>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Username</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Minutes Left</th>
                        <th className="text-left p-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((user) => (
                        <tr key={user.id} className="border-b border-border">
                          <td className="p-3">{user.id}</td>
                          <td className="p-3">{user.firstName} {user.lastName}</td>
                          <td className="p-3">{user.username}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.remainingMinutes.toFixed(1)}</td>
                          <td className="p-3">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="conversations">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4">Conversation Analytics</h3>
              <p className="text-muted-foreground py-8 text-center">
                No conversation data available yet.
              </p>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="payments">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4">Payment Reports</h3>
              <p className="text-muted-foreground py-8 text-center">
                No payment data available yet.
              </p>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
