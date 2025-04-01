import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsageStats from "@/components/dashboard/usage-stats";
import SessionHistory from "@/components/dashboard/session-history";
import type { Conversation } from "@shared/schema";

export default function DashboardPage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  
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
  
  if (!user) {
    return null; // Protected route will handle redirect
  }

  return (
    <main className="container mx-auto px-4 pt-24 pb-12">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Welcome back, {user.firstName}!</h2>
          <p className="text-muted-foreground">
            Your mental wellness journey continues here
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={startConversation} className="flex items-center gap-2">
            Start New Conversation
          </Button>
        </div>
      </div>
      
      {/* Main content tabs */}
      <TabsList className="mb-6">
        <TabsTrigger value="usage">Usage Statistics</TabsTrigger>
        <TabsTrigger value="history">Session History</TabsTrigger>
      </TabsList>
      
      
      
      <TabsContent value="history">
        <SessionHistory 
          isLoading={loadingConversations}
          conversations={conversations || []}
          onStartNewConversation={startConversation}
          onContinueConversation={(id) => setLocation(`/chat?id=${id}`)}
        />
      </TabsContent>
    </main>
  );
}
