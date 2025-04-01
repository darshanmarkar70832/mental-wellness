import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Brain } from "lucide-react";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  
  return (
    <section id="hero" className="pt-16 sm:pt-20 md:pt-32 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[300px] md:w-[400px] h-[250px] sm:h-[300px] md:h-[400px] bg-secondary/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-white font-heading">
            <span className="block">AI-Powered</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Mental Wellness Platform</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 md:mt-5 md:max-w-3xl">
            Addressing the growing mental health crisis with accessible, private AI therapy sessions. Personalized support in your pocket, 24/7.
          </p>
          <div className="mt-8 sm:mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
            <div className="rounded-md shadow w-full sm:w-auto">
              <Button
                onClick={() => setLocation("/auth")}
                className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base md:text-lg md:px-10"
              >
                Try for free
              </Button>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => {
                  const element = document.getElementById("how-it-works");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base md:text-lg md:px-10"
              >
                How it works
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 sm:mt-16 relative">
          <GlassCard className="overflow-hidden shadow-xl p-3 sm:p-4 md:p-6">
            <img 
              src="https://images.unsplash.com/photo-1573497701240-345a300b8d36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Person using MindfulAI app on mobile device" 
              className="w-full h-full object-cover rounded-lg shadow-lg" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80 rounded-xl"></div>
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <p className="text-white font-medium text-base sm:text-lg md:text-xl">Real-time mental wellness support</p>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base mt-1">Private, personalized AI therapy anytime, anywhere</p>
                </div>
                <div className="flex justify-center md:justify-start">
                  <Button
                    onClick={() => setLocation("/auth")}
                    className="inline-flex items-center text-sm sm:text-base"
                  >
                    <i className="fas fa-play-circle mr-2"></i> Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
