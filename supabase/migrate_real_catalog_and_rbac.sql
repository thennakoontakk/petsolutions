-- ==========================================================================
-- PetSolutions.lk: Complete Master Catalog Seeding & RBAC Migration
-- 69 Exact Products from Clinical Word Document + 118 Real Priced Variants from Excel
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jnakxlejkmyptoffvhsa/sql
-- ==========================================================================

-- 1. Remove dummy / test products (e.g. saalayo)
DELETE FROM cart_items WHERE product_id IN (SELECT id FROM products WHERE name ILIKE '%saalayo%' OR slug ILIKE '%saalayo%');
DELETE FROM order_items WHERE product_id IN (SELECT id FROM products WHERE name ILIKE '%saalayo%' OR slug ILIKE '%saalayo%');
DELETE FROM product_variants WHERE product_id IN (SELECT id FROM products WHERE name ILIKE '%saalayo%' OR slug ILIKE '%saalayo%');
DELETE FROM products WHERE name ILIKE '%saalayo%' OR slug ILIKE '%saalayo%';

-- 2. Add RBAC support to profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'customer' CHECK (role IN ('owner', 'staff', 'pharmacist', 'customer'));
  END IF;
END $$;

-- Update existing admin profiles to have role 'owner'
UPDATE profiles SET role = 'owner' WHERE is_admin = true AND (role IS NULL OR role = 'customer');

-- 3. Ensure Store Settings table exists for free delivery threshold and promo config
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read store settings" ON store_settings;
CREATE POLICY "Public can read store settings" ON store_settings FOR SELECT USING (true);

