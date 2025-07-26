import React, { useState, useEffect } from 'react';
import { X, Phone, Percent } from 'lucide-react';

interface ExitIntentPopupProps {
  phone: {
    number: string;
    formatted: string;
    link: string;
  };
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ phone }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page and hasn't been shown before
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    // Also show after 30 seconds if user hasn't left
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasShown]);

  const closePopup = () => {
    setIsVisible(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="exit-popup" onClick={handleBackdropClick}>
      <div className="exit-popup-content">
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Percent size={32} />
          </div>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Wait! Don't Leave Yet
          </h3>

          <p className="text-gray-600 mb-6">
            Get <span className="font-bold text-purple-600">10% OFF</span> your first premium detailing service
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Limited Time Offer:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Valid for new customers only</li>
              <li>✓ Applies to Premium & Luxury packages</li>
              <li>✓ Must mention this offer when booking</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={phone.link}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-full font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300 flex items-center justify-center gap-2"
              onClick={closePopup}
            >
              <Phone size={16} />
              Call & Save 10%
            </a>
            <button
              onClick={closePopup}
              className="flex-1 border-2 border-gray-300 text-gray-600 py-3 px-6 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Offer expires in 24 hours. Cannot be combined with other offers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;