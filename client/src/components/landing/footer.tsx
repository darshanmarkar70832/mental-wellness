import { Brain } from "lucide-react";
import { useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();
  
  // Function to scroll to section or navigate
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setLocation(href);
    }
  };
  
  return (
    <footer className="bg-card py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <Brain className="text-primary h-6 w-6 mr-2" />
              <span className="font-heading font-bold text-xl text-white">MindfulAI</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Accessible, affordable AI-powered mental wellness support, available 24/7. 
              Your journey to better mental health starts here.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Sitemap</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("#features")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#pricing")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#testimonials")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Testimonials
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#faq")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("/privacy")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("/terms")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("/cookies")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("/gdpr")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  GDPR Compliance
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} MindfulAI. All rights reserved.
          </p>
          <div className="flex items-center">
            <p className="text-gray-400 text-sm">Secured by</p>
            <img 
              src="https://www.cashfree.com/images/logo.svg" 
              alt="Cashfree" 
              className="h-5 ml-2" 
              style={{ filter: "brightness(10)" }} 
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
