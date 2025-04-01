import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare, Search, Calendar, Clock, ArrowUpRight } from "lucide-react";
import type { Conversation } from "@shared/schema";

interface SessionHistoryProps {
  isLoading: boolean;
  conversations: Conversation[];
  onStartNewConversation: () => void;
  onContinueConversation: (id: number) => void;
}

export default function SessionHistory({
  isLoading,
  conversations,
  onStartNewConversation,
  onContinueConversation
}: SessionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) => {
    // In a real app, you'd search through message content as well
    return conv.id.toString().includes(searchTerm);
  });
  
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <GlassCard className="p-6 text-center">
        <div className="py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Conversations Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start your first conversation with MindfulAI to get personalized mental wellness support.
          </p>
          <Button onClick={onStartNewConversation}>
            Start New Conversation
          </Button>
        </div>
      </GlassCard>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 w-full sm:w-[300px]"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={onStartNewConversation}>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
      
      <div className="space-y-4">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <GlassCard 
              key={conversation.id} 
              className="p-4 hover:border-primary/50 transition-all duration-200 cursor-pointer"
              onClick={() => onContinueConversation(conversation.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    Conversation #{conversation.id}
                    {conversation.status === "active" && (
                      <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </h3>
                  
                  <div className="flex flex-wrap gap-x-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {new Date(conversation.startedAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {new Date(conversation.startedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    
                    {conversation.durationMinutes && (
                      <div className="flex items-center">
                        <span className="font-medium">{conversation.durationMinutes.toFixed(1)} min</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
