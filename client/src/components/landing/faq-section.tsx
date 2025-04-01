import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqSection() {
  const [openItem, setOpenItem] = useState<number | null>(null);
  
  const faqs: FaqItem[] = [
    {
      question: "Is MindfulAI as effective as traditional therapy?",
      answer: "MindfulAI is designed to be a supplement to traditional therapy, not a complete replacement. It's highly effective for managing day-to-day mental wellness, providing coping strategies, and offering support whenever you need it. For severe mental health conditions, we recommend using MindfulAI alongside professional treatment."
    },
    {
      question: "How does the pay-per-use model work?",
      answer: "You purchase time packages through our Cashfree integration. Minutes are deducted from your account only when you're actively engaging with MindfulAI. You can top up anytime, and unused minutes never expire. This makes it flexible and affordable compared to subscription services."
    },
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. We employ end-to-end encryption for all conversations. Your data is never used to train our AI models, and we never share your information with third parties. Your privacy is our top priority."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 7-day satisfaction guarantee. If you're not happy with MindfulAI within 7 days of your first paid package, we'll provide a full refund. Simply contact our support team."
    },
    {
      question: "Is there an app available?",
      answer: "Currently, MindfulAI is available as a web application that works on all devices. Native mobile apps for iOS and Android are in development and will be released soon."
    }
  ];
  
  const toggleItem = (index: number) => {
    if (openItem === index) {
      setOpenItem(null);
    } else {
      setOpenItem(index);
    }
  };
  
  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-heading">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-2 mb-6 rounded-full"></div>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <GlassCard key={index} className="overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => toggleItem(index)}
                aria-expanded={openItem === index}
              >
                <span className="text-white font-medium">{faq.question}</span>
                <ChevronDown 
                  className={`text-gray-400 transition-transform duration-200 ${
                    openItem === index ? "transform rotate-180" : ""
                  }`} 
                />
              </button>
              <div 
                className={`px-6 py-4 border-t border-border bg-background transition-all duration-200 overflow-hidden ${
                  openItem === index ? "block" : "hidden"
                }`}
              >
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
