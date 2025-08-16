import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Database types
export interface BusinessSettings {
  id: string;
  phone_number: string;
  phone_formatted: string;
  phone_link: string;
  email: string;
  updated_at: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: string;
  popular: boolean;
  interior: string[];
  exterior: string[];
  order_index: number;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: 'before' | 'after' | 'process';
  order_index: number;
  created_at: string;
}

export interface Testimonial {
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

export interface VehicleSize {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface PackagePricing {
  id: string;
  package_id: string;
  vehicle_size_id: string;
  price: number;
  created_at: string;
  updated_at: string;
}