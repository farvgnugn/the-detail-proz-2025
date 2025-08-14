/*
  # Add testimonials management table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, author name)
      - `location` (text, location or source)
      - `rating` (integer, 1-5 stars)
      - `text` (text, review content)
      - `image` (text, avatar URL)
      - `source` (text, 'google' or 'manual')
      - `google_review_id` (text, optional Google review ID)
      - `is_published` (boolean, whether to show on website)
      - `date` (text, relative date like "2 weeks ago")
      - `order_index` (integer, display order)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for public read access to published testimonials only
    - Add policy for authenticated users to manage all testimonials

  3. Default Data
    - Insert existing static testimonials as published
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  image text NOT NULL,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('google', 'manual')),
  google_review_id text,
  is_published boolean DEFAULT false,
  date text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can only read published testimonials
CREATE POLICY "Public can read published testimonials"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Authenticated users can manage all testimonials
CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert existing static testimonials as published
INSERT INTO testimonials (name, location, rating, text, image, source, is_published, order_index) VALUES
(
  'Dan Ferguson',
  'Liberty City, TX',
  5,
  'The Detail Proz is the real deal! They brought my truck back to showroom quality - it looked like it just rolled off the lot. The attention to detail, quality of products, and professional attitude really set this company apart. Super convenient mobile services too - they came right to my driveway. Highly recommend for anyone who wants their vehicle looking its absolute best!',
  '/assets/customer_avatar_DanF.png',
  'manual',
  true,
  1
),
(
  'Melanie Espinal',
  'Uncertain, TX',
  5,
  'Absolutely recommend!! I recently had my car detailed, and I am beyond impressed with the results! The attention to detail was exceptional—every little spot and stain was spotless, and the exterior has a brilliant, and clean shine. The interior looks brand new, with clean carpets, polished surfaces, and a fresh, pleasant scent. They went above and beyond to ensure my car looked absolutely amazing. I highly recommend their services to anyone looking to refresh their vehicle. Truly outstanding work!',
  '/assets/customer_avatar_2.png',
  'manual',
  true,
  2
),
(
  'Milca Avila',
  'Kilgore, TX',
  5,
  'I had a great experience with my car detailing! Alec did such an amazing job. Not only was he thorough and really attentive to detail but he was a very pleasant young man. I''m happy with the service I received as well as pricing and feasibility. Highly recommend. Will definitely continue getting my car detailed with him.',
  '/assets/customer_avatar_3.png',
  'manual',
  true,
  3
),
(
  'Jordan Avila',
  'Kilgore, TX',
  5,
  'Super impressed with the service! My car looks and feels brand new — they did an amazing job inside and out. You can tell they take pride in their work and pay attention to detail. Highly recommend if you''re looking for a reliable and professional mobile detailing service. Will definitely be using them again!',
  '/assets/customer_avatar_4.png',
  'manual',
  true,
  4
);