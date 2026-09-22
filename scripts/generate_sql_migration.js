const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'full_catalog_with_prices.json'), 'utf-8'));

function escapeSql(str) {
  if (!str) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = `-- ==========================================================================
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
`;

const categories = [
  { name: 'Anti-Tick & Parasite Care', slug: 'anti-tick-parasite-care', pet: 'Cat/Dog', order: 1 },
  { name: 'Veterinary Supplements & Tonics', slug: 'veterinary-supplements-tonics', pet: 'Cat/Dog', order: 2 },
  { name: 'Wound Healing & Topical Pharmacy', slug: 'wound-healing-topical-pharmacy', pet: 'Cat/Dog', order: 3 },
  { name: 'Medicated Coat Care & Shampoos', slug: 'medicated-coat-care-shampoos', pet: 'Cat/Dog', order: 4 },
  { name: 'Clinical Dry & Wet Diets', slug: 'clinical-dry-wet-diets', pet: 'Cat/Dog', order: 5 },
  { name: 'Cat Litter & Clinical Hygiene', slug: 'cat-litter-clinical-hygiene', pet: 'Cat', order: 6 }
];

categories.forEach(c => {
  sql += `INSERT INTO categories (name, slug, parent_category, display_order) VALUES (${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.pet)}, ${c.order}) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;\n`;
});

sql += `\n-- 6. Insert/Update the 69 Products and 118 Variants\nDO $$\nDECLARE\n  pid UUID;\n  cid UUID;\nBEGIN\n`;

catalog.forEach((item, idx) => {
  sql += `
  -- Product #${idx + 1}: ${item.name}
  SELECT id INTO cid FROM categories WHERE slug = ${escapeSql(item.category.slug)} LIMIT 1;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM categories LIMIT 1;
  END IF;

  SELECT id INTO pid FROM products WHERE slug = ${escapeSql(item.slug)} OR name ILIKE ${escapeSql(item.name)} LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, brand, category_id, pet_type, description,
      ingredients, indications, directions, packaging, storage_safety,
      image_url, images, is_featured, is_active
    ) VALUES (
      ${escapeSql(item.name)},
      ${escapeSql(item.slug)},
      ${escapeSql(item.brand)},
      cid,
      ${escapeSql(item.pet_type)},
      ${escapeSql(item.description)},
      ${escapeSql(item.ingredients)},
      ${escapeSql(item.indications)},
      ${escapeSql(item.directions)},
      ${escapeSql(item.packaging)},
      ${escapeSql(item.storage_safety)},
      ${escapeSql('/images/products/' + item.slug + '.png')},
      ARRAY[${escapeSql('/images/products/' + item.slug + '.png')}]::TEXT[],
      ${item.is_featured ? 'true' : 'false'},
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      name = ${escapeSql(item.name)},
      brand = ${escapeSql(item.brand)},
      category_id = cid,
      pet_type = ${escapeSql(item.pet_type)},
      description = ${escapeSql(item.description)},
      ingredients = ${escapeSql(item.ingredients)},
      indications = ${escapeSql(item.indications)},
      directions = ${escapeSql(item.directions)},
      packaging = ${escapeSql(item.packaging)},
      storage_safety = ${escapeSql(item.storage_safety)},
      is_featured = ${item.is_featured ? 'true' : 'false'},
      is_active = true,
      updated_at = now()
    WHERE id = pid;

    DELETE FROM product_variants WHERE product_id = pid;
  END IF;

`;

  item.variants.forEach(v => {
    sql += `  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
  VALUES (pid, ${escapeSql(v.size_label)}, ${Number(v.price).toFixed(2)}, ${v.compare_at_price ? Number(v.compare_at_price).toFixed(2) : 'NULL'}, ${v.stock}, true);\n`;
  });
});

sql += `
END $$;

-- 7. Verification Query
SELECT count(*) AS total_products FROM products;
SELECT count(*) AS total_variants FROM product_variants;
`;

const outPath = path.join(__dirname, '..', 'supabase', 'migrate_real_catalog_and_rbac.sql');
fs.writeFileSync(outPath, sql, 'utf-8');
console.log('Successfully written to ' + outPath + ' (' + (sql.length / 1024).toFixed(1) + ' KB)');
