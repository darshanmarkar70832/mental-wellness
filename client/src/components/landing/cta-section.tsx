import { useState } from "react";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function CtaSection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email is required",
        description: "Please enter your email address to get started.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Success!",
        description: "Thank you for your interest. Check your email for the free trial details.",
      });
      setLocation("/auth?tab=register");
    }, 1500);
  };
  
  return (
    <section id="try-now" className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-4xl mx-auto">
        <GlassCard className="p-8 md:p-12 border border-primary relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/20 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white font-heading">Start Your Mental Wellness Journey</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mt-4 mb-8">
              Try MindfulAI free for 10 minutes. No credit card required. Experience the future of accessible mental health support.
            </p>
            
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-background px-4 py-3"
                  placeholder="Enter your email"
                />
                <Button 
                  type="submit" 
                  className="px-6 py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Get Free Trial
                </Button>
              </form>
              <p className="text-gray-400 text-sm mt-3">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
