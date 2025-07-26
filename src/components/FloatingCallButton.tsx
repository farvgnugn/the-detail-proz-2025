import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

interface FloatingCallButtonProps {
  phone: {
    number: string;
    formatted: string;
    link: string;
  };
}

const FloatingCallButton: React.FC<FloatingCallButtonProps> = ({ phone }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href={phone.link}
      className="floating-call-btn bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-full shadow-2xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform hover:scale-110 md:hidden"
      aria-label="Call now"
    >
      <Phone size={24} />
    </a>
  );
};

export default FloatingCallButton;