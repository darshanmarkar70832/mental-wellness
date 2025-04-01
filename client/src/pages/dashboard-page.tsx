import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Brain, Clock, MessageCircle, HistoryIcon, PlusCircle, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsageStats from "@/components/dashboard/usage-stats";
import SessionHistory from "@/components/dashboard/session-history";
import type { Payment, Conversation } from "@shared/schema";

export default function DashboardPage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  
  // Fetch user's remaining minutes
  const { data: minutesData, isLoading: loadingMinutes } = useQuery({
    queryKey: ["/api/user/minutes"],
    refetchInterval: 60000, // Refresh every minute
  });
  
  // Fetch payment history
  const { data: payments, isLoading: loadingPayments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });
  
  // Fetch conversation history
  const { data: conversations, isLoading: loadingConversations } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });
  
  // Start a new conversation
  const startConversation = async () => {
    try {
      const res = await apiRequest("POST", "/api/conversations");
      const conversation = await res.json();
      setLocation(`/chat?id=${conversation.id}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };
  
  // Redirect to payment page
  const goToPayment = () => {
    setLocation("/payment");
  };
  
  if (!user) {
    return null; // Protected route will handle redirect
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top navigation */}
      <header className="bg-card border-b border-border fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">MindfulAI</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            
            <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()}>
              {logoutMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log out"}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome back, {user.firstName}!</h2>
            <p className="text-muted-foreground">
              Your mental wellness journey continues here
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={goToPayment} variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Buy Time
            </Button>
            
            <Button onClick={startConversation} className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              New Conversation
            </Button>
          </div>
        </div>
        
        {/* Minutes summary card */}
        <GlassCard className="mb-8 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Remaining Time</h3>
                {loadingMinutes ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <p>Loading...</p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold">{minutesData?.minutes.toFixed(1)} minutes</p>
                )}
              </div>
            </div>
            
            <Button onClick={goToPayment} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add More Time
            </Button>
          </div>
        </GlassCard>
        
        {/* Main content tabs */}
        <Tabs defaultValue="usage">
          <TabsList className="mb-6">
            <TabsTrigger value="usage">Usage Statistics</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage">
            <UsageStats 
              isLoading={loadingPayments || loadingConversations}
              payments={payments || []}
              conversations={conversations || []}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <SessionHistory 
              isLoading={loadingConversations}
              conversations={conversations || []}
              onStartNewConversation={startConversation}
              onContinueConversation={(id) => setLocation(`/chat?id=${id}`)}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
