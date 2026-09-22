-- =====================================================================
-- Update Realistic Product Stock Data for PetSolutions.lk
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jnakxlejkmyptoffvhsa/sql
-- =====================================================================

-- 1. Set 4 products to Out of Stock (stock = 0)
UPDATE product_variants 
SET stock = 0 
WHERE product_id IN (
  SELECT id FROM products ORDER BY name ASC LIMIT 4 OFFSET 5
);

-- 2. Set 6 products to Low Stock (stock between 1 and 4 units)
UPDATE product_variants 
SET stock = 2
WHERE product_id IN (
  SELECT id FROM products ORDER BY name ASC LIMIT 3 OFFSET 12
);

UPDATE product_variants 
SET stock = 4
WHERE product_id IN (
  SELECT id FROM products ORDER BY name ASC LIMIT 3 OFFSET 15
);

-- Verify the new realistic stock distribution:
SELECT 
  COUNT(*) AS total_variants,
  COUNT(CASE WHEN stock = 0 THEN 1 END) AS out_of_stock,
  COUNT(CASE WHEN stock > 0 AND stock <= 5 THEN 1 END) AS low_stock,
  COUNT(CASE WHEN stock > 5 THEN 1 END) AS in_stock
FROM product_variants;
