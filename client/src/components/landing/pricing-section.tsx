import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingSection() {
  const [, setLocation] = useLocation();
  
  const pricingPlans = [
    {
      name: "Basic Package",
      price: 199,
      minutes: 20,
      description: "20 minutes of AI therapy",
      features: [
        "Basic therapeutic conversations",
        "Simple mood tracking",
        "5 guided exercises"
      ],
      isPopular: false
    },
    {
      name: "Standard Package",
      price: 499,
      minutes: 60,
      description: "60 minutes of AI therapy",
      features: [
        "Advanced therapeutic techniques",
        "Detailed mood analytics",
        "20 guided exercises",
        "Wellness reminders"
      ],
      isPopular: true
    },
    {
      name: "Premium Package",
      price: 999,
      minutes: 150,
      description: "150 minutes of AI therapy",
      features: [
        "All therapeutic features",
        "Comprehensive analytics",
        "Unlimited guided exercises",
        "Priority support",
        "Personalized wellness plan"
      ],
      isPopular: false
    }
  ];
  
  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-card relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-heading">Simple, Transparent Pricing</h2>
          <div className="w-20 h-1 bg-accent mx-auto mt-2 mb-6 rounded-full"></div>
          <p className="text-gray-300 max-w-3xl mx-auto">Pay only for what you use, with no subscriptions or hidden fees</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <GlassCard 
              key={index} 
              className={`p-6 flex flex-col ${plan.isPopular ? 'border-primary relative transform scale-105 z-10' : 'border-border'}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-tr-lg rounded-bl-lg">
                  POPULAR
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                  <span className="text-gray-400">/package</span>
                </div>
                <p className="text-gray-300 mt-2">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="text-secondary mr-2 h-5 w-5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <Button 
                  onClick={() => setLocation("/auth")}
                  className="w-full" 
                  variant={plan.isPopular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-6">All plans include secure payment via Cashfree and 100% privacy protection</p>
          <div className="flex flex-wrap justify-center gap-4">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" className="h-8" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard" className="h-8" />
            <img src="https://www.cashfree.com/images/logo.svg" alt="Cashfree" className="h-8" style={{ filter: "brightness(10)" }} />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" alt="Google Pay" className="h-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
