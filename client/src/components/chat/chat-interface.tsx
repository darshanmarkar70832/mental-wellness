import { useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Message } from "@shared/schema";

interface ChatInterfaceProps {
  isLoading: boolean;
  messages: Message[];
}

export default function ChatInterface({ isLoading, messages }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="max-w-md text-center">
          <h3 className="text-xl font-bold mb-2">Start a Conversation</h3>
          <p className="text-muted-foreground mb-4">
            Share what's on your mind, and our AI will respond with insights and support
            tailored to your needs.
          </p>
          <p className="text-sm text-muted-foreground">
            Your conversations are private and encrypted.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="space-y-4 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] ${
                message.isUser
                  ? "bg-primary/20 rounded-2xl rounded-tr-sm"
                  : "bg-card rounded-2xl rounded-tl-sm"
              } p-3 md:p-4`}
            >
              {!message.isUser && (
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold mr-2">
                    AI
                  </div>
                  <p className="text-sm font-medium">MindfulAI</p>
                </div>
              )}
              <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs text-muted-foreground text-right mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
