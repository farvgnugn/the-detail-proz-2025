import React, { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';

interface HeaderProps {
  phone: {
    number: string;
    formatted: string;
    link: string;
  };
}

const Header: React.FC<HeaderProps> = ({ phone }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
      isScrolled 
        ? 'bg-gradient-to-r from-purple-900/60 via-gray-900/60 to-purple-900/60 backdrop-blur-md shadow-2xl' 
        : 'bg-transparent'
    }`}>
      <div className={`container mx-auto px-4 transition-all duration-700 ease-out ${
        isScrolled ? 'py-1' : 'py-6'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/assets/The Detail Proz.png" 
              alt="The Detail Proz Logo" 
              className={`w-auto object-contain transition-all duration-700 ease-out ${
                isScrolled ? 'h-20 max-w-[360px]' : 'h-40 max-w-[720px]'
              }`}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('about')}
              className="font-medium transition-colors text-white hover:text-purple-300"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="font-medium transition-colors text-white hover:text-purple-300"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="font-medium transition-colors text-white hover:text-purple-300"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="font-medium transition-colors text-white hover:text-purple-300"
            >
              Contact
            </button>
            <a 
              href={phone.link}
              className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-800 hover:to-purple-950 transition-all duration-300 flex items-center gap-2"
            >
              <Phone size={16} />
              Call Now
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200/20">
            <div className="flex flex-col space-y-4 pt-4">
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left font-medium transition-colors text-white hover:text-purple-300"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-left font-medium transition-colors text-white hover:text-purple-300"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-left font-medium transition-colors text-white hover:text-purple-300"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left font-medium transition-colors text-white hover:text-purple-300"
              >
                Contact
              </button>
              <a 
                href={phone.link}
                className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-800 hover:to-purple-950 transition-all duration-300 flex items-center justify-center gap-2 w-full"
              >
                <Phone size={16} />
                Call Now
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;