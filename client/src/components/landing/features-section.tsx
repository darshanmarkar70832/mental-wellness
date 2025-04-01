import { GlassCard } from "@/components/ui/glass-card";
import { MessageSquare, TrendingUp, Brain, BookOpen, Bell, Lock } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <MessageSquare className="text-xl text-primary" />,
      title: "Therapeutic Conversations",
      description: "AI-powered therapeutic dialogues using evidence-based approaches like CBT and mindfulness techniques."
    },
    {
      icon: <TrendingUp className="text-xl text-primary" />,
      title: "Mood Tracking",
      description: "Monitor your mental health progress over time with intuitive visualizations and insights."
    },
    {
      icon: <Brain className="text-xl text-primary" />,
      title: "Personalized Growth",
      description: "The AI learns from your interactions to provide increasingly personalized support."
    },
    {
      icon: <BookOpen className="text-xl text-primary" />,
      title: "Guided Exercises",
      description: "Library of mental wellness exercises for stress, anxiety, depression, and more."
    },
    {
      icon: <Bell className="text-xl text-primary" />,
      title: "Wellness Reminders",
      description: "Optional reminders to practice self-care and maintain mental health routines."
    },
    {
      icon: <Lock className="text-xl text-primary" />,
      title: "Complete Privacy",
      description: "End-to-end encryption and strict privacy policies protect your sensitive information."
    }
  ];
  
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-heading">Key Features</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-2 mb-6 rounded-full"></div>
          <p className="text-gray-300 max-w-3xl mx-auto">Comprehensive mental wellness support designed for your needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassCard 
              key={index} 
              className="p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-primary/20 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
