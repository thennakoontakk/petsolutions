-- =====================================================================
-- SQL Script to Create Store Settings Table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jnakxlejkmyptoffvhsa/sql
-- =====================================================================

-- Create store settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to store settings
CREATE POLICY "Public can read store settings" ON public.store_settings
  FOR SELECT USING (true);

-- Allow admins to do everything on store settings
CREATE POLICY "Admins can manage store settings" ON public.store_settings
  FOR ALL USING (public.is_admin(auth.uid()));

-- Insert default values
INSERT INTO public.store_settings (key, value, is_enabled) VALUES
  ('promo_text', '✨ Free Delivery on orders over Rs. 5,000!   |   🐾 100% Genuine Pet Care Products', true),
  ('tagline', 'Premium Pet Store', true),
  ('hotline', '+94 77 123 4567', true)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, is_enabled = EXCLUDED.is_enabled;
