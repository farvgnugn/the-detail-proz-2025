import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
  source: 'google' | 'manual';
  google_review_id?: string;
  is_published: boolean;
  date?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Default testimonials
const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    location: 'Kilgore, TX',
    rating: 5,
    text: 'Absolutely amazing service! My car looks brand new. The Detail Proz team was professional, punctual, and exceeded my expectations.',
    image: '/assets/customer_avatar_2.png',
    source: 'manual',
    is_published: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    location: 'Longview, TX',
    rating: 5,
    text: 'Best mobile detailing service in East Texas! They came to my office and my truck looked incredible when they finished.',
    image: '/assets/customer_avatar_3.png',
    source: 'manual',
    is_published: true,
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Jennifer Davis',
    location: 'Tyler, TX',
    rating: 5,
    text: 'I was skeptical about mobile detailing, but The Detail Proz proved me wrong. Convenient, professional, and outstanding results!',
    image: '/assets/customer_avatar_4.png',
    source: 'manual',
    is_published: true,
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const Testimonials: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [isLoading, setIsLoading] = useState(true);

  // Load published testimonials on component mount
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        // Only try to load from Supabase if we have the environment variables
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.log('Supabase not configured, using default testimonials');
          setIsLoading(false);
          return;
        }

        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_published', true)
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (error) {
        console.log('Error loading testimonials, using defaults:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({ ...testimonials[index], index });
    }
    return visible;
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="loading-spinner border-purple-600"></div>
            <span className="text-gray-600">Loading testimonials...</span>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            What Our Clients Say
          </h2>
          <p className="text-gray-600">No testimonials published yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-800 mx-auto mb-8"></div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900">5.0 Average Rating</span>
          </div>
          <p className="text-gray-700">Based on 200+ Google and Facebook reviews</p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {getVisibleTestimonials().map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.index}-${currentIndex}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl p-8 relative border border-gray-200"
                >
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                      <div className="flex mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  {testimonial.source === 'google' && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <img 
                        src="https://developers.google.com/static/maps/images/google_on_white_hdpi.png" 
                        alt="Google" 
                        className="h-4"
                      />
                      <span className="text-xs text-gray-500">{testimonial.date}</span>
                    </div>
                  )}
                  <div className="absolute top-6 right-6 text-purple-200 text-6xl font-serif">"</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-purple-600 hover:text-purple-800"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-purple-600 hover:text-purple-800"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-purple-600' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;