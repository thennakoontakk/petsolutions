-- ==========================================================================
-- PetSolutions.lk — Category Cleanup & Synchronization Script
-- Run this script in the Supabase SQL Editor to clean up orphan categories
-- and ensure all products are assigned to one of the 6 official categories.
-- ==========================================================================

-- 1. Ensure the 6 Official Categories Exist
INSERT INTO categories (name, slug, description, parent_category, display_order) VALUES
  ('Parasite & Tick Control', 'parasite-tick-control', 'Spot-on treatments, tick sprays, collars and dewormers.', 'Cat/Dog', 1),
  ('Health & Supplements', 'health-supplements', 'Liver support, vitamins, haematinics, calcium and metabolic tonics.', 'Cat/Dog', 2),
  ('Wound Care & Topical Pharmacy', 'wound-care-topical-pharmacy', 'Antiseptic wound sprays, healing creams and lotions.', 'Cat/Dog', 3),
  ('Medicated Shampoos & Grooming', 'medicated-shampoos-grooming', 'Antibacterial, antifungal and coat care grooming products.', 'Cat/Dog', 4),
  ('Dry & Wet Pet Food', 'dry-wet-pet-food', 'Complete nutrition premium dry kibbles and pouches for cats and dogs.', 'Cat/Dog', 5),
  ('Cat Litter & Hygiene', 'cat-litter-hygiene', 'Bentonite, scented and natural clumping cat litter.', 'Cat', 6)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_category = EXCLUDED.parent_category,
  display_order = EXCLUDED.display_order;

-- 2. Remap any products pointing to legacy categories to the corresponding official category
DO $$
DECLARE
  v_cat_parasite UUID;
  v_cat_health UUID;
  v_cat_wound UUID;
  v_cat_grooming UUID;
  v_cat_food UUID;
  v_cat_litter UUID;
BEGIN
  SELECT id INTO v_cat_parasite FROM categories WHERE slug = 'parasite-tick-control';
  SELECT id INTO v_cat_health FROM categories WHERE slug = 'health-supplements';
  SELECT id INTO v_cat_wound FROM categories WHERE slug = 'wound-care-topical-pharmacy';
  SELECT id INTO v_cat_grooming FROM categories WHERE slug = 'medicated-shampoos-grooming';
  SELECT id INTO v_cat_food FROM categories WHERE slug = 'dry-wet-pet-food';
  SELECT id INTO v_cat_litter FROM categories WHERE slug = 'cat-litter-hygiene';

  -- Remap Parasite & Tick legacy categories
  UPDATE products 
  SET category_id = v_cat_parasite 
  WHERE category_id IN (
    SELECT id FROM categories WHERE slug IN ('tick-flea-treatment')
  );

  -- Remap Health & Supplements legacy categories
  UPDATE products 
  SET category_id = v_cat_health 
  WHERE category_id IN (
    SELECT id FROM categories WHERE slug IN ('coat-skin-care', 'bone-joint', 'vitamins-supplements', 'digestive-health', 'deworming')
  );

  -- Remap Wound Care legacy categories
  UPDATE products 
  SET category_id = v_cat_wound 
  WHERE category_id IN (
    SELECT id FROM categories WHERE slug IN ('wound-care')
  );

  -- Remap Shampoos & Grooming legacy categories
  UPDATE products 
  SET category_id = v_cat_grooming 
  WHERE category_id IN (
    SELECT id FROM categories WHERE slug IN ('shampoo-grooming', 'soap')
  );

  -- Remap Food & Treats legacy categories
  UPDATE products 
  SET category_id = v_cat_food 
  WHERE category_id IN (
    SELECT id FROM categories WHERE slug IN ('dog-food-dry', 'dog-food-wet', 'cat-food-dry', 'cat-food-wet-treats', 'dairy-treats')
  );

  -- Remap Cat Litter & Hygiene legacy categories
  UPDATE products 
  SET category_id = v_cat_litter 
  WHERE category_id IN (
    SELECT id FROM categories WHERE slug IN ('cat-litter', 'powder-talc')
  );

  -- Any remaining products with a NULL or invalid category will be mapped to 'health-supplements' by default
  UPDATE products 
  SET category_id = v_cat_health 
  WHERE category_id IS NULL;
END $$;

-- 3. Delete all legacy / orphaned categories that are not part of the 6 official categories
DELETE FROM categories 
WHERE slug NOT IN (
  'parasite-tick-control',
  'health-supplements',
  'wound-care-topical-pharmacy',
  'medicated-shampoos-grooming',
  'dry-wet-pet-food',
  'cat-litter-hygiene'
);

-- 4. Verify Final State
SELECT c.name, c.slug, COUNT(p.id) AS total_products
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name, c.slug, c.display_order
ORDER BY c.display_order;
