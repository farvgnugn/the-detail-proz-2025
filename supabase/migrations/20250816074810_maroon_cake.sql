/*
  # Add email field to business settings

  1. Changes
    - Add email column to business_settings table
    - Set default email value
    - Update existing record if it exists

  2. Security
    - No changes to RLS policies needed
*/

-- Add email column to business_settings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'business_settings' AND column_name = 'email'
  ) THEN
    ALTER TABLE business_settings ADD COLUMN email text DEFAULT 'info@thedetailproz.com';
  END IF;
END $$;

-- Update existing records to have the default email if they don't have one
UPDATE business_settings 
SET email = 'info@thedetailproz.com' 
WHERE email IS NULL OR email = '';