const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
let url = '', key = '';
for (const l of lines) {
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = l.split('=')[1].trim();
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=')) key = l.split('=')[1].trim();
}

const supabase = createClient(url, key);

async function run() {
  console.log('--- Starting Catalog Clean-Up & Real Price Migration ---');

  // 1. Load full catalog data
  const catalog = JSON.parse(fs.readFileSync('full_catalog_with_prices.json', 'utf-8'));
  console.log(`Loaded ${catalog.length} products to sync.`);

  // 2. Delete test dummy products like "saalayo"
  const { data: dummies } = await supabase.from('products').select('id, name').ilike('name', '%saalayo%');
  if (dummies && dummies.length) {
    for (const d of dummies) {
      await supabase.from('product_variants').delete().eq('product_id', d.id);
      await supabase.from('products').delete().eq('id', d.id);
      console.log(`Deleted dummy product: ${d.name} (${d.id})`);
    }
  }

  // 3. Ensure categories exist
  const { data: existingCats } = await supabase.from('categories').select('*');
  const catMap = new Map();
  if (existingCats) {
    existingCats.forEach(c => catMap.set(c.slug, c.id));
  }

  for (const p of catalog) {
    const cat = p.category;
    if (!catMap.has(cat.slug)) {
      const { data: newCat, error: catErr } = await supabase.from('categories').insert({
        name: cat.name,
        slug: cat.slug,
        parent_category: p.pet_type,
        display_order: cat.order
      }).select().single();

      if (!catErr && newCat) {
        catMap.set(cat.slug, newCat.id);
        console.log(`Created new category: ${cat.name}`);
      } else {
        // fallback to any existing cat
        if (existingCats && existingCats.length) catMap.set(cat.slug, existingCats[0].id);
      }
    }
  }

  // 4. Sync each product & variants
  let updatedCount = 0;
  let createdCount = 0;
  let variantCount = 0;

  for (const item of catalog) {
    const catId = catMap.get(item.category.slug) || (existingCats && existingCats[0]?.id);

    // Check if product exists by slug or name
    const { data: existing } = await supabase
      .from('products')
      .select('id, image_url, images')
      .or(`slug.eq.${item.slug},name.ilike.%${item.name.replace(/[%_]/g, '')}%`)
      .limit(1);

    const prodPayload = {
      name: item.name,
      slug: item.slug,
      pet_type: item.pet_type,
      brand: item.brand,
      category_id: catId,
      description: item.description,
      ingredients: item.ingredients || null,
      indications: item.indications || null,
      directions: item.directions || null,
      packaging: item.packaging || null,
      storage_safety: item.storage_safety || null,
      is_featured: item.is_featured,
      is_active: true,
      updated_at: new Date().toISOString()
    };

    let prodId = null;

    if (existing && existing.length > 0) {
      prodId = existing[0].id;
      // preserve existing image if present
      if (existing[0].image_url) prodPayload.image_url = existing[0].image_url;
      if (existing[0].images && existing[0].images.length) prodPayload.images = existing[0].images;

      const { error: upErr } = await supabase.from('products').update(prodPayload).eq('id', prodId);
      if (upErr) {
        console.error(`Error updating ${item.name}:`, upErr.message);
      } else {
        updatedCount++;
      }
    } else {
      const { data: newProd, error: insErr } = await supabase.from('products').insert(prodPayload).select().single();
      if (insErr) {
        console.error(`Error inserting ${item.name}:`, insErr.message);
      } else if (newProd) {
        prodId = newProd.id;
        createdCount++;
      }
    }

    if (prodId) {
      // Clear old variants and insert real ones
      await supabase.from('product_variants').delete().eq('product_id', prodId);

      for (const v of item.variants) {
        const { error: varErr } = await supabase.from('product_variants').insert({
          product_id: prodId,
          size_label: v.size_label,
          price: v.price,
          compare_at_price: v.compare_at_price,
          stock: v.stock,
          is_active: true
        });
        if (!varErr) variantCount++;
      }
    }
  }

  console.log(`\n=== Migration Complete ===`);
  console.log(`- Products updated: ${updatedCount}`);
  console.log(`- Products created: ${createdCount}`);
  console.log(`- Total variants inserted with real prices: ${variantCount}`);

  // Quick verification query
  const { data: sample } = await supabase.from('products').select('name, pet_type, product_variants(size_label, price)').limit(5);
  console.log('\nSample synced products:');
  sample.forEach(s => {
    const vStr = s.product_variants.map(v => `${v.size_label}: Rs.${v.price}`).join(' | ');
    console.log(`- ${s.name} [${s.pet_type}] -> ${vStr}`);
  });
}

run();
