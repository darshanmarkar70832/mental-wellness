import { GlassCard } from "@/components/ui/glass-card";
import { Bot, Lock, CreditCard } from "lucide-react";

export default function SolutionSection() {
  const solutions = [
    {
      icon: <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />,
      title: "AI Therapy Sessions",
      description: "Advanced AI that provides evidence-based therapeutic techniques including CBT, mindfulness, and personalized mental wellness strategies."
    },
    {
      icon: <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />,
      title: "Privacy-First Design",
      description: "All conversations are encrypted and private. We never share your data with third parties or use it for training."
    },
    {
      icon: <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />,
      title: "Pay-Per-Use Model",
      description: "Only pay for what you use, with sessions starting at just ₹50. No subscriptions or hidden fees."
    }
  ];
  
  return (
    <section id="solution" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-primary/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">Our Solution: MindfulAI</h2>
          <div className="w-16 sm:w-20 h-1 bg-secondary mx-auto mt-2 mb-4 sm:mb-6 rounded-full"></div>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto">AI-powered mental wellness support that's affordable, accessible, and available 24/7.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-4 sm:space-y-6">
              {solutions.map((solution, index) => (
                <GlassCard key={index} className="p-4 sm:p-6 flex">
                  <div className="flex-shrink-0 mr-3 sm:mr-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-secondary/20 rounded-full">
                      {solution.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{solution.title}</h3>
                    <p className="text-sm sm:text-base text-gray-300">{solution.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <GlassCard className="p-3 sm:p-4 shadow-xl">
                <div className="bg-card rounded-lg overflow-hidden">
                  <div className="p-3 sm:p-4 bg-background flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto text-xs sm:text-sm text-gray-400">MindfulAI Assistant</div>
                  </div>
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs sm:text-sm font-bold">AI</div>
                      <div className="ml-2 sm:ml-3 bg-background p-2 sm:p-3 rounded-lg max-w-xs">
                        <p className="text-white text-sm sm:text-base">Hi there! I'm your MindfulAI assistant. How are you feeling today?</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="mr-2 sm:mr-3 bg-primary/20 p-2 sm:p-3 rounded-lg max-w-xs">
                        <p className="text-white text-sm sm:text-base">I've been feeling overwhelmed with work lately and it's affecting my sleep.</p>
                      </div>
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold">U</div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs sm:text-sm font-bold">AI</div>
                      <div className="ml-2 sm:ml-3 bg-background p-2 sm:p-3 rounded-lg max-w-xs">
                        <p className="text-white text-sm sm:text-base">I understand how work stress can disrupt sleep. Let's explore some strategies that might help you manage this better...</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 border-t border-border">
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full bg-background p-2 sm:p-3 rounded-lg pl-3 sm:pl-4 pr-10 sm:pr-12 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary" 
                        placeholder="Type your message..."
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-primary text-white">
                        <i className="fas fa-paper-plane text-xs sm:text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 bg-accent text-dark font-bold py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm rounded-full transform rotate-6 shadow-lg">
                Available 24/7
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