INSERT INTO store_settings (key, value) VALUES
  ('delivery_threshold', '{"free_delivery_min": 10000, "standard_delivery_fee": 450}'::jsonb),
  ('contact_info', '{"phone": "+94 77 123 4567", "email": "care@petsolutions.lk", "address": "Colombo, Sri Lanka"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. Ensure Promotional Offers Exist
INSERT INTO offers (title, description, discount_type, discount_value, min_order_amount, code, applies_to, start_date, end_date, is_active) VALUES
  ('Welcome Discount', 'Get 10% off your first pet wellness order', 'percentage', 10.00, 2500.00, 'WELCOME10', 'all', now(), now() + interval '180 days', true),
  ('Veterinary Care Special', 'Flat Rs. 500 off prescription and supplement orders over Rs. 5,000', 'fixed', 500.00, 5000.00, 'VETCARE500', 'all', now(), now() + interval '90 days', true),
  ('Mega Saver', 'Save 15% on bulk orders over Rs. 15,000', 'percentage', 15.00, 15000.00, 'SAVER15', 'all', now(), now() + interval '120 days', true)
ON CONFLICT (code) DO UPDATE SET is_active = true;

-- 5. Sync Categories
INSERT INTO categories (name, slug, parent_category, display_order) VALUES ('Anti-Tick & Parasite Care', 'anti-tick-parasite-care', 'Cat/Dog', 1) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (name, slug, parent_category, display_order) VALUES ('Veterinary Supplements & Tonics', 'veterinary-supplements-tonics', 'Cat/Dog', 2) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (name, slug, parent_category, display_order) VALUES ('Wound Healing & Topical Pharmacy', 'wound-healing-topical-pharmacy', 'Cat/Dog', 3) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (name, slug, parent_category, display_order) VALUES ('Medicated Coat Care & Shampoos', 'medicated-coat-care-shampoos', 'Cat/Dog', 4) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (name, slug, parent_category, display_order) VALUES ('Clinical Dry & Wet Diets', 'clinical-dry-wet-diets', 'Cat/Dog', 5) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (name, slug, parent_category, display_order) VALUES ('Cat Litter & Clinical Hygiene', 'cat-litter-clinical-hygiene', 'Cat', 6) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 6. Insert/Update the 69 Products and 118 Variants
DO $$
DECLARE
  pid UUID;
  cid UUID;
BEGIN

  -- Product #1: TixFree Spot-On for Adult Cats
  SELECT id INTO cid FROM categories WHERE slug = 'anti-tick-parasite-care' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'tixfree-spot-on-for-adult-cats' OR name ILIKE 'TixFree Spot-On for Adult Cats' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'TixFree Spot-On for Adult Cats',
      'tixfree-spot-on-for-adult-cats',
      'TixFree',
      cid,
      'Cat',
      'TixFree Spot-On for Adult Cats contains fipronil 10% w/v for topical control of common external parasites including fleas, ticks and biting lice. Apply the complete pipette directly to the skin at the back of the neck, following the pack instructions for retreatment intervals. The adult-cat presentation is 0.5 ml and is available as individual pipettes and multi-dose retail packs. For veterinary use only; avoid contact with the eyes and mouth and follow all label precautions.',
      'Fipronil 10% w/v. It is marketed for control of fleas, ticks and biting lice on cats.',
      NULL,
      'Apply the complete single-dose pipette directly to exposed skin at the base/back of the neck where the cat cannot readily lick it. The local retailer instructions describe monthly protection and recommend keeping the animal dry for about 48 hours after application.',
      'A small single-use plastic spot-on pipette, sold individually or as a three-dose carton.',
      'The detailed local listing says to avoid use in sick or convalescent animals and rabbits, avoid the eyes and mouth, prevent children from handling the application area, and store below 30°C in a dry place; the formulation should be treated as flammable until dry.',
      '/images/products/tixfree-spot-on-for-adult-cats.png',
      ARRAY['/images/products/tixfree-spot-on-for-adult-cats.png']::TEXT[],
      true,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'TixFree Spot-On for Adult Cats',
      brand = 'TixFree',
      category_id = cid,
      pet_type = 'Cat',
      description = 'TixFree Spot-On for Adult Cats contains fipronil 10% w/v for topical control of common external parasites including fleas, ticks and biting lice. Apply the complete pipette directly to the skin at the back of the neck, following the pack instructions for retreatment intervals. The adult-cat presentation is 0.5 ml and is available as individual pipettes and multi-dose retail packs. For veterinary use only; avoid contact with the eyes and mouth and follow all label precautions.',
      ingredients = 'Fipronil 10% w/v. It is marketed for control of fleas, ticks and biting lice on cats.',
      indications = NULL,
      directions = 'Apply the complete single-dose pipette directly to exposed skin at the base/back of the neck where the cat cannot readily lick it. The local retailer instructions describe monthly protection and recommend keeping the animal dry for about 48 hours after application.',
      packaging = 'A small single-use plastic spot-on pipette, sold individually or as a three-dose carton.',
      storage_safety = 'The detailed local listing says to avoid use in sick or convalescent animals and rabbits, avoid the eyes and mouth, prevent children from handling the application area, and store below 30°C in a dry place; the formulation should be treated as flammable until dry.',
      is_featured = true,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, 'Adult Cat (3 pipettes pack)', 1980.00, 2200.00, 120, true);

  -- Product #2: TixFree Spot-On for Dogs
  SELECT id INTO cid FROM categories WHERE slug = 'anti-tick-parasite-care' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'tixfree-spot-on-for-dogs' OR name ILIKE 'TixFree Spot-On for Dogs' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'TixFree Spot-On for Dogs',
      'tixfree-spot-on-for-dogs',
      'TixFree',
      cid,
      'Dog',
      'TixFree Spot-On for Dogs contains fipronil 10% and provides topical protection against common external parasites such as fleas and ticks. The range includes weight-specific presentations for dogs from 2-10 kg through to over 40 kg, with individual and three-dose packs available. Apply the full contents of the appropriate pipette directly onto exposed skin according to the label. Always select the exact weight category shown on the pack rather than adjusting another size.',
      NULL,
      NULL,
      'Select the presentation for the dog''s body weight, part the hair and empty the complete pipette onto the skin rather than the coat. The local retailer instructions emphasize using the correct weight-specific dose.',
      'Weight-coded single-dose pipettes, sold individually or in three-dose boxes.',
      'Detailed storage information for every dog SKU was not recovered; use only the correctly labeled canine weight range and follow the pack''s external-use precautions. Do not calculate a different dose from the concentration when a weight-specific pipette is available.',
      '/images/products/tixfree-spot-on-for-dogs.png',
      ARRAY['/images/products/tixfree-spot-on-for-dogs.png']::TEXT[],
      true,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'TixFree Spot-On for Dogs',
      brand = 'TixFree',
      category_id = cid,
      pet_type = 'Dog',
      description = 'TixFree Spot-On for Dogs contains fipronil 10% and provides topical protection against common external parasites such as fleas and ticks. The range includes weight-specific presentations for dogs from 2-10 kg through to over 40 kg, with individual and three-dose packs available. Apply the full contents of the appropriate pipette directly onto exposed skin according to the label. Always select the exact weight category shown on the pack rather than adjusting another size.',
      ingredients = NULL,
      indications = NULL,
      directions = 'Select the presentation for the dog''s body weight, part the hair and empty the complete pipette onto the skin rather than the coat. The local retailer instructions emphasize using the correct weight-specific dose.',
      packaging = 'Weight-coded single-dose pipettes, sold individually or in three-dose boxes.',
      storage_safety = 'Detailed storage information for every dog SKU was not recovered; use only the correctly labeled canine weight range and follow the pack''s external-use precautions. Do not calculate a different dose from the concentration when a weight-specific pipette is available.',
      is_featured = true,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '02 - 10 Kg (3 pipettes)', 2700.00, 2950.00, 85, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 - 20 Kg (3 pipettes)', 3060.00, 3350.00, 65, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '20 - 40 Kg (3 pipettes)', 3570.00, 3900.00, 45, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '40 - 60 Kg (3 pipettes)', 4680.00, 5100.00, 30, true);

  -- Product #3: Antick 10%
  SELECT id INTO cid FROM categories WHERE slug = 'anti-tick-parasite-care' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'antick-10' OR name ILIKE 'Antick 10%' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Antick 10%',
      'antick-10',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Antick 10% contains cypermethrin 10 g/100 ml and is designed for external parasite control in dogs and several livestock species. Controls ticks, fleas, lice and flies among its target parasites. The published dilution is 1 ml in 1 L of water for whole-body spraying, subject to the individual product label. Available pack sizes are 10 ml and 1 L.',
      'The official listing gives cypermethrin 10 g per 100 ml, equivalent to a 10% formulation, in solvent/emulsifying vehicle.',
      NULL,
      NULL,
      'Small concentrate bottles in the 10-ml sizes and a larger 1-L bottle.',
      NULL,
      '/images/products/antick-10.png',
      ARRAY['/images/products/antick-10.png']::TEXT[],
      true,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Antick 10%',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Antick 10% contains cypermethrin 10 g/100 ml and is designed for external parasite control in dogs and several livestock species. Controls ticks, fleas, lice and flies among its target parasites. The published dilution is 1 ml in 1 L of water for whole-body spraying, subject to the individual product label. Available pack sizes are 10 ml and 1 L.',
      ingredients = 'The official listing gives cypermethrin 10 g per 100 ml, equivalent to a 10% formulation, in solvent/emulsifying vehicle.',
      indications = NULL,
      directions = NULL,
      packaging = 'Small concentrate bottles in the 10-ml sizes and a larger 1-L bottle.',
      storage_safety = NULL,
      is_featured = true,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 ml Bottle', 775.00, 850.00, 100, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1 Litre Pack', 56500.00, 59000.00, 15, true);

  -- Product #4: Tickamit 12.5
  SELECT id INTO cid FROM categories WHERE slug = 'anti-tick-parasite-care' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'tickamit-12-5' OR name ILIKE 'Tickamit 12.5' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Tickamit 12.5',
      'tickamit-12-5',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Calier Tickamit 12.5 is a concentrated amitraz-based ectoparasiticide for management of ticks, lice and mites in dogs and selected livestock species. Sri Lankan listings identify 10 ml, 100 ml and 1 L packs. As the product is a concentrate, dilution and application must follow the exact veterinary label for the intended animal. Do not transfer dosage instructions from a different market or species without veterinary confirmation.',
      NULL,
      'Marketed for control of ticks, lice and mites in animals including dogs and several livestock species; the product information also refers to ectoparasites resistant to some phosphorate/pyrethroid treatments.',
      NULL,
      NULL,
      NULL,
      '/images/products/tickamit-12-5.png',
      ARRAY['/images/products/tickamit-12-5.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Tickamit 12.5',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Calier Tickamit 12.5 is a concentrated amitraz-based ectoparasiticide for management of ticks, lice and mites in dogs and selected livestock species. Sri Lankan listings identify 10 ml, 100 ml and 1 L packs. As the product is a concentrate, dilution and application must follow the exact veterinary label for the intended animal. Do not transfer dosage instructions from a different market or species without veterinary confirmation.',
      ingredients = NULL,
      indications = 'Marketed for control of ticks, lice and mites in animals including dogs and several livestock species; the product information also refers to ectoparasites resistant to some phosphorate/pyrethroid treatments.',
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 ml Bottle', 990.00, 1100.00, 90, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '100 ml Bottle', 9450.00, 9900.00, 25, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1 Litre Pack', 76000.00, 80000.00, 10, true);

  -- Product #5: Rapimec - Ivermectin 10 mg Tablets
  SELECT id INTO cid FROM categories WHERE slug = 'anti-tick-parasite-care' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'rapimec-ivermectin-10-mg-tablets' OR name ILIKE 'Rapimec - Ivermectin 10 mg Tablets' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Rapimec - Ivermectin 10 mg Tablets',
      'rapimec-ivermectin-10-mg-tablets',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Rapimec is a veterinary ivermectin tablet containing 10 mg ivermectin per tablet. The product is for management of generalized demodicosis in dogs and supplies it in a 1 × 10-tablet presentation. Because ivermectin dosing depends on the animal and clinical indication, the manufacturer''s listing directs users to follow veterinary-practitioner instructions.',
      NULL,
      NULL,
      'As directed by the veterinary practitioner rather than giving a consumer self-dosing schedule.',
      'Ten tablets, normally presented as a blister/strip within retail packaging.',
      NULL,
      '/images/products/rapimec-ivermectin-10-mg-tablets.png',
      ARRAY['/images/products/rapimec-ivermectin-10-mg-tablets.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Rapimec - Ivermectin 10 mg Tablets',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Rapimec is a veterinary ivermectin tablet containing 10 mg ivermectin per tablet. The product is for management of generalized demodicosis in dogs and supplies it in a 1 × 10-tablet presentation. Because ivermectin dosing depends on the animal and clinical indication, the manufacturer''s listing directs users to follow veterinary-practitioner instructions.',
      ingredients = NULL,
      indications = NULL,
      directions = 'As directed by the veterinary practitioner rather than giving a consumer self-dosing schedule.',
      packaging = 'Ten tablets, normally presented as a blister/strip within retail packaging.',
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10''s Pack', 1100.00, 1250.00, 80, true);

  -- Product #6: Petfat Liquid 200 ml
  SELECT id INTO cid FROM categories WHERE slug = 'tonics-vitamins-supplements' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'petfat-liquid-200-ml' OR name ILIKE 'Petfat Liquid 200 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Petfat Liquid 200 ml',
      'petfat-liquid-200-ml',
      'Vetgrow',
      cid,
      'Cat/Dog',
      'Petfat Liquid provides concentrated omega-3 triglycerides with EPA and DHA for nutritional skin and coat support. Each 2 g serving contains at least 440 mg total omega-3 triglycerides, including at least 280 mg EPA and 160 mg DHA. Hayleys lists a daily feeding rate of 2 g per 5 kg body weight, with one pump delivering approximately 2 g. The product is supplied in a 200 ml bottle for convenient addition to food.',
      NULL,
      NULL,
      '2 g per 5 kg body weight daily, administered through feed; one pump = 2 g according to the product listing.',
      '200-ml dispensing bottle, with a pump calibrated to approximately 2 g per actuation.',
      'Specific storage conditions were unspecified. Use as a feed supplement at the recommended amount.',
      '/images/products/petfat-liquid-200-ml.png',
      ARRAY['/images/products/petfat-liquid-200-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Petfat Liquid 200 ml',
      brand = 'Vetgrow',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Petfat Liquid provides concentrated omega-3 triglycerides with EPA and DHA for nutritional skin and coat support. Each 2 g serving contains at least 440 mg total omega-3 triglycerides, including at least 280 mg EPA and 160 mg DHA. Hayleys lists a daily feeding rate of 2 g per 5 kg body weight, with one pump delivering approximately 2 g. The product is supplied in a 200 ml bottle for convenient addition to food.',
      ingredients = NULL,
      indications = NULL,
      directions = '2 g per 5 kg body weight daily, administered through feed; one pump = 2 g according to the product listing.',
      packaging = '200-ml dispensing bottle, with a pump calibrated to approximately 2 g per actuation.',
      storage_safety = 'Specific storage conditions were unspecified. Use as a feed supplement at the recommended amount.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 ml Bottle', 2150.00, 2300.00, 75, true);

  -- Product #7: Vetgrow Red Dogs 200 ml
  SELECT id INTO cid FROM categories WHERE slug = 'tonics-vitamins-supplements' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'vetgrow-red-dogs-200-ml' OR name ILIKE 'Vetgrow Red Dogs 200 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Vetgrow Red Dogs 200 ml',
      'vetgrow-red-dogs-200-ml',
      'Vetgrow',
      cid,
      'Dog',
      'Vetgrow Red Dogs is a veterinary-developed nutritional liquid for dogs, providing essential fatty acids including DHA, DPA and EPA. It is designed to support healthy skin, a glossy coat and everyday energy and activity. A local product listing recommends 5 ml per 10 kg body weight daily, given directly or with food. Retail presentations include 200 ml.',
      NULL,
      NULL,
      'A detailed local listing gives 5 ml per 10 kg body weight daily, mixed with food or given directly.',
      '200-ml liquid bottle; larger 1-L bottle',
      'Store cool and dry, away from direct sunlight, and keep the bottle tightly closed.',
      '/images/products/vetgrow-red-dogs-200-ml.png',
      ARRAY['/images/products/vetgrow-red-dogs-200-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Vetgrow Red Dogs 200 ml',
      brand = 'Vetgrow',
      category_id = cid,
      pet_type = 'Dog',
      description = 'Vetgrow Red Dogs is a veterinary-developed nutritional liquid for dogs, providing essential fatty acids including DHA, DPA and EPA. It is designed to support healthy skin, a glossy coat and everyday energy and activity. A local product listing recommends 5 ml per 10 kg body weight daily, given directly or with food. Retail presentations include 200 ml.',
      ingredients = NULL,
      indications = NULL,
      directions = 'A detailed local listing gives 5 ml per 10 kg body weight daily, mixed with food or given directly.',
      packaging = '200-ml liquid bottle; larger 1-L bottle',
      storage_safety = 'Store cool and dry, away from direct sunlight, and keep the bottle tightly closed.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 ml Bottle', 1500.00, 1650.00, 60, true);

  -- Product #8: Orcalmin Suspension 200 ml
  SELECT id INTO cid FROM categories WHERE slug = 'tonics-vitamins-supplements' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'orcalmin-suspension-200-ml' OR name ILIKE 'Orcalmin Suspension 200 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Orcalmin Suspension 200 ml',
      'orcalmin-suspension-200-ml',
      'Vetgrow',
      cid,
      'Cat/Dog',
      'Orcalmin is a mineral-support suspension formulated around Microcrystalline Hydroxyapatite Complex. Each 5 ml provides calcium equivalent to 33 mg, phosphorus 15 mg and vitamin D 100 IU. The combination is intended to provide nutritional support for normal bone structure and healthy teeth. The verified presentation is 200 ml; follow the current product label for species-appropriate feeding directions.',
      NULL,
      'Nutritional support for healthy bone structure and teeth.',
      'Exact species/weight dosage was unspecified in the retrieved official result; use as directed on the bottle or by the veterinarian.',
      '200-ml oral-suspension bottle.',
      NULL,
      '/images/products/orcalmin-suspension-200-ml.png',
      ARRAY['/images/products/orcalmin-suspension-200-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Orcalmin Suspension 200 ml',
      brand = 'Vetgrow',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Orcalmin is a mineral-support suspension formulated around Microcrystalline Hydroxyapatite Complex. Each 5 ml provides calcium equivalent to 33 mg, phosphorus 15 mg and vitamin D 100 IU. The combination is intended to provide nutritional support for normal bone structure and healthy teeth. The verified presentation is 200 ml; follow the current product label for species-appropriate feeding directions.',
      ingredients = NULL,
      indications = 'Nutritional support for healthy bone structure and teeth.',
      directions = 'Exact species/weight dosage was unspecified in the retrieved official result; use as directed on the bottle or by the veterinarian.',
      packaging = '200-ml oral-suspension bottle.',
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 ml Suspension', 925.00, 1050.00, 90, true);

  -- Product #9: Bones-Up 200 g
  SELECT id INTO cid FROM categories WHERE slug = 'tonics-vitamins-supplements' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'bones-up-200-g' OR name ILIKE 'Bones-Up 200 g' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Bones-Up 200 g',
      'bones-up-200-g',
      'Vetgrow',
      cid,
      'Cat/Dog',
      'Bones-Up is a Vetgrow mineral and vitamin supplement formulated to support bone and dental nutrition in dogs and cats, including growing, pregnant and lactating animals. The formula is rich in calcium, phosphorus and magnesium together with key vitamins, and Vetgrow emphasizes the bioavailability of its mineral sources. It is particularly positioned to support skeletal development in large-breed dogs. Feed one 5 g teaspoonful per 10 kg body weight daily according to the manufacturer''s guidance.',
      NULL,
      NULL,
      'One teaspoonful / 5 g per 10 kg body weight daily.',
      'Powder supplement in 200-g and 900-g consumer containers.',
      'Specific storage conditions unspecified.',
      '/images/products/bones-up-200-g.png',
      ARRAY['/images/products/bones-up-200-g.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Bones-Up 200 g',
      brand = 'Vetgrow',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Bones-Up is a Vetgrow mineral and vitamin supplement formulated to support bone and dental nutrition in dogs and cats, including growing, pregnant and lactating animals. The formula is rich in calcium, phosphorus and magnesium together with key vitamins, and Vetgrow emphasizes the bioavailability of its mineral sources. It is particularly positioned to support skeletal development in large-breed dogs. Feed one 5 g teaspoonful per 10 kg body weight daily according to the manufacturer''s guidance.',
      ingredients = NULL,
      indications = NULL,
      directions = 'One teaspoonful / 5 g per 10 kg body weight daily.',
      packaging = 'Powder supplement in 200-g and 900-g consumer containers.',
      storage_safety = 'Specific storage conditions unspecified.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 g Container', 1400.00, 1550.00, 80, true);

  -- Product #10: Liv.52 Pet Liquid 200 ml
  SELECT id INTO cid FROM categories WHERE slug = 'tonics-vitamins-supplements' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'liv-52-pet-liquid-200-ml' OR name ILIKE 'Liv.52 Pet Liquid 200 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Liv.52 Pet Liquid 200 ml',
      'liv-52-pet-liquid-200-ml',
      'Himalaya',
      cid,
      'Cat/Dog',
      'Liv.52 pet is Himalaya''s companion-animal herbal liquid for appetite and liver support. Its key botanical ingredients are Caper Bush and Chicory, herbs used by Himalaya in its hepatoprotective formulation. The manufacturer''s current guidance lists 5-8 ml twice daily for small-breed dogs and 10-15 ml twice daily for large breeds, with adjustment according to veterinary advice. The official pack contains 200 ml.',
      NULL,
      'Liv.52 pet as an appetite stimulant and hepatoprotective product, with the herbal ingredients positioned for liver-support applications.',
      'Small-breed dogs: 5-8 ml twice daily; large-breed dogs: 10-15 ml twice daily. Himalaya states that dosage may be altered for breed/severity or as directed by a veterinarian.',
      '200-ml labeled liquid bottle.',
      NULL,
      '/images/products/liv-52-pet-liquid-200-ml.png',
      ARRAY['/images/products/liv-52-pet-liquid-200-ml.png']::TEXT[],
      true,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Liv.52 Pet Liquid 200 ml',
      brand = 'Himalaya',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Liv.52 pet is Himalaya''s companion-animal herbal liquid for appetite and liver support. Its key botanical ingredients are Caper Bush and Chicory, herbs used by Himalaya in its hepatoprotective formulation. The manufacturer''s current guidance lists 5-8 ml twice daily for small-breed dogs and 10-15 ml twice daily for large breeds, with adjustment according to veterinary advice. The official pack contains 200 ml.',
      ingredients = NULL,
      indications = 'Liv.52 pet as an appetite stimulant and hepatoprotective product, with the herbal ingredients positioned for liver-support applications.',
      directions = 'Small-breed dogs: 5-8 ml twice daily; large-breed dogs: 10-15 ml twice daily. Himalaya states that dosage may be altered for breed/severity or as directed by a veterinarian.',
      packaging = '200-ml labeled liquid bottle.',
      storage_safety = NULL,
      is_featured = true,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 ml Bottle', 1200.00, 1350.00, 150, true);

  -- Product #11: Digyton Drops 30 ml
  SELECT id INTO cid FROM categories WHERE slug = 'tonics-vitamins-supplements' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'digyton-drops-30-ml' OR name ILIKE 'Digyton Drops 30 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Digyton Drops 30 ml',
      'digyton-drops-30-ml',
      'Himalaya',
      cid,
      'Cat/Dog',
      'Digyton Drops is Himalaya''s companion-animal digestive support formulation containing cardamom and dill oil. The product is designed to facilitate secretion of proteolytic, amylolytic and lipolytic enzymes involved in food digestion while supporting bowel regulation. Dosage should be selected according to the animal''s breed, condition and veterinary advice rather than extrapolated from another Digyton product. The official presentation is a 30 ml bottle.',
      'Cardamom and Dill Oil, with concentrations unspecified.',
      NULL,
      'As directed by a veterinarian.',
      '30-ml dropper-style veterinary bottle.',
      NULL,
      '/images/products/digyton-drops-30-ml.png',
      ARRAY['/images/products/digyton-drops-30-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Digyton Drops 30 ml',
      brand = 'Himalaya',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Digyton Drops is Himalaya''s companion-animal digestive support formulation containing cardamom and dill oil. The product is designed to facilitate secretion of proteolytic, amylolytic and lipolytic enzymes involved in food digestion while supporting bowel regulation. Dosage should be selected according to the animal''s breed, condition and veterinary advice rather than extrapolated from another Digyton product. The official presentation is a 30 ml bottle.',
      ingredients = 'Cardamom and Dill Oil, with concentrations unspecified.',
      indications = NULL,
      directions = 'As directed by a veterinarian.',
      packaging = '30-ml dropper-style veterinary bottle.',
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '30 ml Drops', 383.00, 420.00, 110, true);

  -- Product #12: aRBCe PET 200 ml
  SELECT id INTO cid FROM categories WHERE slug = 'tonics-vitamins-supplements' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'arbce-pet-200-ml' OR name ILIKE 'aRBCe PET 200 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'aRBCe PET 200 ml',
      'arbce-pet-200-ml',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'aRBCe PET is palatable haematinic supplement formulated with bioavailable glycine-chelated minerals. Its confirmed components include chelated iron, copper and cobalt together with vitamins B2 and B3, providing nutritional support for haemoglobin formation and recovery from nutritional deficiency. Veterinary retailers also position the product for supportive use during anaemia, debility and convalescence. The verified pack size is 200 ml; dosing should follow the local pack or veterinarian.',
      NULL,
      NULL,
      'Dogs: 5 ml per 20 kg body weight twice daily; cats: 0.5 ml per 5 kg twice daily, directly or mixed with food.',
      '200-ml palatable oral-liquid bottle.',
      NULL,
      '/images/products/arbce-pet-200-ml.png',
      ARRAY['/images/products/arbce-pet-200-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'aRBCe PET 200 ml',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'aRBCe PET is palatable haematinic supplement formulated with bioavailable glycine-chelated minerals. Its confirmed components include chelated iron, copper and cobalt together with vitamins B2 and B3, providing nutritional support for haemoglobin formation and recovery from nutritional deficiency. Veterinary retailers also position the product for supportive use during anaemia, debility and convalescence. The verified pack size is 200 ml; dosing should follow the local pack or veterinarian.',
      ingredients = NULL,
      indications = NULL,
      directions = 'Dogs: 5 ml per 20 kg body weight twice daily; cats: 0.5 ml per 5 kg twice daily, directly or mixed with food.',
      packaging = '200-ml palatable oral-liquid bottle.',
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 ml Bottle', 1625.00, 1800.00, 70, true);

  -- Product #13: Vi-Sorbits Tablets 50s
  SELECT id INTO cid FROM categories WHERE slug = 'tonics-vitamins-supplements' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'vi-sorbits-tablets-50s' OR name ILIKE 'Vi-Sorbits Tablets 50s' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Vi-Sorbits Tablets 50s',
      'vi-sorbits-tablets-50s',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Vi-Sorbits provides a broad spectrum of vitamins and minerals in a palatable tablet formulated for dogs. The formula includes vitamins A, D, E and B-complex nutrients together with iron, copper, calcium, phosphorus and other essential minerals. Give one tablet daily, either whole or crumbled over food, unless otherwise directed by a veterinarian. Store between 15°C and 30°C and keep out of children''s reach.',
      NULL,
      NULL,
      'One tablet daily, given whole or crumbled onto food.',
      'Tablet bottle, with count varying by market.',
      'Store at 15-30°C and keep out of reach of children.',
      '/images/products/vi-sorbits-tablets-50s.png',
      ARRAY['/images/products/vi-sorbits-tablets-50s.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Vi-Sorbits Tablets 50s',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Vi-Sorbits provides a broad spectrum of vitamins and minerals in a palatable tablet formulated for dogs. The formula includes vitamins A, D, E and B-complex nutrients together with iron, copper, calcium, phosphorus and other essential minerals. Give one tablet daily, either whole or crumbled over food, unless otherwise directed by a veterinarian. Store between 15°C and 30°C and keep out of children''s reach.',
      ingredients = NULL,
      indications = NULL,
      directions = 'One tablet daily, given whole or crumbled onto food.',
      packaging = 'Tablet bottle, with count varying by market.',
      storage_safety = 'Store at 15-30°C and keep out of reach of children.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '50 Tablets Pack', 9375.00, 9900.00, 40, true);

  -- Product #14: Scavon VET Spray 100 ml
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'scavon-vet-spray-100-ml' OR name ILIKE 'Scavon VET Spray 100 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Scavon VET Spray 100 ml',
      'scavon-vet-spray-100-ml',
      'Himalaya',
      cid,
      'Cat/Dog',
      'Scavon VET Spray is Himalaya''s topical veterinary wound-care formulation for traumatic, surgical and infected wounds. Its ingredient blend includes Atasi, eucalyptus, camphor, Tulasi and Vacha components together with Yashada bhasma. Clean the wound and apply the required amount according to the veterinary label, generally twice daily for companion-animal applications. Store the 100 ml spray away from direct heat and sunlight and keep out of children''s reach.',
      NULL,
      'Traumatic and surgical wounds, maggot-infested or infected wounds, bacterial/fungal wound conditions and selected livestock lesions.',
      'Clip hair where necessary, clean the affected area and apply the required quantity, generally twice daily for companion-animal wound care according to the manufacturer''s instructions.',
      '100-ml labeled spray container.',
      'Store dry, away from direct heat and sunlight; do not refrigerate; keep away from children and do not expose the container above 50°C. For animal use only.',
      '/images/products/scavon-vet-spray-100-ml.png',
      ARRAY['/images/products/scavon-vet-spray-100-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Scavon VET Spray 100 ml',
      brand = 'Himalaya',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Scavon VET Spray is Himalaya''s topical veterinary wound-care formulation for traumatic, surgical and infected wounds. Its ingredient blend includes Atasi, eucalyptus, camphor, Tulasi and Vacha components together with Yashada bhasma. Clean the wound and apply the required amount according to the veterinary label, generally twice daily for companion-animal applications. Store the 100 ml spray away from direct heat and sunlight and keep out of children''s reach.',
      ingredients = NULL,
      indications = 'Traumatic and surgical wounds, maggot-infested or infected wounds, bacterial/fungal wound conditions and selected livestock lesions.',
      directions = 'Clip hair where necessary, clean the affected area and apply the required quantity, generally twice daily for companion-animal wound care according to the manufacturer''s instructions.',
      packaging = '100-ml labeled spray container.',
      storage_safety = 'Store dry, away from direct heat and sunlight; do not refrigerate; keep away from children and do not expose the container above 50°C. For animal use only.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '100 ml Spray', 1331.00, 1450.00, 95, true);

  -- Product #15: Scavon VET Cream 50 g
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'scavon-vet-cream-50-g' OR name ILIKE 'Scavon VET Cream 50 g' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Scavon VET Cream 50 g',
      'scavon-vet-cream-50-g',
      'Himalaya',
      cid,
      'Cat/Dog',
      'Scavon VET Cream provides Himalaya''s antimicrobial and wound-support formulation in a convenient topical cream. It combines herbal ingredients including Atasi, eucalyptus, camphor, Tulasi and Vacha with Yashada bhasma and is intended for a range of traumatic and infected wounds. Clean the affected area before application and use at the frequency shown on the label or prescribed by a veterinarian. The product is supplied in a 50 g presentation and should be protected from direct heat and sunlight.',
      'The cream uses the Scavon herbal/mineral wound-care combination, including Atasi, eucalyptus/Tailapatra, Karpura, Tulasi, Vacha and Yashada bhasma.',
      NULL,
      NULL,
      '50-g topical cream tube, normally within labeled retail packaging.',
      'Dry storage away from direct heat and sunlight; do not refrigerate; keep out of children''s reach; animal use only.',
      '/images/products/scavon-vet-cream-50-g.png',
      ARRAY['/images/products/scavon-vet-cream-50-g.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Scavon VET Cream 50 g',
      brand = 'Himalaya',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Scavon VET Cream provides Himalaya''s antimicrobial and wound-support formulation in a convenient topical cream. It combines herbal ingredients including Atasi, eucalyptus, camphor, Tulasi and Vacha with Yashada bhasma and is intended for a range of traumatic and infected wounds. Clean the affected area before application and use at the frequency shown on the label or prescribed by a veterinarian. The product is supplied in a 50 g presentation and should be protected from direct heat and sunlight.',
      ingredients = 'The cream uses the Scavon herbal/mineral wound-care combination, including Atasi, eucalyptus/Tailapatra, Karpura, Tulasi, Vacha and Yashada bhasma.',
      indications = NULL,
      directions = NULL,
      packaging = '50-g topical cream tube, normally within labeled retail packaging.',
      storage_safety = 'Dry storage away from direct heat and sunlight; do not refrigerate; keep out of children''s reach; animal use only.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '50 g Tube', 793.00, 880.00, 85, true);

  -- Product #16: SANPET-PLUS Broad Spectrum Deworming Tablets
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'sanpet-plus-broad-spectrum-deworming-tablets' OR name ILIKE 'SANPET-PLUS Broad Spectrum Deworming Tablets' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'SANPET-PLUS Broad Spectrum Deworming Tablets',
      'sanpet-plus-broad-spectrum-deworming-tablets',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'SANPET-PLUS',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/sanpet-plus-broad-spectrum-deworming-tablets.png',
      ARRAY['/images/products/sanpet-plus-broad-spectrum-deworming-tablets.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'SANPET-PLUS Broad Spectrum Deworming Tablets',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'SANPET-PLUS',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 kg Tablet', 360.00, 400.00, 200, true);

  -- Product #17: Wolfo Flea & Tick Powder
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'wolfo-flea-tick-powder' OR name ILIKE 'Wolfo Flea & Tick Powder' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Wolfo Flea & Tick Powder',
      'wolfo-flea-tick-powder',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Wolfo is a propoxur 1% w/w flea-and-tick powder designed for topical use on dogs and cats. The fine powder is distributed through the coat to reach the skin, with the local product instructions describing weekly use. It may also be used on specified pet resting areas according to the label. Because the product is classified as a poison and is harmful if ingested, use gloves and follow all handling precautions carefully.',
      'Propoxur 1% w/w.',
      NULL,
      NULL,
      'Shaker-style veterinary powder container; exact net weight unspecified.',
      NULL,
      '/images/products/wolfo-flea-tick-powder.png',
      ARRAY['/images/products/wolfo-flea-tick-powder.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Wolfo Flea & Tick Powder',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Wolfo is a propoxur 1% w/w flea-and-tick powder designed for topical use on dogs and cats. The fine powder is distributed through the coat to reach the skin, with the local product instructions describing weekly use. It may also be used on specified pet resting areas according to the label. Because the product is classified as a poison and is harmful if ingested, use gloves and follow all handling precautions carefully.',
      ingredients = 'Propoxur 1% w/w.',
      indications = NULL,
      directions = NULL,
      packaging = 'Shaker-style veterinary powder container; exact net weight unspecified.',
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '75 g Talc Powder', 590.00, 650.00, 100, true);

  -- Product #18: Woofy Medicated Neem Soap 70 g
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'woofy-medicated-neem-soap-70-g' OR name ILIKE 'Woofy Medicated Neem Soap 70 g' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Woofy Medicated Neem Soap 70 g',
      'woofy-medicated-neem-soap-70-g',
      'Seepet',
      cid,
      'Cat',
      'Woofy Medicated Neem Soap provides convenient routine cleansing for pets in a 70 g bar. Its neem-focused formulation is marketed for hygienic and antibacterial-support grooming while helping keep the coat clean and fresh. Wet the coat thoroughly, massage the lather through the fur and rinse well, taking care around the eyes and ears. Suitable species should always be confirmed from the individual pack label.',
      'Neem is the identified featured ingredient; a quantified full ingredient composition was unspecified.',
      NULL,
      'Wet the coat, work the soap into a lather and massage through the coat while avoiding the eyes and ears, then rinse thoroughly.',
      NULL,
      NULL,
      '/images/products/woofy-medicated-neem-soap-70-g.png',
      ARRAY['/images/products/woofy-medicated-neem-soap-70-g.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Woofy Medicated Neem Soap 70 g',
      brand = 'Seepet',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Woofy Medicated Neem Soap provides convenient routine cleansing for pets in a 70 g bar. Its neem-focused formulation is marketed for hygienic and antibacterial-support grooming while helping keep the coat clean and fresh. Wet the coat thoroughly, massage the lather through the fur and rinse well, taking care around the eyes and ears. Suitable species should always be confirmed from the individual pack label.',
      ingredients = 'Neem is the identified featured ingredient; a quantified full ingredient composition was unspecified.',
      indications = NULL,
      directions = 'Wet the coat, work the soap into a lather and massage through the coat while avoiding the eyes and ears, then rinse thoroughly.',
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '70 g Soap Bar', 450.00, 500.00, 120, true);

  -- Product #19: Woofy Lavender Soap 70 g
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'woofy-lavender-soap-70-g' OR name ILIKE 'Woofy Lavender Soap 70 g' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Woofy Lavender Soap 70 g',
      'woofy-lavender-soap-70-g',
      'Seepet',
      cid,
      'Cat/Dog',
      'Woofy Lavender Soap is a routine pet-grooming bar designed to cleanse the skin and coat while providing a pleasant lavender fragrance. It is listed for puppies, adult dogs and cats. Work the bar into a lather on a thoroughly wet coat, massage gently and rinse well while avoiding the eyes and ears. The retail presentation is a 70 g bar.',
      NULL,
      NULL,
      'Wet the coat, lather and massage, avoiding eyes and ears, then rinse completely.',
      'Individually packaged 70-g soap bar.',
      'Unspecified; keep the soap dry between uses and use externally as a grooming product.',
      '/images/products/woofy-lavender-soap-70-g.png',
      ARRAY['/images/products/woofy-lavender-soap-70-g.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Woofy Lavender Soap 70 g',
      brand = 'Seepet',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Woofy Lavender Soap is a routine pet-grooming bar designed to cleanse the skin and coat while providing a pleasant lavender fragrance. It is listed for puppies, adult dogs and cats. Work the bar into a lather on a thoroughly wet coat, massage gently and rinse well while avoiding the eyes and ears. The retail presentation is a 70 g bar.',
      ingredients = NULL,
      indications = NULL,
      directions = 'Wet the coat, lather and massage, avoiding eyes and ears, then rinse completely.',
      packaging = 'Individually packaged 70-g soap bar.',
      storage_safety = 'Unspecified; keep the soap dry between uses and use externally as a grooming product.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '70 g Soap Bar', 450.00, 500.00, 120, true);

  -- Product #20: Permvet Medicated Dog Soap 70 g
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'permvet-medicated-dog-soap-70-g' OR name ILIKE 'Permvet Medicated Dog Soap 70 g' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Permvet Medicated Dog Soap 70 g',
      'permvet-medicated-dog-soap-70-g',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Permvet is a medicated soap formulated specifically for dogs and contains permethrin 1%. It combines coat cleansing with topical flea-and-tick control and may help reduce discomfort associated with parasite infestation. Apply only according to the manufacturer''s dog-use directions and rinse as instructed on the pack. Do not extend use to other species unless their use is explicitly stated on the physical label.',
      NULL,
      'Marketed to help control fleas and ticks while cleansing the coat and helping with parasite-associated itch.',
      NULL,
      'Medicated soap bar, normally individually boxed/wrapped.',
      'Specific storage is unspecified. Because the verified listing explicitly identifies this as a dog soap, the website should not imply feline use unless the actual label specifically authorizes it.',
      '/images/products/permvet-medicated-dog-soap-70-g.png',
      ARRAY['/images/products/permvet-medicated-dog-soap-70-g.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Permvet Medicated Dog Soap 70 g',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Permvet is a medicated soap formulated specifically for dogs and contains permethrin 1%. It combines coat cleansing with topical flea-and-tick control and may help reduce discomfort associated with parasite infestation. Apply only according to the manufacturer''s dog-use directions and rinse as instructed on the pack. Do not extend use to other species unless their use is explicitly stated on the physical label.',
      ingredients = NULL,
      indications = 'Marketed to help control fleas and ticks while cleansing the coat and helping with parasite-associated itch.',
      directions = NULL,
      packaging = 'Medicated soap bar, normally individually boxed/wrapped.',
      storage_safety = 'Specific storage is unspecified. Because the verified listing explicitly identifies this as a dog soap, the website should not imply feline use unless the actual label specifically authorizes it.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '70 g Soap Bar', 650.00, 720.00, 100, true);

  -- Product #21: Nutricoat Advance
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'nutricoat-advance' OR name ILIKE 'Nutricoat Advance' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Nutricoat Advance',
      'nutricoat-advance',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Nutricoat Advance delivers concentrated essential fatty acids, including Omega-6 linoleic acid and Omega-3 linolenic acid, to support the skin barrier and coat condition of dogs and cats. It is used as nutritional support in a range of dermatological conditions including pyoderma, mange, fungal disease and Malassezia-associated dermatitis. Additional formulation listings identify supportive nutrients such as zinc, biotin, selenium and selected vitamins. Available in 200 g and 400 g packs; follow the feeding instructions printed on the exact market pack because dosage conventions vary between presentations.',
      NULL,
      NULL,
      'Product listings vary: local information includes 5 g/day for dogs and 10 g/day for pregnant/nursing bitches, while some international labels express dosing in ml/body weight. Therefore, the exact local bottle instruction should be used.',
      'Viscous liquid/oil supplement in bottles labeled by net weight, commonly 200 g or 400 g.',
      'Store in a cool, dry place; a local listing additionally advises cool/dark storage with the container closed.',
      '/images/products/nutricoat-advance.png',
      ARRAY['/images/products/nutricoat-advance.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Nutricoat Advance',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Nutricoat Advance delivers concentrated essential fatty acids, including Omega-6 linoleic acid and Omega-3 linolenic acid, to support the skin barrier and coat condition of dogs and cats. It is used as nutritional support in a range of dermatological conditions including pyoderma, mange, fungal disease and Malassezia-associated dermatitis. Additional formulation listings identify supportive nutrients such as zinc, biotin, selenium and selected vitamins. Available in 200 g and 400 g packs; follow the feeding instructions printed on the exact market pack because dosage conventions vary between presentations.',
      ingredients = NULL,
      indications = NULL,
      directions = 'Product listings vary: local information includes 5 g/day for dogs and 10 g/day for pregnant/nursing bitches, while some international labels express dosing in ml/body weight. Therefore, the exact local bottle instruction should be used.',
      packaging = 'Viscous liquid/oil supplement in bottles labeled by net weight, commonly 200 g or 400 g.',
      storage_safety = 'Store in a cool, dry place; a local listing additionally advises cool/dark storage with the container closed.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 g Bottle', 2990.00, 3200.00, 65, true);

  -- Product #22: Nutricoat Syrup
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'nutricoat-syrup' OR name ILIKE 'Nutricoat Syrup' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Nutricoat Syrup',
      'nutricoat-syrup',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Nutricoat is formulated to provide fatty-acid nutrition for pets with dry, dull or scaly coats and is used as supportive nutrition in a variety of skin conditions. Its ingredient profile includes linoleic, linolenic and oleic acids. Hayleys publishes separate feeding amounts for puppies, adult dogs, pregnant or nursing dogs and cats, so the dose should be matched to the animal and local label. The Sri Lankan distributor lists a 200 g pack, while 400 g is also documented internationally.',
      NULL,
      NULL,
      'puppies 2.5 ml twice daily; adult dogs 5 ml twice daily; pregnant/nursing bitches 5-10 ml twice daily; cats 2.5-5 ml twice daily.',
      'Palatable liquid/tonic in a bottle labeled by net weight, usually 200 g',
      'Specific storage on the Hayleys excerpt was unspecified; keep the container appropriately closed and follow the label.',
      '/images/products/nutricoat-syrup.png',
      ARRAY['/images/products/nutricoat-syrup.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Nutricoat Syrup',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Nutricoat is formulated to provide fatty-acid nutrition for pets with dry, dull or scaly coats and is used as supportive nutrition in a variety of skin conditions. Its ingredient profile includes linoleic, linolenic and oleic acids. Hayleys publishes separate feeding amounts for puppies, adult dogs, pregnant or nursing dogs and cats, so the dose should be matched to the animal and local label. The Sri Lankan distributor lists a 200 g pack, while 400 g is also documented internationally.',
      ingredients = NULL,
      indications = NULL,
      directions = 'puppies 2.5 ml twice daily; adult dogs 5 ml twice daily; pregnant/nursing bitches 5-10 ml twice daily; cats 2.5-5 ml twice daily.',
      packaging = 'Palatable liquid/tonic in a bottle labeled by net weight, usually 200 g',
      storage_safety = 'Specific storage on the Hayleys excerpt was unspecified; keep the container appropriately closed and follow the label.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 g Bottle', 2680.00, 2900.00, 70, true);

  -- Product #23: Negasunt Powder
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'negasunt-powder' OR name ILIKE 'Negasunt Powder' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Negasunt Powder',
      'negasunt-powder',
      'Bayer / Elanco',
      cid,
      'Cat/Dog',
      'Negasunt combines coumaphos 30 mg/g, propoxur 20 mg/g and sulfanilamide 50 mg/g in a topical veterinary wound powder. It is intended for maggoticidal and bacteriostatic wound dressing in dogs and various livestock species. Before application, clean the wound thoroughly and dust enough powder to cover both the affected area and its immediate surroundings. The locally listed presentation is a 40 g bottle.',
      NULL,
      'Wound dressing where maggot control and bacteriostatic action are required in dogs and several livestock species.',
      'Clean the wound thoroughly and dust Negasunt over the wound, ensuring that the surrounding area is also covered.',
      '40-g dusting/shaker bottle.',
      'Specific storage conditions were unspecified in the retrieved page. Treat as a veterinary medicated powder and avoid inhalation, ingestion and unnecessary skin contact.',
      '/images/products/negasunt-powder.png',
      ARRAY['/images/products/negasunt-powder.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Negasunt Powder',
      brand = 'Bayer / Elanco',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Negasunt combines coumaphos 30 mg/g, propoxur 20 mg/g and sulfanilamide 50 mg/g in a topical veterinary wound powder. It is intended for maggoticidal and bacteriostatic wound dressing in dogs and various livestock species. Before application, clean the wound thoroughly and dust enough powder to cover both the affected area and its immediate surroundings. The locally listed presentation is a 40 g bottle.',
      ingredients = NULL,
      indications = 'Wound dressing where maggot control and bacteriostatic action are required in dogs and several livestock species.',
      directions = 'Clean the wound thoroughly and dust Negasunt over the wound, ensuring that the surrounding area is also covered.',
      packaging = '40-g dusting/shaker bottle.',
      storage_safety = 'Specific storage conditions were unspecified in the retrieved page. Treat as a veterinary medicated powder and avoid inhalation, ingestion and unnecessary skin contact.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '40 g Container', 1290.00, 1400.00, 80, true);

  -- Product #24: Aluspray AWD
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'aluspray-awd' OR name ILIKE 'Aluspray AWD' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Aluspray AWD',
      'aluspray-awd',
      'Bayer / Elanco',
      cid,
      'Cat/Dog',
      'Aluspray AWD is formulated for topical protection of superficial wounds, abrasions and cuts. Each gram contains neomycin 3,400 units, polymyxin B 5,000 units and bacitracin 400 units. Applying a fine superficial coating once or twice daily, subject to the veterinarian''s directions. The verified local pack size is 125 ml.',
      'Hayleys gives, per gram, neomycin 3,400 units, polymyxin B 5,000 units and bacitracin 400 units, plus excipients.',
      NULL,
      NULL,
      '125-ml spray/aerosol-style container.',
      'Unspecified in the retrieved listing; external veterinary use only.',
      '/images/products/aluspray-awd.png',
      ARRAY['/images/products/aluspray-awd.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Aluspray AWD',
      brand = 'Bayer / Elanco',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Aluspray AWD is formulated for topical protection of superficial wounds, abrasions and cuts. Each gram contains neomycin 3,400 units, polymyxin B 5,000 units and bacitracin 400 units. Applying a fine superficial coating once or twice daily, subject to the veterinarian''s directions. The verified local pack size is 125 ml.',
      ingredients = 'Hayleys gives, per gram, neomycin 3,400 units, polymyxin B 5,000 units and bacitracin 400 units, plus excipients.',
      indications = NULL,
      directions = NULL,
      packaging = '125-ml spray/aerosol-style container.',
      storage_safety = 'Unspecified in the retrieved listing; external veterinary use only.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '125 ml Aerosol', 1980.00, 2200.00, 70, true);

  -- Product #25: Petmend Spray
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'petmend-spray' OR name ILIKE 'Petmend Spray' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Petmend Spray',
      'petmend-spray',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Petmend Spray is designed for topical management of traumatic and surgical wounds, including wounds affected by maggot infestation. The Hayleys formulation information confirms Pinus longifolia at 4 g per 100 ml as one component. The product is supplied in a convenient 150 ml spray presentation. Clean and treat the affected area only according to the current product label or veterinarian''s instructions.',
      'Pinus longifolia 4 g per 100 ml as part of the composition',
      'All types of traumatic and surgical wounds, including maggot/worm-infested wounds.',
      'Exact application frequency was unspecified in the retrieved official evidence; use according to label/veterinary instructions.',
      '150-ml labeled spray container.',
      'Unspecified; external veterinary use only.',
      '/images/products/petmend-spray.png',
      ARRAY['/images/products/petmend-spray.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Petmend Spray',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Petmend Spray is designed for topical management of traumatic and surgical wounds, including wounds affected by maggot infestation. The Hayleys formulation information confirms Pinus longifolia at 4 g per 100 ml as one component. The product is supplied in a convenient 150 ml spray presentation. Clean and treat the affected area only according to the current product label or veterinarian''s instructions.',
      ingredients = 'Pinus longifolia 4 g per 100 ml as part of the composition',
      indications = 'All types of traumatic and surgical wounds, including maggot/worm-infested wounds.',
      directions = 'Exact application frequency was unspecified in the retrieved official evidence; use according to label/veterinary instructions.',
      packaging = '150-ml labeled spray container.',
      storage_safety = 'Unspecified; external veterinary use only.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '150 ml Spray', 980.00, 1100.00, 85, true);

  -- Product #26: Drontal Plus Tasty
  SELECT id INTO cid FROM categories WHERE slug = 'wound-care-deworming' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'drontal-plus-tasty' OR name ILIKE 'Drontal Plus Tasty' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Drontal Plus Tasty',
      'drontal-plus-tasty',
      'Bayer / Elanco',
      cid,
      'Cat/Dog',
      'Drontal Plus Tasty combines praziquantel 50 mg, pyrantel embonate 144 mg and febantel 150 mg in each tablet for broad-spectrum intestinal worm control in dogs. It targets major roundworm and tapeworm groups including hookworms and whipworms. Hayleys lists a dosage of one tablet per 10 kg body weight, given directly or with food, without a fasting requirement. The official local presentation reviewed contains 12 tablets.',
      'Praziquantel 50 mg, pyrantel embonate 144 mg and febantel 150 mg.',
      'Control of common canine ascarids/roundworms, hookworms, whipworms and tapeworms.',
      'One tablet per 10 kg body weight; tablets may be administered directly or in food, and Hayleys states that pre-treatment starvation is unnecessary.',
      NULL,
      'Detailed storage instructions were unspecified in the retrieved local page. Dosing should be based on current body weight and the pack label.',
      '/images/products/drontal-plus-tasty.png',
      ARRAY['/images/products/drontal-plus-tasty.png']::TEXT[],
      true,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Drontal Plus Tasty',
      brand = 'Bayer / Elanco',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Drontal Plus Tasty combines praziquantel 50 mg, pyrantel embonate 144 mg and febantel 150 mg in each tablet for broad-spectrum intestinal worm control in dogs. It targets major roundworm and tapeworm groups including hookworms and whipworms. Hayleys lists a dosage of one tablet per 10 kg body weight, given directly or with food, without a fasting requirement. The official local presentation reviewed contains 12 tablets.',
      ingredients = 'Praziquantel 50 mg, pyrantel embonate 144 mg and febantel 150 mg.',
      indications = 'Control of common canine ascarids/roundworms, hookworms, whipworms and tapeworms.',
      directions = 'One tablet per 10 kg body weight; tablets may be administered directly or in food, and Hayleys states that pre-treatment starvation is unnecessary.',
      packaging = NULL,
      storage_safety = 'Detailed storage instructions were unspecified in the retrieved local page. Dosing should be based on current body weight and the pack label.',
      is_featured = true,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '2''s Pack', 990.00, 1100.00, 100, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '12''s Carton', 5450.00, 5900.00, 40, true);

  -- Product #27: Dermitol Shampoo
  SELECT id INTO cid FROM categories WHERE slug = 'medicated-grooming-shampoos' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'dermitol-shampoo' OR name ILIKE 'Dermitol Shampoo' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Dermitol Shampoo',
      'dermitol-shampoo',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Dermitol is a veterinary dermatological shampoo designed to provide hygienic cleansing while helping moisturize and condition abnormal or seborrheic skin. Hayleys describes the formula as using soft surfactants together with Ichtyol liposome technology. It can be used as supportive topical care for dry or oily scaling conditions under veterinary guidance. The locally listed pack size is 250 ml.',
      NULL,
      NULL,
      'Twice weekly for several weeks, allowing brief skin contact before rinsing; because regimen may vary by market, publish label/veterinary directions rather than a fixed treatment course.',
      '250-ml dermatological shampoo bottle.',
      'Unspecified; external veterinary use only, avoid eyes.',
      '/images/products/dermitol-shampoo.png',
      ARRAY['/images/products/dermitol-shampoo.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Dermitol Shampoo',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Dermitol is a veterinary dermatological shampoo designed to provide hygienic cleansing while helping moisturize and condition abnormal or seborrheic skin. Hayleys describes the formula as using soft surfactants together with Ichtyol liposome technology. It can be used as supportive topical care for dry or oily scaling conditions under veterinary guidance. The locally listed pack size is 250 ml.',
      ingredients = NULL,
      indications = NULL,
      directions = 'Twice weekly for several weeks, allowing brief skin contact before rinsing; because regimen may vary by market, publish label/veterinary directions rather than a fixed treatment course.',
      packaging = '250-ml dermatological shampoo bottle.',
      storage_safety = 'Unspecified; external veterinary use only, avoid eyes.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '250 ml Bottle', 3980.00, 4200.00, 60, true);

  -- Product #28: Furr-Fresh Medicated Shampoo 100 ml
  SELECT id INTO cid FROM categories WHERE slug = 'medicated-grooming-shampoos' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'furr-fresh-medicated-shampoo-100-ml' OR name ILIKE 'Furr-Fresh Medicated Shampoo 100 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Furr-Fresh Medicated Shampoo 100 ml',
      'furr-fresh-medicated-shampoo-100-ml',
      'Furr-Fresh',
      cid,
      'Cat',
      'Furr-Fresh Medicated Shampoo is a veterinary-strength cleansing formula containing ketoconazole and chlorhexidine gluconate. The combination provides antifungal and antibacterial activity and is marketed for pets with yeast, fungal and bacterial skin problems. Apply and leave on only for the contact time specified on the current label or by a veterinarian, then rinse thoroughly.',
      NULL,
      NULL,
      'Exact contact time/frequency unspecified; follow the pack or veterinarian rather than borrowing instructions from another ketoconazole/chlorhexidine brand.',
      '100-ml shampoo bottle.',
      'Unspecified; external use only, avoid eyes, ears and ingestion.',
      '/images/products/furr-fresh-medicated-shampoo-100-ml.png',
      ARRAY['/images/products/furr-fresh-medicated-shampoo-100-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Furr-Fresh Medicated Shampoo 100 ml',
      brand = 'Furr-Fresh',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Furr-Fresh Medicated Shampoo is a veterinary-strength cleansing formula containing ketoconazole and chlorhexidine gluconate. The combination provides antifungal and antibacterial activity and is marketed for pets with yeast, fungal and bacterial skin problems. Apply and leave on only for the contact time specified on the current label or by a veterinarian, then rinse thoroughly.',
      ingredients = NULL,
      indications = NULL,
      directions = 'Exact contact time/frequency unspecified; follow the pack or veterinarian rather than borrowing instructions from another ketoconazole/chlorhexidine brand.',
      packaging = '100-ml shampoo bottle.',
      storage_safety = 'Unspecified; external use only, avoid eyes, ears and ingestion.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 ml Bottle', 1300.00, 1450.00, 75, true);

  -- Product #29: Ticks & Fleas Shampoo 225 ml
  SELECT id INTO cid FROM categories WHERE slug = 'medicated-grooming-shampoos' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'ticks-fleas-shampoo-225-ml' OR name ILIKE 'Ticks & Fleas Shampoo 225 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Ticks & Fleas Shampoo 225 ml',
      'ticks-fleas-shampoo-225-ml',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Dymec Ticks & Fleas Shampoo is formulated for dogs using a shampoo base with citronella, lemongrass, eucalyptus, neem and cinnamon oils. The botanical blend is intended for routine cleansing while supporting flea-and-tick-focused grooming. Wet and shampoo the animal only according to the directions printed on the product pack, taking care around the eyes. The verified presentation is a 225 ml bottle.',
      'citronella oil, lemongrass oil, eucalyptus oil, neem oil and cinnamon oil. Concentrations are unspecified.',
      'Routine shampooing where flea/tick-focused botanical grooming is desired. The clearest current product title says for dogs.',
      NULL,
      '225-ml plastic shampoo bottle.',
      NULL,
      '/images/products/ticks-fleas-shampoo-225-ml.png',
      ARRAY['/images/products/ticks-fleas-shampoo-225-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Ticks & Fleas Shampoo 225 ml',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Dymec Ticks & Fleas Shampoo is formulated for dogs using a shampoo base with citronella, lemongrass, eucalyptus, neem and cinnamon oils. The botanical blend is intended for routine cleansing while supporting flea-and-tick-focused grooming. Wet and shampoo the animal only according to the directions printed on the product pack, taking care around the eyes. The verified presentation is a 225 ml bottle.',
      ingredients = 'citronella oil, lemongrass oil, eucalyptus oil, neem oil and cinnamon oil. Concentrations are unspecified.',
      indications = 'Routine shampooing where flea/tick-focused botanical grooming is desired. The clearest current product title says for dogs.',
      directions = NULL,
      packaging = '225-ml plastic shampoo bottle.',
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '225 ml Bottle', 800.00, 900.00, 80, true);

  -- Product #30: Aloe Vera Shampoo & Conditioner 225 ml
  SELECT id INTO cid FROM categories WHERE slug = 'medicated-grooming-shampoos' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'aloe-vera-shampoo-conditioner-225-ml' OR name ILIKE 'Aloe Vera Shampoo & Conditioner 225 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Aloe Vera Shampoo & Conditioner 225 ml',
      'aloe-vera-shampoo-conditioner-225-ml',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Dymec Aloe Vera Shampoo & Conditioner combines routine cleansing with coat-conditioning ingredients including aloe vera extract and vitamin E. It is marketed for both dogs and cats and is designed to leave the coat clean, conditioned and well groomed. Apply and rinse according to the directions on the physical bottle while avoiding the eyes. The standard pack is 225 ml,',
      NULL,
      NULL,
      NULL,
      '225-ml shampoo bottle',
      NULL,
      '/images/products/aloe-vera-shampoo-conditioner-225-ml.png',
      ARRAY['/images/products/aloe-vera-shampoo-conditioner-225-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Aloe Vera Shampoo & Conditioner 225 ml',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Dymec Aloe Vera Shampoo & Conditioner combines routine cleansing with coat-conditioning ingredients including aloe vera extract and vitamin E. It is marketed for both dogs and cats and is designed to leave the coat clean, conditioned and well groomed. Apply and rinse according to the directions on the physical bottle while avoiding the eyes. The standard pack is 225 ml,',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = '225-ml shampoo bottle',
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '225 ml Bottle', 650.00, 750.00, 90, true);

  -- Product #31: Malaseb Shampoo 200 ml
  SELECT id INTO cid FROM categories WHERE slug = 'medicated-grooming-shampoos' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'malaseb-shampoo-200-ml' OR name ILIKE 'Malaseb Shampoo 200 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Malaseb Shampoo 200 ml',
      'malaseb-shampoo-200-ml',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'SeePet-Malaseb combines miconazole nitrate 2% w/v with chlorhexidine gluconate 2% w/v to provide dual antifungal and antibacterial cleansing. It is marketed for dogs and cats and is used as medicated support in skin conditions involving microbial overgrowth, seborrhea and itching. Use at the contact time and frequency specified on the SeePet label or by your veterinarian. Local retailers list  200 ml.',
      'Miconazole nitrate 2% w/v plus chlorhexidine gluconate 2% w/v.',
      'Antifungal, antibacterial, keratolytic and antipruritic medicated cleansing, including supportive care for seborrheic dermatitis and dermatophilosis-associated skin problems.',
      'Exact contact time and treatment frequency for this SeePet formulation were unspecified in the retrieved evidence; follow the bottle or veterinarian.',
      NULL,
      'Unspecified; external veterinary use only, avoid eyes and ingestion.',
      '/images/products/malaseb-shampoo-200-ml.png',
      ARRAY['/images/products/malaseb-shampoo-200-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Malaseb Shampoo 200 ml',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'SeePet-Malaseb combines miconazole nitrate 2% w/v with chlorhexidine gluconate 2% w/v to provide dual antifungal and antibacterial cleansing. It is marketed for dogs and cats and is used as medicated support in skin conditions involving microbial overgrowth, seborrhea and itching. Use at the contact time and frequency specified on the SeePet label or by your veterinarian. Local retailers list  200 ml.',
      ingredients = 'Miconazole nitrate 2% w/v plus chlorhexidine gluconate 2% w/v.',
      indications = 'Antifungal, antibacterial, keratolytic and antipruritic medicated cleansing, including supportive care for seborrheic dermatitis and dermatophilosis-associated skin problems.',
      directions = 'Exact contact time and treatment frequency for this SeePet formulation were unspecified in the retrieved evidence; follow the bottle or veterinarian.',
      packaging = NULL,
      storage_safety = 'Unspecified; external veterinary use only, avoid eyes and ingestion.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 ml Bottle', 1140.00, 1250.00, 70, true);

  -- Product #32: Petvit Liquid 200 ml
  SELECT id INTO cid FROM categories WHERE slug = 'health-treats-specialized-food' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'petvit-liquid-200-ml' OR name ILIKE 'Petvit Liquid 200 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Petvit Liquid 200 ml',
      'petvit-liquid-200-ml',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Petvit Liquid is an oral multivitamin formulation for companion animals. Each 5 ml provides confirmed nutrients including vitamin A, vitamin D3, vitamin C and vitamins B1, B2 and B6. Hayleys lists the product for general nutritional supplementation and malnutrition, with a published puppy/kitten amount of 1-2 ml daily.',
      NULL,
      NULL,
      'puppies and kittens: 1-2 ml daily. Other species/age doses were unspecified in the retrieved evidence.',
      '200-ml oral vitamin-liquid bottle.',
      NULL,
      '/images/products/petvit-liquid-200-ml.png',
      ARRAY['/images/products/petvit-liquid-200-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Petvit Liquid 200 ml',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Petvit Liquid is an oral multivitamin formulation for companion animals. Each 5 ml provides confirmed nutrients including vitamin A, vitamin D3, vitamin C and vitamins B1, B2 and B6. Hayleys lists the product for general nutritional supplementation and malnutrition, with a published puppy/kitten amount of 1-2 ml daily.',
      ingredients = NULL,
      indications = NULL,
      directions = 'puppies and kittens: 1-2 ml daily. Other species/age doses were unspecified in the retrieved evidence.',
      packaging = '200-ml oral vitamin-liquid bottle.',
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 ml Bottle', 1490.00, 1600.00, 60, true);

  -- Product #33: Vetgrow Meat in Feet 400 g
  SELECT id INTO cid FROM categories WHERE slug = 'health-treats-specialized-food' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'vetgrow-meat-in-feet-400-g' OR name ILIKE 'Vetgrow Meat in Feet 400 g' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Vetgrow Meat in Feet 400 g',
      'vetgrow-meat-in-feet-400-g',
      'Vetgrow',
      cid,
      'Cat/Dog',
      'Vetgrow Meat in Feet is a shaped chew/treat for dogs that encourages chewing and jaw activity while providing a source of calcium and phosphorus. Retail product information also positions the formula around dental cleaning and joint-support ingredients including glucosamine and chondroitin. It is sold in a 12-piece format, while a 400 g listing is also documented locally. Offer as a supplementary treat rather than a complete diet and supervise the dog during chewing.',
      NULL,
      NULL,
      'Approximately 1-2 pieces per day depending on size/activity, but this is not a manufacturer-verified feeding instruction in the retrieved material; therefore the pack should remain the authority.',
      NULL,
      'Retail advice is cool, dry storage and resealing after opening.',
      '/images/products/vetgrow-meat-in-feet-400-g.png',
      ARRAY['/images/products/vetgrow-meat-in-feet-400-g.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Vetgrow Meat in Feet 400 g',
      brand = 'Vetgrow',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Vetgrow Meat in Feet is a shaped chew/treat for dogs that encourages chewing and jaw activity while providing a source of calcium and phosphorus. Retail product information also positions the formula around dental cleaning and joint-support ingredients including glucosamine and chondroitin. It is sold in a 12-piece format, while a 400 g listing is also documented locally. Offer as a supplementary treat rather than a complete diet and supervise the dog during chewing.',
      ingredients = NULL,
      indications = NULL,
      directions = 'Approximately 1-2 pieces per day depending on size/activity, but this is not a manufacturer-verified feeding instruction in the retrieved material; therefore the pack should remain the authority.',
      packaging = NULL,
      storage_safety = 'Retail advice is cool, dry storage and resealing after opening.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '400 g Pack', 350.00, 400.00, 120, true);

  -- Product #34: Vetgrow Kick in Punch 300 ml
  SELECT id INTO cid FROM categories WHERE slug = 'health-treats-specialized-food' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'vetgrow-kick-in-punch-300-ml' OR name ILIKE 'Vetgrow Kick in Punch 300 ml' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Vetgrow Kick in Punch 300 ml',
      'vetgrow-kick-in-punch-300-ml',
      'Vetgrow',
      cid,
      'Cat/Dog',
      'Kick in Punch is a Vetgrow supplementary beverage formulated for both dogs and cats. It is produced from hydrolyzed chicken meat and hydrolyzed whey protein and is suitable for pets across different ages and life stages. Vetgrow''s published daily feeding guidance is one 300 ml tin per 10 kg body weight. Use it as a supplementary nutritional product alongside an appropriately balanced diet.',
      'Hydrolyzed chicken meat and hydrolyzed whey protein. Quantitative nutrient concentrations are unspecified.',
      NULL,
      'Manufacturer-listed daily dose: one tin per 10 kg body weight.',
      '300-ml tin/can.',
      'Specific storage instructions are unspecified on the current product page. It should be presented as a supplementary food/beverage rather than a nutritionally complete diet unless the label says otherwise.',
      '/images/products/vetgrow-kick-in-punch-300-ml.png',
      ARRAY['/images/products/vetgrow-kick-in-punch-300-ml.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Vetgrow Kick in Punch 300 ml',
      brand = 'Vetgrow',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Kick in Punch is a Vetgrow supplementary beverage formulated for both dogs and cats. It is produced from hydrolyzed chicken meat and hydrolyzed whey protein and is suitable for pets across different ages and life stages. Vetgrow''s published daily feeding guidance is one 300 ml tin per 10 kg body weight. Use it as a supplementary nutritional product alongside an appropriately balanced diet.',
      ingredients = 'Hydrolyzed chicken meat and hydrolyzed whey protein. Quantitative nutrient concentrations are unspecified.',
      indications = NULL,
      directions = 'Manufacturer-listed daily dose: one tin per 10 kg body weight.',
      packaging = '300-ml tin/can.',
      storage_safety = 'Specific storage instructions are unspecified on the current product page. It should be presented as a supplementary food/beverage rather than a nutritionally complete diet unless the label says otherwise.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '300 ml Bottle', 450.00, 500.00, 100, true);

  -- Product #35: Vetgrow Meowghurt 200 g
  SELECT id INTO cid FROM categories WHERE slug = 'health-treats-specialized-food' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'vetgrow-meowghurt-200-g' OR name ILIKE 'Vetgrow Meowghurt 200 g' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Vetgrow Meowghurt 200 g',
      'vetgrow-meowghurt-200-g',
      'Vetgrow',
      cid,
      'Cat',
      'Meowghurt is Vetgrow''s milk-free yoghurt-equivalent food designed specifically for cats. Its proteins are hydrolyzed into amino acids and short peptides, lipids into free fatty acids and starch into simpler carbohydrate forms, together with an appropriate fibre component. The formula is enriched with taurine, arachidonic acid and vitamin A to reflect key feline nutritional needs. It is supplied in a 200 g presentation and should be fed according to the product label.',
      NULL,
      NULL,
      'A specific numerical daily dose was not published on the current manufacturer page retrieved.',
      '200-g tin/can.',
      'Unspecified in the manufacturer text reviewed.',
      '/images/products/vetgrow-meowghurt-200-g.png',
      ARRAY['/images/products/vetgrow-meowghurt-200-g.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Vetgrow Meowghurt 200 g',
      brand = 'Vetgrow',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Meowghurt is Vetgrow''s milk-free yoghurt-equivalent food designed specifically for cats. Its proteins are hydrolyzed into amino acids and short peptides, lipids into free fatty acids and starch into simpler carbohydrate forms, together with an appropriate fibre component. The formula is enriched with taurine, arachidonic acid and vitamin A to reflect key feline nutritional needs. It is supplied in a 200 g presentation and should be fed according to the product label.',
      ingredients = NULL,
      indications = NULL,
      directions = 'A specific numerical daily dose was not published on the current manufacturer page retrieved.',
      packaging = '200-g tin/can.',
      storage_safety = 'Unspecified in the manufacturer text reviewed.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 g Tub', 450.00, 500.00, 90, true);

  -- Product #36: Vetgrow Doghurt 200 g
  SELECT id INTO cid FROM categories WHERE slug = 'health-treats-specialized-food' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'vetgrow-doghurt-200-g' OR name ILIKE 'Vetgrow Doghurt 200 g' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Vetgrow Doghurt 200 g',
      'vetgrow-doghurt-200-g',
      'Vetgrow',
      cid,
      'Dog',
      'Doghurt is Vetgrow''s hydrolyzed dog food designed to provide nutritional support when normal digestion or intake is compromised. Protein is supplied as amino acids and short peptides, fats as free fatty acids and carbohydrates as monosaccharides, together with fibre. Vetgrow lists uses ranging from digestive disorders and poor appetite to pregnancy, ageing and post-surgical or illness recovery. The manufacturer recommends one 200 g tin per 10 kg body weight daily, subject to veterinary guidance for animals with clinical disease.',
      NULL,
      'Vetgrow positions Doghurt for nutritional support during digestive disorders including EPI and IBD, pregnancy, senility, post-surgical recovery, growth retardation, anorectic conditions and recovery from systemic illness, among other supportive situations.',
      'Manufacturer-listed daily dose: one tin per 10 kg body weight.',
      '200-g tin/can.',
      'Specific storage conditions unspecified on the current page. Disease-related use should remain under veterinary guidance rather than positioning Doghurt as a replacement for diagnosis or medical treatment.',
      '/images/products/vetgrow-doghurt-200-g.png',
      ARRAY['/images/products/vetgrow-doghurt-200-g.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Vetgrow Doghurt 200 g',
      brand = 'Vetgrow',
      category_id = cid,
      pet_type = 'Dog',
      description = 'Doghurt is Vetgrow''s hydrolyzed dog food designed to provide nutritional support when normal digestion or intake is compromised. Protein is supplied as amino acids and short peptides, fats as free fatty acids and carbohydrates as monosaccharides, together with fibre. Vetgrow lists uses ranging from digestive disorders and poor appetite to pregnancy, ageing and post-surgical or illness recovery. The manufacturer recommends one 200 g tin per 10 kg body weight daily, subject to veterinary guidance for animals with clinical disease.',
      ingredients = NULL,
      indications = 'Vetgrow positions Doghurt for nutritional support during digestive disorders including EPI and IBD, pregnancy, senility, post-surgical recovery, growth retardation, anorectic conditions and recovery from systemic illness, among other supportive situations.',
      directions = 'Manufacturer-listed daily dose: one tin per 10 kg body weight.',
      packaging = '200-g tin/can.',
      storage_safety = 'Specific storage conditions unspecified on the current page. Disease-related use should remain under veterinary guidance rather than positioning Doghurt as a replacement for diagnosis or medical treatment.',
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 g Tub', 450.00, 500.00, 90, true);

  -- Product #37: Classic Pet Puppy – Milk Flavor
  SELECT id INTO cid FROM categories WHERE slug = 'dog-food-puppy-nutrition' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'classic-pet-puppy-milk-flavor' OR name ILIKE 'Classic Pet Puppy – Milk Flavor' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Classic Pet Puppy – Milk Flavor',
      'classic-pet-puppy-milk-flavor',
      'Classic Pet',
      cid,
      'Dog',
      'Classic Pet Puppy – Milk Flavor',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/classic-pet-puppy-milk-flavor.png',
      ARRAY['/images/products/classic-pet-puppy-milk-flavor.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Classic Pet Puppy – Milk Flavor',
      brand = 'Classic Pet',
      category_id = cid,
      pet_type = 'Dog',
      description = 'Classic Pet Puppy – Milk Flavor',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '400 g', 650.00, 720.00, 80, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '500 g', 850.00, 950.00, 60, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '2 Kg', 3150.00, 3400.00, 40, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Kg', 13690.00, 14500.00, 20, true);

  -- Product #38: Classic Pet Adult Dog – Chicken Flavour
  SELECT id INTO cid FROM categories WHERE slug = 'dog-food-puppy-nutrition' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'classic-pet-adult-dog-chicken-flavour' OR name ILIKE 'Classic Pet Adult Dog – Chicken Flavour' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Classic Pet Adult Dog – Chicken Flavour',
      'classic-pet-adult-dog-chicken-flavour',
      'Classic Pet',
      cid,
      'Dog',
      'Classic Pet Adult Dog – Chicken Flavour',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/classic-pet-adult-dog-chicken-flavour.png',
      ARRAY['/images/products/classic-pet-adult-dog-chicken-flavour.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Classic Pet Adult Dog – Chicken Flavour',
      brand = 'Classic Pet',
      category_id = cid,
      pet_type = 'Dog',
      description = 'Classic Pet Adult Dog – Chicken Flavour',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '400 g', 560.00, 620.00, 80, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '2 Kg', 2800.00, 3050.00, 50, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '3.5 Kg', 4650.00, 4950.00, 35, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Kg', 12050.00, 12800.00, 25, true);

  -- Product #39: Classic Pet Adult Dog – Beef Flavour
  SELECT id INTO cid FROM categories WHERE slug = 'dog-food-puppy-nutrition' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'classic-pet-adult-dog-beef-flavour' OR name ILIKE 'Classic Pet Adult Dog – Beef Flavour' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Classic Pet Adult Dog – Beef Flavour',
      'classic-pet-adult-dog-beef-flavour',
      'Classic Pet',
      cid,
      'Dog',
      'Classic Pet Adult Dog – Beef Flavour',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/classic-pet-adult-dog-beef-flavour.png',
      ARRAY['/images/products/classic-pet-adult-dog-beef-flavour.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Classic Pet Adult Dog – Beef Flavour',
      brand = 'Classic Pet',
      category_id = cid,
      pet_type = 'Dog',
      description = 'Classic Pet Adult Dog – Beef Flavour',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '2 Kg', 2800.00, 3050.00, 50, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '3.5 Kg', 4650.00, 4950.00, 35, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Kg', 12050.00, 12800.00, 25, true);

  -- Product #40: SmartHeart Puppy – Chicken, Egg & Milk
  SELECT id INTO cid FROM categories WHERE slug = 'dog-food-puppy-nutrition' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'smartheart-puppy-chicken-egg-milk' OR name ILIKE 'SmartHeart Puppy – Chicken, Egg & Milk' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'SmartHeart Puppy – Chicken, Egg & Milk',
      'smartheart-puppy-chicken-egg-milk',
      'SmartHeart',
      cid,
      'Dog',
      'SmartHeart Puppy – Chicken, Egg & Milk',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/smartheart-puppy-chicken-egg-milk.png',
      ARRAY['/images/products/smartheart-puppy-chicken-egg-milk.png']::TEXT[],
      true,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'SmartHeart Puppy – Chicken, Egg & Milk',
      brand = 'SmartHeart',
      category_id = cid,
      pet_type = 'Dog',
      description = 'SmartHeart Puppy – Chicken, Egg & Milk',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = true,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '500 g', 930.00, 1020.00, 60, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.3 Kg', 2550.00, 2750.00, 40, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '2.7 Kg', 4460.00, 4800.00, 30, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '8 Kg', 12800.00, 13600.00, 15, true);

  -- Product #41: SmartHeart Adult Dog – Chicken & Egg
  SELECT id INTO cid FROM categories WHERE slug = 'dog-food-puppy-nutrition' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'smartheart-adult-dog-chicken-egg' OR name ILIKE 'SmartHeart Adult Dog – Chicken & Egg' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'SmartHeart Adult Dog – Chicken & Egg',
      'smartheart-adult-dog-chicken-egg',
      'SmartHeart',
      cid,
      'Dog',
      'SmartHeart Adult Dog – Chicken & Egg',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/smartheart-adult-dog-chicken-egg.png',
      ARRAY['/images/products/smartheart-adult-dog-chicken-egg.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'SmartHeart Adult Dog – Chicken & Egg',
      brand = 'SmartHeart',
      category_id = cid,
      pet_type = 'Dog',
      description = 'SmartHeart Adult Dog – Chicken & Egg',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '500 g', 930.00, 1020.00, 60, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.5 Kg', 2550.00, 2750.00, 45, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '3 Kg', 4460.00, 4800.00, 35, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Kg', 12800.00, 13600.00, 20, true);

  -- Product #42: SmartHeart Adult Dog – Chicken & Liver
  SELECT id INTO cid FROM categories WHERE slug = 'dog-food-puppy-nutrition' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'smartheart-adult-dog-chicken-liver' OR name ILIKE 'SmartHeart Adult Dog – Chicken & Liver' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'SmartHeart Adult Dog – Chicken & Liver',
      'smartheart-adult-dog-chicken-liver',
      'SmartHeart',
      cid,
      'Dog',
      'SmartHeart Adult Dog – Chicken & Liver',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/smartheart-adult-dog-chicken-liver.png',
      ARRAY['/images/products/smartheart-adult-dog-chicken-liver.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'SmartHeart Adult Dog – Chicken & Liver',
      brand = 'SmartHeart',
      category_id = cid,
      pet_type = 'Dog',
      description = 'SmartHeart Adult Dog – Chicken & Liver',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '500 g', 930.00, 1020.00, 60, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.5 Kg', 2550.00, 2750.00, 45, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '3 Kg', 4460.00, 4800.00, 35, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Kg', 12800.00, 13600.00, 20, true);

  -- Product #43: SmartHeart Power Pack – Puppy
  SELECT id INTO cid FROM categories WHERE slug = 'dog-food-puppy-nutrition' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'smartheart-power-pack-puppy' OR name ILIKE 'SmartHeart Power Pack – Puppy' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'SmartHeart Power Pack – Puppy',
      'smartheart-power-pack-puppy',
      'SmartHeart',
      cid,
      'Dog',
      'SmartHeart Power Pack – Puppy',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/smartheart-power-pack-puppy.png',
      ARRAY['/images/products/smartheart-power-pack-puppy.png']::TEXT[],
      true,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'SmartHeart Power Pack – Puppy',
      brand = 'SmartHeart',
      category_id = cid,
      pet_type = 'Dog',
      description = 'SmartHeart Power Pack – Puppy',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = true,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1 Kg', 2140.00, 2300.00, 50, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '3 Kg', 5670.00, 6100.00, 35, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Kg', 17690.00, 18800.00, 20, true);

  -- Product #44: SmartHeart Power Pack – Adult
  SELECT id INTO cid FROM categories WHERE slug = 'dog-food-puppy-nutrition' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'smartheart-power-pack-adult' OR name ILIKE 'SmartHeart Power Pack – Adult' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'SmartHeart Power Pack – Adult',
      'smartheart-power-pack-adult',
      'SmartHeart',
      cid,
      'Dog',
      'SmartHeart Power Pack – Adult',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/smartheart-power-pack-adult.png',
      ARRAY['/images/products/smartheart-power-pack-adult.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'SmartHeart Power Pack – Adult',
      brand = 'SmartHeart',
      category_id = cid,
      pet_type = 'Dog',
      description = 'SmartHeart Power Pack – Adult',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1 Kg', 2050.00, 2250.00, 55, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '3 Kg', 5310.00, 5750.00, 40, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Kg', 16490.00, 17500.00, 20, true);

  -- Product #45: SmartHeart Mother & Baby Dog
  SELECT id INTO cid FROM categories WHERE slug = 'dog-food-puppy-nutrition' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'smartheart-mother-baby-dog' OR name ILIKE 'SmartHeart Mother & Baby Dog' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'SmartHeart Mother & Baby Dog',
      'smartheart-mother-baby-dog',
      'SmartHeart',
      cid,
      'Dog',
      'SmartHeart Mother & Baby Dog',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/smartheart-mother-baby-dog.png',
      ARRAY['/images/products/smartheart-mother-baby-dog.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'SmartHeart Mother & Baby Dog',
      brand = 'SmartHeart',
      category_id = cid,
      pet_type = 'Dog',
      description = 'SmartHeart Mother & Baby Dog',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.3 Kg', 2720.00, 2950.00, 45, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '2.6 Kg', 5200.00, 5600.00, 30, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '8 Kg', 13500.00, 14200.00, 15, true);

  -- Product #46: Me-O Kitten – Ocean Fish
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-kitten-ocean-fish' OR name ILIKE 'Me-O Kitten – Ocean Fish' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Kitten – Ocean Fish',
      'me-o-kitten-ocean-fish',
      'Me-O',
      cid,
      'Cat',
      'Me-O Kitten – Ocean Fish',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-kitten-ocean-fish.png',
      ARRAY['/images/products/me-o-kitten-ocean-fish.png']::TEXT[],
      true,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Kitten – Ocean Fish',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Kitten – Ocean Fish',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = true,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '400 g', 1450.00, 1600.00, 70, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.1 Kg', 3250.00, 3500.00, 40, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '7 Kg', 14950.00, 15800.00, 15, true);

  -- Product #47: Me-O Creamy Treats – Bonito Flavor
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-creamy-treats-bonito-flavor' OR name ILIKE 'Me-O Creamy Treats – Bonito Flavor' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Creamy Treats – Bonito Flavor',
      'me-o-creamy-treats-bonito-flavor',
      'Me-O',
      cid,
      'Cat',
      'Me-O Creamy Treats – Bonito Flavor',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-creamy-treats-bonito-flavor.png',
      ARRAY['/images/products/me-o-creamy-treats-bonito-flavor.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Creamy Treats – Bonito Flavor',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Creamy Treats – Bonito Flavor',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '4 x 15 g Pack', 630.00, 700.00, 120, true);

  -- Product #48: Me-O Creamy Treats – Chicken & Liver Flavor
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-creamy-treats-chicken-liver-flavor' OR name ILIKE 'Me-O Creamy Treats – Chicken & Liver Flavor' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Creamy Treats – Chicken & Liver Flavor',
      'me-o-creamy-treats-chicken-liver-flavor',
      'Me-O',
      cid,
      'Cat',
      'Me-O Creamy Treats – Chicken & Liver Flavor',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-creamy-treats-chicken-liver-flavor.png',
      ARRAY['/images/products/me-o-creamy-treats-chicken-liver-flavor.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Creamy Treats – Chicken & Liver Flavor',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Creamy Treats – Chicken & Liver Flavor',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '4 x 15 g Pack', 630.00, 700.00, 120, true);

  -- Product #49: Me-O Creamy Treats – Crab Flavor
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-creamy-treats-crab-flavor' OR name ILIKE 'Me-O Creamy Treats – Crab Flavor' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Creamy Treats – Crab Flavor',
      'me-o-creamy-treats-crab-flavor',
      'Me-O',
      cid,
      'Cat',
      'Me-O Creamy Treats – Crab Flavor',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-creamy-treats-crab-flavor.png',
      ARRAY['/images/products/me-o-creamy-treats-crab-flavor.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Creamy Treats – Crab Flavor',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Creamy Treats – Crab Flavor',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '4 x 15 g Pack', 630.00, 700.00, 120, true);

  -- Product #50: Me-O Creamy Treats – Salmon Flavor
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-creamy-treats-salmon-flavor' OR name ILIKE 'Me-O Creamy Treats – Salmon Flavor' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Creamy Treats – Salmon Flavor',
      'me-o-creamy-treats-salmon-flavor',
      'Me-O',
      cid,
      'Cat',
      'Me-O Creamy Treats – Salmon Flavor',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-creamy-treats-salmon-flavor.png',
      ARRAY['/images/products/me-o-creamy-treats-salmon-flavor.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Creamy Treats – Salmon Flavor',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Creamy Treats – Salmon Flavor',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '4 x 15 g Pack', 630.00, 700.00, 120, true);

  -- Product #51: Me-O Pouch – Tuna in Jelly
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-pouch-tuna-in-jelly' OR name ILIKE 'Me-O Pouch – Tuna in Jelly' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Pouch – Tuna in Jelly',
      'me-o-pouch-tuna-in-jelly',
      'Me-O',
      cid,
      'Cat',
      'Me-O Pouch – Tuna in Jelly',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-pouch-tuna-in-jelly.png',
      ARRAY['/images/products/me-o-pouch-tuna-in-jelly.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Pouch – Tuna in Jelly',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Pouch – Tuna in Jelly',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '80 g Pouch', 390.00, 440.00, 150, true);

  -- Product #52: Me-O Pouch – Ocean Fish in Jelly
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-pouch-ocean-fish-in-jelly' OR name ILIKE 'Me-O Pouch – Ocean Fish in Jelly' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Pouch – Ocean Fish in Jelly',
      'me-o-pouch-ocean-fish-in-jelly',
      'Me-O',
      cid,
      'Cat',
      'Me-O Pouch – Ocean Fish in Jelly',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-pouch-ocean-fish-in-jelly.png',
      ARRAY['/images/products/me-o-pouch-ocean-fish-in-jelly.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Pouch – Ocean Fish in Jelly',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Pouch – Ocean Fish in Jelly',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '80 g Pouch', 390.00, 440.00, 150, true);

  -- Product #53: Me-O Pouch – Tuna with Sardine in Jelly (Kitten)
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-pouch-tuna-with-sardine-in-jelly-kitten' OR name ILIKE 'Me-O Pouch – Tuna with Sardine in Jelly (Kitten)' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Pouch – Tuna with Sardine in Jelly (Kitten)',
      'me-o-pouch-tuna-with-sardine-in-jelly-kitten',
      'Me-O',
      cid,
      'Cat',
      'Me-O Pouch – Tuna with Sardine in Jelly (Kitten)',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-pouch-tuna-with-sardine-in-jelly-kitten.png',
      ARRAY['/images/products/me-o-pouch-tuna-with-sardine-in-jelly-kitten.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Pouch – Tuna with Sardine in Jelly (Kitten)',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Pouch – Tuna with Sardine in Jelly (Kitten)',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '400 g', 1450.00, 1600.00, 70, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.1 Kg', 3250.00, 3500.00, 40, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '7 Kg', 14950.00, 15800.00, 15, true);

  -- Product #54: Me-O Pouch – Tuna Topping with White Fish
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-pouch-tuna-topping-with-white-fish' OR name ILIKE 'Me-O Pouch – Tuna Topping with White Fish' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Pouch – Tuna Topping with White Fish',
      'me-o-pouch-tuna-topping-with-white-fish',
      'Me-O',
      cid,
      'Cat',
      'Me-O Pouch – Tuna Topping with White Fish',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-pouch-tuna-topping-with-white-fish.png',
      ARRAY['/images/products/me-o-pouch-tuna-topping-with-white-fish.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Pouch – Tuna Topping with White Fish',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Pouch – Tuna Topping with White Fish',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '80 g Pouch', 390.00, 440.00, 150, true);

  -- Product #55: Catron Bentonite Cat Litter – Grey Control
  SELECT id INTO cid FROM categories WHERE slug = 'cat-litter-hygiene' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-grey-control' OR name ILIKE 'Catron Bentonite Cat Litter – Grey Control' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Catron Bentonite Cat Litter – Grey Control',
      'catron-bentonite-cat-litter-grey-control',
      'Catron',
      cid,
      'Cat',
      'Catron Bentonite Cat Litter – Grey Control',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/catron-bentonite-cat-litter-grey-control.png',
      ARRAY['/images/products/catron-bentonite-cat-litter-grey-control.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Catron Bentonite Cat Litter – Grey Control',
      brand = 'Catron',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Catron Bentonite Cat Litter – Grey Control',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Litre Bag', 4500.00, 4800.00, 60, true);

  -- Product #56: Catron Bentonite Cat Litter – Lavender
  SELECT id INTO cid FROM categories WHERE slug = 'cat-litter-hygiene' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-lavender' OR name ILIKE 'Catron Bentonite Cat Litter – Lavender' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Catron Bentonite Cat Litter – Lavender',
      'catron-bentonite-cat-litter-lavender',
      'Catron',
      cid,
      'Cat',
      'Catron Bentonite Cat Litter – Lavender',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/catron-bentonite-cat-litter-lavender.png',
      ARRAY['/images/products/catron-bentonite-cat-litter-lavender.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Catron Bentonite Cat Litter – Lavender',
      brand = 'Catron',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Catron Bentonite Cat Litter – Lavender',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);

  -- Product #57: Limoxin-25 Spray
  SELECT id INTO cid FROM categories WHERE slug = 'clinical-antibiotics-sprays' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'limoxin-25-spray' OR name ILIKE 'Limoxin-25 Spray' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Limoxin-25 Spray',
      'limoxin-25-spray',
      'PetSolutions Pharmacy',
      cid,
      'Cat/Dog',
      'Limoxin-25 Spray',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/limoxin-25-spray.png',
      ARRAY['/images/products/limoxin-25-spray.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Limoxin-25 Spray',
      brand = 'PetSolutions Pharmacy',
      category_id = cid,
      pet_type = 'Cat/Dog',
      description = 'Limoxin-25 Spray',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '200 ml Spray', 1650.00, 1800.00, 50, true);

  -- Product #58: Me-O Adult Cat Dry Food - Tuna Flavour
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-adult-cat-dry-food-tuna-flavour' OR name ILIKE 'Me-O Adult Cat Dry Food - Tuna Flavour' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Adult Cat Dry Food - Tuna Flavour',
      'me-o-adult-cat-dry-food-tuna-flavour',
      'Me-O',
      cid,
      'Cat',
      'Me-O Adult Cat Dry Food - Tuna Flavour',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-adult-cat-dry-food-tuna-flavour.png',
      ARRAY['/images/products/me-o-adult-cat-dry-food-tuna-flavour.png']::TEXT[],
      true,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Adult Cat Dry Food - Tuna Flavour',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Adult Cat Dry Food - Tuna Flavour',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = true,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '450 g', 1450.00, 1600.00, 80, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.2 Kg', 3250.00, 3500.00, 50, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '3 Kg', 6490.00, 6950.00, 30, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '7 Kg', 13250.00, 14100.00, 20, true);

  -- Product #59: Me-O Adult Cat Dry Food - Seafood Flavour
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-adult-cat-dry-food-seafood-flavour' OR name ILIKE 'Me-O Adult Cat Dry Food - Seafood Flavour' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Adult Cat Dry Food - Seafood Flavour',
      'me-o-adult-cat-dry-food-seafood-flavour',
      'Me-O',
      cid,
      'Cat',
      'Me-O Adult Cat Dry Food - Seafood Flavour',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-adult-cat-dry-food-seafood-flavour.png',
      ARRAY['/images/products/me-o-adult-cat-dry-food-seafood-flavour.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Adult Cat Dry Food - Seafood Flavour',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Adult Cat Dry Food - Seafood Flavour',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '450 g', 1450.00, 1600.00, 80, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.2 Kg', 3250.00, 3500.00, 50, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '3 Kg', 6490.00, 6950.00, 30, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '7 Kg', 13250.00, 14100.00, 20, true);

  -- Product #60: Me-O Adult Cat Dry Food - Mackerel Flavour
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-adult-cat-dry-food-mackerel-flavour' OR name ILIKE 'Me-O Adult Cat Dry Food - Mackerel Flavour' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Adult Cat Dry Food - Mackerel Flavour',
      'me-o-adult-cat-dry-food-mackerel-flavour',
      'Me-O',
      cid,
      'Cat',
      'Me-O Adult Cat Dry Food - Mackerel Flavour',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-adult-cat-dry-food-mackerel-flavour.png',
      ARRAY['/images/products/me-o-adult-cat-dry-food-mackerel-flavour.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Adult Cat Dry Food - Mackerel Flavour',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Adult Cat Dry Food - Mackerel Flavour',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '450 g', 1450.00, 1600.00, 80, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.2 Kg', 3250.00, 3500.00, 50, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '3 Kg', 6490.00, 6950.00, 30, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '7 Kg', 13250.00, 14100.00, 20, true);

  -- Product #61: Me-O Adult Cat Dry Food - Chicken & Vegetables
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-adult-cat-dry-food-chicken-vegetables' OR name ILIKE 'Me-O Adult Cat Dry Food - Chicken & Vegetables' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Adult Cat Dry Food - Chicken & Vegetables',
      'me-o-adult-cat-dry-food-chicken-vegetables',
      'Me-O',
      cid,
      'Cat',
      'Me-O Adult Cat Dry Food - Chicken & Vegetables',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-adult-cat-dry-food-chicken-vegetables.png',
      ARRAY['/images/products/me-o-adult-cat-dry-food-chicken-vegetables.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Adult Cat Dry Food - Chicken & Vegetables',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Adult Cat Dry Food - Chicken & Vegetables',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '450 g', 1450.00, 1600.00, 80, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.2 Kg', 3250.00, 3500.00, 50, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '3 Kg', 6490.00, 6950.00, 30, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '7 Kg', 13250.00, 14100.00, 20, true);

  -- Product #62: Me-O Persian Cat Food - Anti-Hairball Formula
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-persian-cat-food-anti-hairball-formula' OR name ILIKE 'Me-O Persian Cat Food - Anti-Hairball Formula' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Persian Cat Food - Anti-Hairball Formula',
      'me-o-persian-cat-food-anti-hairball-formula',
      'Me-O',
      cid,
      'Cat',
      'Me-O Persian Cat Food - Anti-Hairball Formula',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-persian-cat-food-anti-hairball-formula.png',
      ARRAY['/images/products/me-o-persian-cat-food-anti-hairball-formula.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Persian Cat Food - Anti-Hairball Formula',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Persian Cat Food - Anti-Hairball Formula',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '400 g', 1450.00, 1600.00, 75, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.1 Kg', 3250.00, 3500.00, 45, true);

  -- Product #63: Catron Bentonite Cat Litter - Baby Powder
  SELECT id INTO cid FROM categories WHERE slug = 'cat-litter-hygiene' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-baby-powder' OR name ILIKE 'Catron Bentonite Cat Litter - Baby Powder' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Catron Bentonite Cat Litter - Baby Powder',
      'catron-bentonite-cat-litter-baby-powder',
      'Catron',
      cid,
      'Cat',
      'Catron Bentonite Cat Litter - Baby Powder',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/catron-bentonite-cat-litter-baby-powder.png',
      ARRAY['/images/products/catron-bentonite-cat-litter-baby-powder.png']::TEXT[],
      true,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Catron Bentonite Cat Litter - Baby Powder',
      brand = 'Catron',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Catron Bentonite Cat Litter - Baby Powder',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = true,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);

  -- Product #64: Catron Bentonite Cat Litter - Marseille Soap
  SELECT id INTO cid FROM categories WHERE slug = 'cat-litter-hygiene' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-marseille-soap' OR name ILIKE 'Catron Bentonite Cat Litter - Marseille Soap' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Catron Bentonite Cat Litter - Marseille Soap',
      'catron-bentonite-cat-litter-marseille-soap',
      'Catron',
      cid,
      'Cat',
      'Catron Bentonite Cat Litter - Marseille Soap',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/catron-bentonite-cat-litter-marseille-soap.png',
      ARRAY['/images/products/catron-bentonite-cat-litter-marseille-soap.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Catron Bentonite Cat Litter - Marseille Soap',
      brand = 'Catron',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Catron Bentonite Cat Litter - Marseille Soap',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);

  -- Product #65: Catron Bentonite Cat Litter - Green Apple
  SELECT id INTO cid FROM categories WHERE slug = 'cat-litter-hygiene' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-green-apple' OR name ILIKE 'Catron Bentonite Cat Litter - Green Apple' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Catron Bentonite Cat Litter - Green Apple',
      'catron-bentonite-cat-litter-green-apple',
      'Catron',
      cid,
      'Cat',
      'Catron Bentonite Cat Litter - Green Apple',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/catron-bentonite-cat-litter-green-apple.png',
      ARRAY['/images/products/catron-bentonite-cat-litter-green-apple.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Catron Bentonite Cat Litter - Green Apple',
      brand = 'Catron',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Catron Bentonite Cat Litter - Green Apple',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);

  -- Product #66: Catron Bentonite Cat Litter - Coconut & Vanilla
  SELECT id INTO cid FROM categories WHERE slug = 'cat-litter-hygiene' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-coconut-vanilla' OR name ILIKE 'Catron Bentonite Cat Litter - Coconut & Vanilla' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Catron Bentonite Cat Litter - Coconut & Vanilla',
      'catron-bentonite-cat-litter-coconut-vanilla',
      'Catron',
      cid,
      'Cat',
      'Catron Bentonite Cat Litter - Coconut & Vanilla',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/catron-bentonite-cat-litter-coconut-vanilla.png',
      ARRAY['/images/products/catron-bentonite-cat-litter-coconut-vanilla.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Catron Bentonite Cat Litter - Coconut & Vanilla',
      brand = 'Catron',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Catron Bentonite Cat Litter - Coconut & Vanilla',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);

  -- Product #67: Catron Bentonite Cat Litter - Cappuccino
  SELECT id INTO cid FROM categories WHERE slug = 'cat-litter-hygiene' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-cappuccino' OR name ILIKE 'Catron Bentonite Cat Litter - Cappuccino' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Catron Bentonite Cat Litter - Cappuccino',
      'catron-bentonite-cat-litter-cappuccino',
      'Catron',
      cid,
      'Cat',
      'Catron Bentonite Cat Litter - Cappuccino',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/catron-bentonite-cat-litter-cappuccino.png',
      ARRAY['/images/products/catron-bentonite-cat-litter-cappuccino.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Catron Bentonite Cat Litter - Cappuccino',
      brand = 'Catron',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Catron Bentonite Cat Litter - Cappuccino',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);

  -- Product #68: Me-O Persian Kitten
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-persian-kitten' OR name ILIKE 'Me-O Persian Kitten' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Persian Kitten',
      'me-o-persian-kitten',
      'Me-O',
      cid,
      'Cat',
      'Me-O Persian Kitten',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-persian-kitten.png',
      ARRAY['/images/products/me-o-persian-kitten.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Persian Kitten',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Persian Kitten',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '400 g', 1490.00, 1650.00, 65, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.1 Kg', 3300.00, 3550.00, 40, true);

  -- Product #69: Me-O Mother and Baby Cat
  SELECT id INTO cid FROM categories WHERE slug = 'cat-food-creamy-treats' LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = 'me-o-mother-and-baby-cat' OR name ILIKE 'Me-O Mother and Baby Cat' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      'Me-O Mother and Baby Cat',
      'me-o-mother-and-baby-cat',
      'Me-O',
      cid,
      'Cat',
      'Me-O Mother and Baby Cat',
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      '/images/products/me-o-mother-and-baby-cat.png',
      ARRAY['/images/products/me-o-mother-and-baby-cat.png']::TEXT[],
      false,
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = 'Me-O Mother and Baby Cat',
      brand = 'Me-O',
      category_id = cid,
      pet_type = 'Cat',
      description = 'Me-O Mother and Baby Cat',
      ingredients = NULL,
      indications = NULL,
      directions = NULL,
      packaging = NULL,
      storage_safety = NULL,
      is_featured = false,
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '400 g', 1550.00, 1700.00, 60, true);
  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, '1.1 Kg', 3400.00, 3700.00, 35, true);

END $$;

-- 7. Verification Query
SELECT count(*) AS total_products FROM products;
SELECT count(*) AS total_variants FROM product_variants;
