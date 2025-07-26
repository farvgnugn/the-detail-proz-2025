/*
  # Create admin management tables

  1. New Tables
    - `business_settings`
      - `id` (uuid, primary key)
      - `phone_number` (text)
      - `phone_formatted` (text)
      - `phone_link` (text)
      - `updated_at` (timestamp)
    
    - `service_packages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (text)
      - `popular` (boolean)
      - `interior` (jsonb array)
      - `exterior` (jsonb array)
      - `order_index` (integer)
      - `updated_at` (timestamp)
    
    - `gallery_images`
      - `id` (uuid, primary key)
      - `url` (text)
      - `alt` (text)
      - `category` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

-- Business Settings Table
CREATE TABLE IF NOT EXISTS business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  phone_formatted text NOT NULL,
  phone_link text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Public can read business settings
CREATE POLICY "Anyone can read business settings"
  ON business_settings
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can update business settings
CREATE POLICY "Authenticated users can update business settings"
  ON business_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Service Packages Table
CREATE TABLE IF NOT EXISTS service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  popular boolean DEFAULT false,
  interior jsonb NOT NULL DEFAULT '[]',
  exterior jsonb NOT NULL DEFAULT '[]',
  order_index integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;

-- Public can read service packages
CREATE POLICY "Anyone can read service packages"
  ON service_packages
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can manage service packages
CREATE POLICY "Authenticated users can manage service packages"
  ON service_packages
  FOR ALL
  TO authenticated
  USING (true);

-- Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alt text NOT NULL,
  category text NOT NULL CHECK (category IN ('before', 'after', 'process')),
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Public can read gallery images
CREATE POLICY "Anyone can read gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can manage gallery images
CREATE POLICY "Authenticated users can manage gallery images"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default business settings
INSERT INTO business_settings (phone_number, phone_formatted, phone_link)
VALUES ('9033996021', '(903) 399-6021', 'tel:+19033996021')
ON CONFLICT DO NOTHING;

-- Insert default service packages
INSERT INTO service_packages (name, price, popular, interior, exterior, order_index) VALUES
(
  'Basic Package',
  '$85 - $100',
  false,
  '["Interior Blowout – Removes dust & debris from hard-to-reach areas", "Full Deep Vacuuming – Seats, carpets & tight spaces thoroughly cleaned", "Interior Scrub Down – Dashboard, panels, & center console deep cleaned", "Interior Conditioning – Restores & protects plastic trims", "Floor Mats Cleaned & Conditioned – Restores freshness & texture", "Windows Cleaned – Streak-free clarity", "Choice of Air Freshener: Black Ice or New Car"]',
  '["Exterior Hand Wash – Gentle yet thorough cleaning", "Wheels Deep Cleaned – Removes brake dust & grime", "Tire Shine & Spray Wax – Restores shine and provides protection"]',
  1
),
(
  'Standard Package',
  '$120 - $160',
  true,
  '["Full Interior Blowout – Removes dust & debris from cracks & vents", "Full Vacuum – Seats, carpets, & all tight spaces", "Interior Scrub Down – Dashboard, panels, & center console", "Interior Conditioning – Restores & protects plastic trims", "Leather Deep Cleaned & Conditioned (If applicable)", "Floor Mats Cleaned & Conditioned – Restores freshness & texture", "Windows Cleaned – Streak-free clarity", "Choice of Air Freshener: Black Ice or New Car"]',
  '["Exterior Hand Wash – Thorough yet gentle cleaning", "Clay Bar Treatment – Removes deep-seated contaminants from paint", "Wheels Deep Cleaned – Restores shine & removes brake dust", "Tire Shine – Restores a deep black finish", "3-Month Ceramic Sealant – Provides hydrophobic protection & enhanced gloss"]',
  2
),
(
  'Ultimate Package',
  '$150 - $200',
  false,
  '["Full Interior Blowout – Removes dust & debris from cracks & vents", "Full Deep Vacuuming – Seats, carpets, & all tight spaces", "Full Steam Cleaning – Deep cleans cracks, air vents, & crevices", "Shampoo & Heated Extraction – Removes deep-seated dirt & odors", "Stain Removal – Upholstery, carpets, & seats", "Interior Scrub Down – Dashboard, panels, & center console", "Interior Conditioning – Restores & protects plastic trims", "Leather Deep Cleaned & Conditioned (If applicable)", "Floor Mats Cleaned & Conditioned – Restores freshness & texture", "Windows Cleaned – Streak-free clarity", "Choice of Air Freshener: Black Ice or New Car"]',
  '["Exterior Hand Wash – Thorough yet gentle cleaning", "Strip Foam Wash – Removes old wax, sealants & contaminants", "Iron Decontamination Treatment – Eliminates embedded iron particles", "Clay Bar Treatment – Removes deep-seated contaminants from paint", "Wheels Deep Cleaned – Restores shine & removes brake dust", "Tire Shine – Restores a deep black finish", "6-Month Ceramic Sealant – Provides hydrophobic protection & enhanced gloss"]',
  3
)
ON CONFLICT DO NOTHING;

-- Insert default gallery images
INSERT INTO gallery_images (url, alt, category, order_index) VALUES
('https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop', 'Luxury car exterior detailing', 'process', 1),
('https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Interior leather cleaning', 'after', 2),
('https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop', 'Paint correction process', 'process', 3),
('https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'Wheel and tire detailing', 'after', 4),
('https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop', 'Engine bay cleaning', 'before', 5),
('https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=600&h=500&fit=crop', 'Dashboard restoration', 'after', 6),
('https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop', 'Ceramic coating application', 'process', 7),
('https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Final result showcase', 'after', 8)
ON CONFLICT DO NOTHING;