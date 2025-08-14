import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Star, Clock, Shield } from 'lucide-react';

const SEOContent: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const serviceAreas = [
    {
      city: 'Kilgore',
      description: 'Premium mobile car detailing services in Kilgore, TX. We bring professional auto detailing directly to your home or office.',
      population: '15,000+',
      zipCodes: ['75662', '75663']
    },
    {
      city: 'Longview', 
      description: 'Expert mobile car detailing in Longview, TX. Ceramic coating, paint correction, and premium auto detailing services.',
      population: '80,000+',
      zipCodes: ['75601', '75602', '75603', '75604', '75605', '75606', '75607', '75608']
    },
    {
      city: 'Tyler',
      description: 'Professional mobile car detailing services in Tyler, TX. Interior and exterior detailing with premium products.',
      population: '105,000+',
      zipCodes: ['75701', '75702', '75703', '75704', '75705', '75706', '75707', '75708', '75709', '75710']
    },
    {
      city: 'Henderson',
      description: 'Mobile car detailing services in Henderson, TX. Quality auto detailing that comes to you.',
      population: '13,000+',
      zipCodes: ['75652', '75653']
    }
  ];

  const services = [
    {
      name: 'Mobile Car Detailing',
      description: 'Complete mobile car detailing services that come to your location in East Texas.',
      keywords: ['mobile car detailing', 'car detailing near me', 'mobile auto detailing']
    },
    {
      name: 'Ceramic Coating',
      description: 'Professional ceramic coating application for long-lasting paint protection.',
      keywords: ['ceramic coating', 'paint protection', 'car coating']
    },
    {
      name: 'Paint Correction',
      description: 'Expert paint correction services to remove scratches and restore your vehicle\'s finish.',
      keywords: ['paint correction', 'scratch removal', 'paint restoration']
    },
    {
      name: 'Interior Detailing',
      description: 'Deep interior cleaning and conditioning for leather, fabric, and all surfaces.',
      keywords: ['interior detailing', 'car interior cleaning', 'leather conditioning']
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Service Areas Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Mobile Car Detailing Service Areas in East Texas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="text-purple-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">{area.city}, TX</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {area.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    <div className="mb-1">Population: {area.population}</div>
                    <div>Zip Codes: {area.zipCodes.join(', ')}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Professional Auto Detailing Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <h3 className="text-xl font-bold text-purple-600 mb-3">{service.name}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.keywords.map((keyword, keyIndex) => (
                      <span
                        key={keyIndex}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-serif text-center mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Why Choose The Detail Proz for Mobile Car Detailing in East Texas?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Star className="mx-auto mb-4 text-yellow-400" size={48} />
                <h3 className="text-xl font-bold mb-2">5-Star Rated Service</h3>
                <p className="text-purple-100">
                  Consistently rated 5 stars by customers across Kilgore, Longview, Tyler, and East Texas.
                </p>
              </div>
              <div className="text-center">
                <Clock className="mx-auto mb-4 text-yellow-400" size={48} />
                <h3 className="text-xl font-bold mb-2">Convenient Mobile Service</h3>
                <p className="text-purple-100">
                  We come to your location - home, office, or anywhere in our East Texas service area.
                </p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-4 text-yellow-400" size={48} />
                <h3 className="text-xl font-bold mb-2">Licensed & Insured</h3>
                <p className="text-purple-100">
                  Fully licensed and insured mobile car detailing business serving East Texas since 2021.
                </p>
              </div>
            </div>
          </div>

          {/* Local SEO Content */}
          <div className="mt-16 prose prose-lg max-w-none">
            <h2 className="text-3xl font-serif text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              East Texas Mobile Car Detailing: Premium Service That Comes To You
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-gray-700">
              <div>
                <p className="mb-4">
                  Looking for professional <strong>car detailing in Kilgore</strong>, <strong>mobile car detailing in Longview</strong>, or <strong>auto detailing in Tyler</strong>? The Detail Proz brings premium mobile car detailing services directly to your location throughout East Texas.
                </p>
                <p className="mb-4">
                  Our <strong>mobile car detailing</strong> service eliminates the hassle of driving to a shop and waiting around. We bring all the equipment, water, and premium products needed to transform your vehicle right in your driveway, office parking lot, or anywhere convenient for you.
                </p>
                <p className="mb-4">
                  Specializing in <strong>ceramic coating</strong>, <strong>paint correction</strong>, interior and exterior detailing, we serve customers throughout <strong>East Texas</strong> including Kilgore, Longview, Tyler, Henderson, Gladewater, White Oak, Liberty City, and Hallsville.
                </p>
              </div>
              <div>
                <p className="mb-4">
                  Whether you need a basic wash and wax or comprehensive <strong>paint correction and ceramic coating</strong>, our experienced team delivers exceptional results using only the finest products and techniques. We're not just another car wash - we're <strong>East Texas's premier mobile car detailing service</strong>.
                </p>
                <p className="mb-4">
                  <strong>Business and fleet discounts available!</strong> Got 4 or more vehicles? We offer special pricing for businesses, dealerships, and families with multiple cars. Keep your entire fleet looking professional with our convenient mobile service.
                </p>
                <p className="mb-4">
                  Contact The Detail Proz today at <strong>(903) 399-6021</strong> for a free estimate on mobile car detailing services in your area. Experience the convenience of premium auto detailing that comes to you!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SEOContent;