import { GlassCard } from "@/components/ui/glass-card";

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Create your account in seconds. No credit card required to start your free trial."
    },
    {
      number: 2,
      title: "Start Conversations",
      description: "Begin talking with MindfulAI about anything that's on your mind. No judgment, just support."
    },
    {
      number: 3,
      title: "Pay Only For Usage",
      description: "Add credits to your account with secure Cashfree payments. Only pay for the minutes you use."
    },
    {
      number: 4,
      title: "Track Your Progress",
      description: "Monitor your mental wellness journey through personalized insights and recommendations."
    }
  ];
  
  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-heading">How It Works</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-2 mb-6 rounded-full"></div>
          <p className="text-gray-300 max-w-3xl mx-auto">Simple, secure, and effective mental wellness support</p>
        </div>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/30 hidden md:block"></div>
          
          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center">
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 mb-6 md:mb-0 md:text-right order-2 md:order-1' : 'md:pr-12 order-2'}`}>
                  {index % 2 === 0 && (
                    <GlassCard className="p-6 inline-block">
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-300">{step.description}</p>
                    </GlassCard>
                  )}
                </div>
                <div className="md:w-12 flex justify-center order-1 md:order-2 mb-6 md:mb-0">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10">
                    {step.number}
                  </div>
                </div>
                <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:pl-12 mb-6 md:mb-0 order-3' : 'md:pl-12 order-3'}`}>
                  {index % 2 === 1 && (
                    <GlassCard className="p-6 inline-block">
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-300">{step.description}</p>
                    </GlassCard>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
