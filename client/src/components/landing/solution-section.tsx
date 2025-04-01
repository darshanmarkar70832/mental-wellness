import { GlassCard } from "@/components/ui/glass-card";
import { Bot, Lock, CreditCard } from "lucide-react";

export default function SolutionSection() {
  const solutions = [
    {
      icon: <Bot className="text-xl text-secondary" />,
      title: "AI Therapy Sessions",
      description: "Advanced AI that provides evidence-based therapeutic techniques including CBT, mindfulness, and personalized mental wellness strategies."
    },
    {
      icon: <Lock className="text-xl text-secondary" />,
      title: "Privacy-First Design",
      description: "All conversations are encrypted and private. We never share your data with third parties or use it for training."
    },
    {
      icon: <CreditCard className="text-xl text-secondary" />,
      title: "Pay-Per-Use Model",
      description: "Only pay for what you use, with sessions starting at just ₹50. No subscriptions or hidden fees."
    }
  ];
  
  return (
    <section id="solution" className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-heading">Our Solution: MindfulAI</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-2 mb-6 rounded-full"></div>
          <p className="text-gray-300 max-w-3xl mx-auto">AI-powered mental wellness support that's affordable, accessible, and available 24/7.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <GlassCard key={index} className="p-6 flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-secondary/20 rounded-full">
                      {solution.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{solution.title}</h3>
                    <p className="text-gray-300">{solution.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <GlassCard className="p-4 shadow-xl">
                <div className="bg-card rounded-lg overflow-hidden">
                  <div className="p-4 bg-background flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto text-sm text-gray-400">MindfulAI Assistant</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">AI</div>
                      <div className="ml-3 bg-background p-3 rounded-lg max-w-xs">
                        <p className="text-white">Hi there! I'm your MindfulAI assistant. How are you feeling today?</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="mr-3 bg-primary/20 p-3 rounded-lg max-w-xs">
                        <p className="text-white">I've been feeling overwhelmed with work lately and it's affecting my sleep.</p>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold">U</div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">AI</div>
                      <div className="ml-3 bg-background p-3 rounded-lg max-w-xs">
                        <p className="text-white">I understand how work stress can disrupt sleep. Let's explore some strategies that might help you manage this better...</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full bg-background p-3 rounded-lg pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-primary" 
                        placeholder="Type your message..."
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <div className="absolute -top-4 -right-4 bg-accent text-dark font-bold py-2 px-4 rounded-full transform rotate-6 shadow-lg">
                Available 24/7
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
