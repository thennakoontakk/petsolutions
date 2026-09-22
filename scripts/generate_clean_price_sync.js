const fs = require('fs');
const path = require('path');
const catalog = require('../full_catalog_with_prices.json');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = `-- =====================================================================
-- PetSolutions.lk: Sync 118 Real Priced Variants & Clinical Data
-- Matched from Word Document (01-04) and E-Com Product List.xlsx
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jnakxlejkmyptoffvhsa/sql
-- =====================================================================

DO $$
DECLARE
  pid UUID;
BEGIN
`;

catalog.forEach((item, idx) => {
  sql += `
  -- [Product #${idx + 1}]: ${item.name}
  SELECT id INTO pid FROM products WHERE slug = ${escapeSql(item.slug)} OR name ILIKE ${escapeSql(item.name)} LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, ${escapeSql(item.brand)}),
      ingredients = COALESCE(ingredients, ${escapeSql(item.ingredients)}),
      directions = COALESCE(directions, ${escapeSql(item.directions)}),
      packaging = COALESCE(packaging, ${escapeSql(item.packaging)}),
      storage_safety = COALESCE(storage_safety, ${escapeSql(item.storage_safety)})
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
`;

  item.variants.forEach(v => {
    sql += `    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, ${escapeSql(v.size_label)}, ${Number(v.price).toFixed(2)}, ${v.compare_at_price ? Number(v.compare_at_price).toFixed(2) : 'NULL'}, ${v.stock || 50}, true);
`;
  });

  sql += `  END IF;
`;
});

sql += `
END $$;

-- Verification query
SELECT 
  p.name, 
  COUNT(v.id) AS variant_count, 
  MIN(v.price) AS min_price, 
  MAX(v.price) AS max_price,
  SUM(v.stock) AS total_stock
FROM products p
LEFT JOIN product_variants v ON v.product_id = p.id
GROUP BY p.id, p.name
ORDER BY p.name ASC;
`;

const outPath = path.join(__dirname, '..', 'supabase', 'sync_prices_and_variants.sql');
fs.writeFileSync(outPath, sql, 'utf-8');
console.log('Successfully generated ' + outPath + ' (' + (sql.length / 1024).toFixed(1) + ' KB)');
