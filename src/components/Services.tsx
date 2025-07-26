import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Phone } from 'lucide-react';

interface ServicesProps {
  phone: {
    number: string;
    formatted: string;
    link: string;
  };
}

interface ServicePackage {
  id: string;
  name: string;
  price: string;
  popular: boolean;
  interior: string[];
  exterior: string[];
  order_index: number;
  updated_at: string;
}

// Default service packages
const defaultPackages: ServicePackage[] = [
  {
    id: '1',
    name: 'Essential Detail',
    price: '$89 - $129',
    popular: false,
    interior: [
      'Vacuum all seats, carpets, and floor mats',
      'Wipe down all interior surfaces',
      'Clean and condition leather/vinyl seats',
      'Clean interior windows and mirrors',
      'Dashboard and console cleaning',
      'Door panel cleaning'
    ],
    exterior: [
      'Hand wash and dry exterior',
      'Wheel and tire cleaning',
      'Exterior window cleaning',
      'Chrome and trim polishing',
      'Basic paint protection spray'
    ],
    order_index: 1,
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Premium Detail',
    price: '$149 - $199',
    popular: true,
    interior: [
      'Everything in Essential Detail',
      'Deep carpet and upholstery cleaning',
      'Leather conditioning and protection',
      'Air vent cleaning and sanitizing',
      'Cup holder and console deep clean',
      'Interior UV protection treatment'
    ],
    exterior: [
      'Everything in Essential Detail',
      'Clay bar paint decontamination',
      'Paint correction (light scratches)',
      'Premium wax application',
      'Tire shine and dressing',
      'Headlight restoration (if needed)'
    ],
    order_index: 2,
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Luxury Detail',
    price: '$249 - $349',
    popular: false,
    interior: [
      'Everything in Premium Detail',
      'Steam cleaning of all surfaces',
      'Premium leather treatment',
      'Odor elimination treatment',
      'Fabric protection application',
      'Complete interior sanitization'
    ],
    exterior: [
      'Everything in Premium Detail',
      'Multi-stage paint correction',
      'Ceramic coating application',
      'Engine bay cleaning',
      'Chrome polishing and protection',
      '6-month paint protection warranty'
    ],
    order_index: 3,
    updated_at: new Date().toISOString()
  }
];

const Services: React.FC<ServicesProps> = ({ phone }) => {
  const [packages, setPackages] = React.useState<ServicePackage[]>(defaultPackages);
  const [isLoading, setIsLoading] = React.useState(true);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    const loadServicePackages = async () => {
      try {
        // Only try to load from Supabase if we have the environment variables
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.log('Supabase not configured, using default packages');
          setIsLoading(false);
          return;
        }

        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from('service_packages')
          .select('*')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          setPackages(data);
        }
      } catch (error) {
        console.log('Error loading service packages, using defaults:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServicePackages();
  }, []);

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-gradient-to-b from-purple-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-purple-900 to-black relative overflow-hidden">
      {/* Water Beading Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 2px, transparent 2px),
                           radial-gradient(circle at 60% 70%, rgba(255,255,255,0.6) 1.5px, transparent 1.5px),
                           radial-gradient(circle at 80% 20%, rgba(255,255,255,0.7) 2.5px, transparent 2.5px),
                           radial-gradient(circle at 30% 80%, rgba(255,255,255,0.5) 1px, transparent 1px),
                           radial-gradient(circle at 90% 60%, rgba(255,255,255,0.9) 1.8px, transparent 1.8px),
                           radial-gradient(circle at 10% 90%, rgba(255,255,255,0.4) 1.2px, transparent 1.2px),
                           radial-gradient(circle at 70% 10%, rgba(255,255,255,0.6) 2.2px, transparent 2.2px),
                           radial-gradient(circle at 40% 50%, rgba(255,255,255,0.7) 1.7px, transparent 1.7px),
                           radial-gradient(circle at 15% 40%, rgba(255,255,255,0.5) 1.3px, transparent 1.3px),
                           radial-gradient(circle at 85% 85%, rgba(255,255,255,0.8) 2.1px, transparent 2.1px)`,
          backgroundSize: '200px 200px, 150px 150px, 180px 180px, 120px 120px, 160px 160px, 140px 140px, 170px 170px, 130px 130px, 110px 110px, 190px 190px'
        }}></div>
      </div>
      
      {/* Additional subtle water droplet overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(ellipse 3px 4px at 25% 25%, rgba(255,255,255,0.9) 0%, transparent 50%),
                           radial-gradient(ellipse 2px 3px at 75% 45%, rgba(255,255,255,0.7) 0%, transparent 50%),
                           radial-gradient(ellipse 4px 5px at 45% 75%, rgba(255,255,255,0.8) 0%, transparent 50%),
                           radial-gradient(ellipse 2.5px 3.5px at 85% 15%, rgba(255,255,255,0.6) 0%, transparent 50%),
                           radial-gradient(ellipse 3.5px 4.5px at 15% 85%, rgba(255,255,255,0.9) 0%, transparent 50%)`,
          backgroundSize: '300px 300px, 250px 250px, 280px 280px, 220px 220px, 320px 320px'
        }}></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Service Packages
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose from our carefully crafted packages designed to meet every need and budget
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                pkg.popular ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${pkg.popular ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {pkg.name}
                </h3>
                <div className="text-3xl font-bold text-purple-600 mb-6">
                  {pkg.price}
                </div>
                
                <div className="space-y-6 mb-8">
                  {/* Interior Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-purple-600 mb-3 flex items-center gap-2">
                      Interior
                    </h4>
                    <ul className="space-y-2 ml-4 min-h-[280px]">
                      {pkg.interior.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exterior Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-purple-600 mb-3 flex items-center gap-2">
                      Exterior
                    </h4>
                    <ul className="space-y-2 ml-4">
                      {pkg.exterior.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <a
                  href={phone.link}
                  className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 shadow-lg hover:shadow-purple-500/25'
                      : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
                  }`}
                >
                  <Phone size={16} />
                  Book Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-4">
            *Prices vary based on vehicle size and condition. Free estimates available.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>✓ 100% Satisfaction Guarantee</span>
            <span>✓ Eco-Friendly Products</span>
            <span>✓ Mobile Service Included</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;