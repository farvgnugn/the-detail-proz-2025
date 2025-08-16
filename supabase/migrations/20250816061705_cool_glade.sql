/*
  # Add Vehicle Size-Based Pricing

  1. New Tables
    - `vehicle_sizes` - Define available vehicle sizes
    - `package_pricing` - Store pricing for each package + vehicle size combination
  
  2. Changes
    - Add vehicle size options (Sedan/Mid SUV, Large SUV, Oversized)
    - Link service packages to specific pricing per vehicle size
    - Maintain existing service package structure
  
  3. Security
    - Enable RLS on new tables
    - Add policies for public read and authenticated management
*/

-- Create vehicle sizes table
CREATE TABLE IF NOT EXISTS vehicle_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create package pricing table
CREATE TABLE IF NOT EXISTS package_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES service_packages(id) ON DELETE CASCADE,
  vehicle_size_id uuid NOT NULL REFERENCES vehicle_sizes(id) ON DELETE CASCADE,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(package_id, vehicle_size_id)
);

-- Enable RLS
ALTER TABLE vehicle_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_pricing ENABLE ROW LEVEL SECURITY;

-- Policies for vehicle_sizes
CREATE POLICY "Anyone can read vehicle sizes"
  ON vehicle_sizes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage vehicle sizes"
  ON vehicle_sizes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for package_pricing
CREATE POLICY "Anyone can read package pricing"
  ON package_pricing
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage package pricing"
  ON package_pricing
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default vehicle sizes
INSERT INTO vehicle_sizes (name, display_order) VALUES
  ('Sedan/Mid SUV', 1),
  ('Large SUV', 2),
  ('Oversized', 3);

-- Insert default pricing (you can adjust these values)
DO $$
DECLARE
  essential_id uuid;
  premium_id uuid;
  luxury_id uuid;
  sedan_id uuid;
  large_suv_id uuid;
  oversized_id uuid;
BEGIN
  -- Get package IDs (assuming they exist)
  SELECT id INTO essential_id FROM service_packages WHERE name ILIKE '%essential%' LIMIT 1;
  SELECT id INTO premium_id FROM service_packages WHERE name ILIKE '%premium%' LIMIT 1;
  SELECT id INTO luxury_id FROM service_packages WHERE name ILIKE '%luxury%' LIMIT 1;
  
  -- Get vehicle size IDs
  SELECT id INTO sedan_id FROM vehicle_sizes WHERE name = 'Sedan/Mid SUV';
  SELECT id INTO large_suv_id FROM vehicle_sizes WHERE name = 'Large SUV';
  SELECT id INTO oversized_id FROM vehicle_sizes WHERE name = 'Oversized';
  
  -- Insert pricing if packages exist
  IF essential_id IS NOT NULL THEN
    INSERT INTO package_pricing (package_id, vehicle_size_id, price) VALUES
      (essential_id, sedan_id, 89.00),
      (essential_id, large_suv_id, 109.00),
      (essential_id, oversized_id, 129.00);
  END IF;
  
  IF premium_id IS NOT NULL THEN
    INSERT INTO package_pricing (package_id, vehicle_size_id, price) VALUES
      (premium_id, sedan_id, 149.00),
      (premium_id, large_suv_id, 179.00),
      (premium_id, oversized_id, 199.00);
  END IF;
  
  IF luxury_id IS NOT NULL THEN
    INSERT INTO package_pricing (package_id, vehicle_size_id, price) VALUES
      (luxury_id, sedan_id, 249.00),
      (luxury_id, large_suv_id, 299.00),
      (luxury_id, oversized_id, 349.00);
  END IF;
END $$;