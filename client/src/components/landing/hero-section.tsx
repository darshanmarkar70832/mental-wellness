import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Brain } from "lucide-react";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  
  return (
    <section id="hero" className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl font-heading">
            <span className="block">AI-Powered</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Mental Wellness Platform</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Addressing the growing mental health crisis with accessible, private AI therapy sessions. Personalized support in your pocket, 24/7.
          </p>
          <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
            <div className="rounded-md shadow">
              <Button
                onClick={() => setLocation("/auth")}
                className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10"
              >
                Try for free
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button
                variant="outline"
                onClick={() => {
                  const element = document.getElementById("how-it-works");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10"
              >
                How it works
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-16 relative">
          <GlassCard className="overflow-hidden shadow-xl p-4 sm:p-6">
            <img 
              src="https://images.unsplash.com/photo-1573497701240-345a300b8d36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Person using MindfulAI app on mobile device" 
              className="w-full h-full object-cover rounded-lg shadow-lg" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80 rounded-xl"></div>
            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-white font-medium text-lg md:text-xl">Real-time mental wellness support</p>
                <p className="text-gray-300 text-sm md:text-base mt-1">Private, personalized AI therapy anytime, anywhere</p>
              </div>
              <div>
                <Button
                  onClick={() => setLocation("/auth")}
                  className="inline-flex items-center"
                >
                  <i className="fas fa-play-circle mr-2"></i> Watch Demo
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
