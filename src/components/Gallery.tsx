import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, ZoomIn } from 'lucide-react';

interface LegacyGalleryImage {
  id: number;
  src: string;
  alt: string;
  category: 'before' | 'after' | 'process';
}

// Default gallery images
const defaultGalleryImages: LegacyGalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&h=600&q=80",
    alt: "Car interior cleaning and detailing",
    category: "process"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&h=600&q=80",
    alt: "Professional car detailing equipment and supplies",
    category: "process"
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/6872149/pexels-photo-6872149.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    alt: "Mobile car washing and detailing",
    category: "process"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&h=600&q=80",
    alt: "Professional car washing service",
    category: "after"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&h=600&q=80",
    alt: "Premium car detailing service",
    category: "after"
  }
];

const Gallery: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedImage, setSelectedImage] = useState<LegacyGalleryImage | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  const [galleryImages, setGalleryImages] = useState<LegacyGalleryImage[]>(defaultGalleryImages);

  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        // Only try to load from Supabase if we have the environment variables
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.log('Supabase not configured, using default gallery');
          return;
        }
        
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          // Convert admin gallery images to legacy format for compatibility
          const legacyImages: LegacyGalleryImage[] = data.map((img, index) => ({
            id: parseInt(img.id) || index,
            src: img.url,
            alt: img.alt,
            category: img.category
          }));
          
          setGalleryImages(legacyImages);
        }
      } catch (error) {
        console.log('Error loading gallery images, using defaults:', error);
      }
    };

    loadGalleryImages();
  }, []);

  const handleImageLoad = (imageId: number) => {
    setImagesLoaded(prev => new Set(prev).add(imageId));
  };

  const openLightbox = (image: LegacyGalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedImage]);

  return (
    <section id="gallery" className="py-20 relative overflow-hidden">
      {/* Cool Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Work Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See the transformation we bring to every vehicle with our premium detailing services
          </p>
        </motion.div>

        <div className="masonry-grid max-w-6xl mx-auto relative z-10">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="masonry-item gallery-item group"
              onClick={() => openLightbox(image)}
            >
              <div className="relative overflow-hidden rounded-xl shadow-2xl border border-white/10">
                {!imagesLoaded.has(image.id) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="loading-spinner border-purple-600"></div>
                  </div>
                )}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  onLoad={() => handleImageLoad(image.id)}
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <div className="text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {image.category}
                      </span>
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="lightbox-close"
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <X size={30} />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="lightbox-image"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-lg font-medium">{selectedImage.alt}</p>
                <span className="text-purple-300 text-sm capitalize">
                  {selectedImage.category}
                </span>
              </div>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12 relative z-10"
        >
          <p className="text-gray-300 mb-6">
            Ready to see your car transformed? Book your appointment today!
          </p>
          <a
            href="tel:+1234567890"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
          >
            View More Work
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;