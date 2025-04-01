import { GlassCard } from "@/components/ui/glass-card";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      rating: 5,
      text: "MindfulAI has been a lifesaver during my busiest periods. Being able to talk through my anxiety anytime has helped me stay centered.",
      author: "Priya S.",
      title: "Software Engineer"
    },
    {
      rating: 4.5,
      text: "As someone who couldn't afford traditional therapy, MindfulAI has been a blessing. The exercises and conversations have genuinely improved my mental state.",
      author: "Rajiv K.",
      title: "College Student"
    },
    {
      rating: 5,
      text: "The pay-as-you-go model is perfect. I can talk to MindfulAI whenever I need to without worrying about a big monthly bill. Highly recommend!",
      author: "Ananya M.",
      title: "Marketing Manager"
    }
  ];
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-amber-400 text-amber-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="text-amber-400" />
          <Star className="absolute top-0 left-0 fill-amber-400 text-amber-400 overflow-hidden w-[50%]" />
        </span>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-amber-400" />);
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  return (
    <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-heading">What Users Say</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-2 mb-6 rounded-full"></div>
          <p className="text-gray-300 max-w-3xl mx-auto">Join thousands who have found support with MindfulAI</p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <GlassCard key={index} className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-300 mb-6">{testimonial.text}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-white font-medium">{testimonial.author}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
