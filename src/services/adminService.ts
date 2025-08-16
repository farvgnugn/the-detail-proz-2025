import { supabase, BusinessSettings, ServicePackage, GalleryImage, Testimonial } from '../lib/supabase';
import type { VehicleSize, PackagePricing } from '../lib/supabase';
import GoogleReviewsService from './googleReviews';
import { BUSINESS_CONFIG } from '../config/constants';

class AdminService {
  // Business Settings
  async getBusinessSettings(): Promise<BusinessSettings> {
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching business settings:', error);
      throw error;
    }

    return data;
  }

  async updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const { data, error } = await supabase
      .from('business_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', settings.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating business settings:', error);
      throw error;
    }

    return data;
  }

  // Service Packages
  async getServicePackages(): Promise<ServicePackage[]> {
    const { data, error } = await supabase
      .from('service_packages')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching service packages:', error);
      throw error;
    }

    return data || [];
  }

  async updateServicePackage(packageData: Partial<ServicePackage> & { id: string }): Promise<ServicePackage[]> {
    const { error } = await supabase
      .from('service_packages')
      .update({
        ...packageData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', packageData.id);

    if (error) {
      console.error('Error updating service package:', error);
      throw error;
    }

    // Return updated list
    return this.getServicePackages();
  }

  async addServicePackage(packageData: Omit<ServicePackage, 'id' | 'updated_at'>): Promise<ServicePackage[]> {
    const { error } = await supabase
      .from('service_packages')
      .insert([{
        ...packageData,
        updated_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error adding service package:', error);
      throw error;
    }

    return this.getServicePackages();
  }

  async deleteServicePackage(id: string): Promise<ServicePackage[]> {
    const { error } = await supabase
      .from('service_packages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service package:', error);
      throw error;
    }

    return this.getServicePackages();
  }

  // Gallery Images
  async getGalleryImages(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching gallery images:', error);
      throw error;
    }

    return data || [];
  }

  async addGalleryImage(imageData: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage[]> {
    const { error } = await supabase
      .from('gallery_images')
      .insert([{
        ...imageData,
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error adding gallery image:', error);
      throw error;
    }

    return this.getGalleryImages();
  }

  async deleteGalleryImageWithFile(id: string, storagePath?: string): Promise<GalleryImage[]> {
    // If there's a storage path, delete the file from Supabase Storage
    if (storagePath) {
      try {
        const { error: storageError } = await supabase.storage
          .from('gallery-images')
          .remove([`gallery/${storagePath}`]);
        
        if (storageError) {
          console.warn('Failed to delete file from storage:', storageError);
        }
      } catch (error) {
        console.warn('Error deleting file from storage:', error);
      }
    }

    // Delete the database record
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting gallery image:', error);
      throw error;
    }

    return this.getGalleryImages();
  }

  async updateGalleryImage(imageData: Partial<GalleryImage> & { id: string }): Promise<GalleryImage[]> {
    const { error } = await supabase
      .from('gallery_images')
      .update(imageData)
      .eq('id', imageData.id);

    if (error) {
      console.error('Error updating gallery image:', error);
      throw error;
    }

    return this.getGalleryImages();
  }

  async deleteGalleryImage(id: string): Promise<GalleryImage[]> {
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting gallery image:', error);
      throw error;
    }

    return this.getGalleryImages();
  }

  // Testimonials Management
  async getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }

    return data || [];
  }

  async getPublishedTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching published testimonials:', error);
      throw error;
    }

    return data || [];
  }

  async updateTestimonial(testimonial: Partial<Testimonial> & { id: string }): Promise<Testimonial[]> {
    const { error } = await supabase
      .from('testimonials')
      .update({
        ...testimonial,
        updated_at: new Date().toISOString(),
      })
      .eq('id', testimonial.id);

    if (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }

    return this.getTestimonials();
  }

  async deleteTestimonial(id: string): Promise<Testimonial[]> {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }

    return this.getTestimonials();
  }

  async addManualTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial[]> {
    const { error } = await supabase
      .from('testimonials')
      .insert([{
        ...testimonial,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error adding testimonial:', error);
      throw error;
    }

    return this.getTestimonials();
  }

  async fetchGoogleReviews(): Promise<{ imported: number; total: number }> {
    const { apiKey, placeId } = BUSINESS_CONFIG.googlePlaces;
    
    if (!apiKey || !placeId) {
      throw new Error('Google Places API key or Place ID not configured');
    }

    try {
      const reviewsService = new GoogleReviewsService(apiKey, placeId);
      const googleReviews = await reviewsService.fetchReviews();
      
      // Get existing Google reviews to avoid duplicates
      const { data: existingReviews } = await supabase
        .from('testimonials')
        .select('google_review_id')
        .eq('source', 'google');
      
      const existingIds = new Set(existingReviews?.map(r => r.google_review_id) || []);
      
      // Filter out existing reviews and low ratings
      const newReviews = googleReviews
        .filter(review => review.rating >= 4) // Only 4+ star reviews
        .filter(review => !existingIds.has(review.time.toString()))
        .slice(0, 10); // Limit to 10 new reviews at a time
      
      if (newReviews.length === 0) {
        return { imported: 0, total: googleReviews.length };
      }

      // Convert to testimonial format and insert as unpublished
      const testimonialsToInsert = newReviews.map(review => ({
        name: review.author_name,
        location: 'Google Review',
        rating: review.rating,
        text: GoogleReviewsService.formatReviewText(review.text, 300),
        image: review.profile_photo_url || '/assets/customer_avatar_2.png',
        source: 'google' as const,
        google_review_id: review.time.toString(),
        is_published: false, // Require manual approval
        date: review.relative_time_description,
        order_index: 999, // Put at end by default
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('testimonials')
        .insert(testimonialsToInsert);

      if (error) {
        console.error('Error inserting Google reviews:', error);
        throw error;
      }

      return { imported: newReviews.length, total: googleReviews.length };
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      throw error;
    }
  }

  // Vehicle Sizes Management
  async getVehicleSizes(): Promise<VehicleSize[]> {
    const { data, error } = await supabase
      .from('vehicle_sizes')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching vehicle sizes:', error);
      throw error;
    }

    return data || [];
  }

  // Package Pricing Management
  async getPackagePricing(): Promise<PackagePricing[]> {
    const { data, error } = await supabase
      .from('package_pricing')
      .select('*');

    if (error) {
      console.error('Error fetching package pricing:', error);
      throw error;
    }

    return data || [];
  }

  async updatePackagePricing(packageId: string, vehicleSizeId: string, price: number): Promise<void> {
    const { error } = await supabase
      .from('package_pricing')
      .upsert({
        package_id: packageId,
        vehicle_size_id: vehicleSizeId,
        price: price,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating package pricing:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();