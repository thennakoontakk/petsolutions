-- =============================================
-- Migration: Add Veterinary & Product Specification Fields
-- Run this in your Supabase SQL Editor
-- =============================================

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS ingredients TEXT,
ADD COLUMN IF NOT EXISTS indications TEXT,
ADD COLUMN IF NOT EXISTS directions TEXT,
ADD COLUMN IF NOT EXISTS packaging TEXT,
ADD COLUMN IF NOT EXISTS storage_safety TEXT;

COMMENT ON COLUMN products.ingredients IS 'Key botanical/pharmaceutical ingredients and composition';
COMMENT ON COLUMN products.indications IS 'Clinical indications, uses, and health benefits';
COMMENT ON COLUMN products.directions IS 'Dosage, feeding directions, and administration guidelines';
COMMENT ON COLUMN products.packaging IS 'Pack sizes, packaging presentation and bottle format';
COMMENT ON COLUMN products.storage_safety IS 'Storage temperatures, expiry, and safety precautions';
