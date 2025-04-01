import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "About", href: "#about" }
  ];
  
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || mobileMenuOpen ? "bg-card/90 backdrop-blur-md border-b border-border" : ""
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0 flex items-center">
              <Brain className="text-primary h-6 w-6 mr-2" />
              <span className="font-heading font-bold text-xl text-white">MindfulAI</span>
            </a>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {user ? (
                <Button
                  onClick={() => setLocation("/dashboard")}
                  variant="default"
                  size="sm"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setLocation("/auth")}
                    variant="outline"
                    size="sm"
                    className="mr-3"
                  >
                    Log in
                  </Button>
                  <Button
                    onClick={() => setLocation("/auth?tab=register")}
                    variant="default"
                    size="sm"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
            <div className="ml-3 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open main menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-400" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-b border-border">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-primary/10 w-full text-left"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
