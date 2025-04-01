import { GlassCard } from "@/components/ui/glass-card";
import { DollarSign, Clock, Ban } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      icon: <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
      title: "Prohibitive Costs",
      description: "Therapy sessions cost $100-200 per hour, making regular care inaccessible for many people."
    },
    {
      icon: <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
      title: "Long Wait Times",
      description: "Average wait time to see a therapist is 3-8 weeks, delaying critical mental health support."
    },
    {
      icon: <Ban className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
      title: "Stigma Barriers",
      description: "Social stigma prevents many from seeking the help they need for mental health issues."
    }
  ];
  
  return (
    <section id="problem" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">The Mental Health Crisis</h2>
          <div className="w-16 sm:w-20 h-1 bg-primary mx-auto mt-2 mb-4 sm:mb-6 rounded-full"></div>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto">Mental health issues are affecting more people than ever before, but access to care remains limited and expensive.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {problems.map((problem, index) => (
            <GlassCard key={index} className="p-4 sm:p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-primary/20 rounded-full mb-3 sm:mb-4">
                {problem.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{problem.title}</h3>
              <p className="text-sm sm:text-base text-gray-300">{problem.description}</p>
            </GlassCard>
          ))}
        </div>
        
        <div className="mt-12 sm:mt-16 max-w-3xl mx-auto">
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 font-heading">The Numbers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">1 in 5</p>
                <p className="text-sm sm:text-base text-gray-300 mt-2">Adults experience mental illness annually</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">60%</p>
                <p className="text-sm sm:text-base text-gray-300 mt-2">Don't receive treatment due to barriers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">$1T</p>
                <p className="text-sm sm:text-base text-gray-300 mt-2">Global economic cost annually</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
