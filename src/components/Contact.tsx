import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Star,
  Shield,
  Banknote,
  Award,
  CheckCircle
} from 'lucide-react';

interface ContactProps {
  phone: {
    number: string;
    formatted: string;
    link: string;
  };
}

const Contact: React.FC<ContactProps> = ({ phone }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 2000);
  };

  const businessHours = [
    { day: 'Monday', hours: '7:00 AM - 7:00 PM' },
    { day: 'Tuesday', hours: '7:00 AM - 4:00 PM' },
    { day: 'Wednesday', hours: '7:00 AM - 7:00 PM' },
    { day: 'Thursday', hours: '7:00 AM - 4:00 PM' },
    { day: 'Friday', hours: '7:00 AM - 7:00 PM' },
    { day: 'Saturday', hours: '7:00 AM - 7:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  const serviceAreas = [
    'Kilgore', 'Longview', 'Tyler', 'Henderson',
    'Gladewater', 'White Oak', 'Liberty City', 'Hallsville'
  ];

  const trustBadges = [
    { icon: <Award size={20} />, text: 'Premium Quality' },
    { icon: <Banknote size={20} />, text: 'Fair Pricing' },
    { icon: <Star size={20} />, text: '5-Star Rated' },
    { icon: <CheckCircle size={20} />, text: '100% Satisfaction' }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-purple-900 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to experience premium mobile car detailing in East Texas? Contact us today for a free estimate in Kilgore, Longview, Tyler and surrounding areas
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-serif font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <a 
                  href={phone.link}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 group"
                >
                  <div className="bg-purple-600 p-3 rounded-full group-hover:bg-purple-500 transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Call Now</p>
                    <p className="text-gray-300">{phone.formatted}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <div className="bg-purple-600 p-3 rounded-full">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Service Area</p>
                    <p className="text-gray-300">Kilgore, Longview, Tyler & East Texas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-purple-400" />
                Business Hours
              </h4>
              <div className="space-y-2">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-300">{schedule.day}</span>
                    <span className="font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Areas */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Service Areas</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {serviceAreas.map((area, index) => (
                  <div key={index} className="text-gray-300">
                    • {area}
                  </div>
                ))}
                <div className="col-span-2 text-gray-400 text-xs mt-2">
                  Mobile car detailing services available throughout East Texas
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a 
                  href="https://www.facebook.com/profile.php?id=61576725094740" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 p-3 rounded-full hover:bg-blue-500 transition-colors duration-300"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://www.instagram.com/tdp_car_detailing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full hover:from-purple-500 hover:to-pink-500 transition-colors duration-300"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-serif font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Request a Quote
            </h3>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
                Thank you! We'll contact you within 24 hours with your free estimate.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                  Service Package
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="bg-white/5 border border-white/20 text-white rounded-lg p-3 w-full [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="">Select a package</option>
                  <option value="essential">Essential Detail ($89-$129)</option>
                  <option value="premium">Premium Detail ($149-$199)</option>
                  <option value="luxury">Luxury Detail ($249-$349)</option>
                  <option value="custom">Custom Quote</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your vehicle and any specific requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-full font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Sending...
                  </>
                ) : (
                  'Get Free Estimate'
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-6">
            {trustBadges.map((badge, index) => (
              <div key={index} className="trust-badge">
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-gray-700 text-center"
        >
          <p className="text-gray-400 mb-4">
            © 2025 The Detail Proz. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Professional mobile car detailing services in Kilgore, Texas and surrounding areas
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;