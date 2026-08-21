const { createClient } = require('@supabase/supabase-js');

const url = 'https://jnakxlejkmyptoffvhsa.supabase.co';
const key = 'sb_publishable_bdZoe5MN7YgLgfS5dnZCdg_L2Y1PqFB';

async function testConnection() {
  console.log('Testing connection to categories table...');
  const supabase = createClient(url, key);

  const { data: catData, error: catError } = await supabase
    .from('categories')
    .select('*')
    .limit(3);

  if (catError) {
    console.error('Categories Query Error:', catError);
  } else {
    console.log('Categories fetched successfully:', catData);
  }

  console.log('\nTesting connection to products table...');
  const { data: prodData, error: prodError } = await supabase
    .from('products')
    .select('*, categories(*), product_variants(*)')
    .limit(2);

  if (prodError) {
    console.error('Products Query Error:', prodError);
  } else {
    console.log('Products fetched successfully:', prodData);
  }
}

testConnection();
