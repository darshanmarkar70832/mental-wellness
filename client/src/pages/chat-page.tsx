import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Brain, Clock, ArrowLeft, SendIcon, Loader2 } from "lucide-react";
import ChatInterface from "@/components/chat/chat-interface";
import type { Conversation, Message } from "@shared/schema";

export default function ChatPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  
  // Parse conversation ID from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setConversationId(parseInt(id));
    }
  }, []);
  
  // Fetch conversation details
  const { data: conversation, isLoading: loadingConversation } = useQuery<Conversation>({
    queryKey: ["/api/conversations", conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error("No conversation ID");
      const res = await fetch(`/api/conversations/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return res.json();
    },
    enabled: !!conversationId,
  });
  
  // Fetch messages for the conversation
  const { data: messages, isLoading: loadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/conversations", conversationId, "messages"],
    queryFn: async () => {
      if (!conversationId) throw new Error("No conversation ID");
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  });
  
  // Fetch user's remaining minutes
  const { data: minutesData, isLoading: loadingMinutes } = useQuery({
    queryKey: ["/api/user/minutes"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) throw new Error("No conversation ID");
      const res = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, {
        content,
        isUser: true
      });
      return res.json();
    },
    onSuccess: () => {
      // Clear the input and refetch messages
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/minutes"] });
    }
  });
  
  // End conversation mutation
  const endConversationMutation = useMutation({
    mutationFn: async () => {
      if (!conversationId) throw new Error("No conversation ID");
      const res = await apiRequest("POST", `/api/conversations/${conversationId}/end`, {
        duration: 1 // Default duration in minutes
      });
      return res.json();
    },
    onSuccess: () => {
      setLocation("/dashboard");
    }
  });
  
  const handleSendMessage = () => {
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message.trim());
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (!user) {
    return null; // Protected route will handle redirect
  }
  
  const isLoading = loadingConversation || loadingMessages || !conversationId;
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top navigation */}
      <header className="bg-card border-b border-border fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation("/dashboard")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <Brain className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">MindfulAI Chat</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-primary mr-1" />
              {loadingMinutes ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="text-sm">{minutesData?.minutes.toFixed(1)} min remaining</span>
              )}
            </div>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => endConversationMutation.mutate()}
              disabled={endConversationMutation.isPending}
            >
              {endConversationMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              End Chat
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 pt-20 pb-24">
        <ChatInterface 
          isLoading={isLoading}
          messages={messages || []}
        />
      </main>
      
      {/* Chat input area */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-4 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full bg-background border border-border rounded-lg pl-4 pr-12 py-3 h-16 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type your message..."
              disabled={sendMessageMutation.isPending || (minutesData && minutesData.minutes <= 0)}
            ></textarea>
            
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2" 
              size="icon"
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending || !message.trim() || (minutesData && minutesData.minutes <= 0)}
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          {minutesData && minutesData.minutes <= 0 && (
            <p className="text-red-500 mt-2 text-sm">
              You've run out of minutes. Please purchase more to continue chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
