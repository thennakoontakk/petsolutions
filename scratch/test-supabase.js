const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jnakxlejkmyptoffvhsa.supabase.co';
const supabaseKey = 'sb_publishable_bdZoe5MN7YgLgfS5dnZCdg_L2Y1PqFB'; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, image_url, images')
    .eq('slug', 'smartheart-power-pack-adult');

  if (error) {
    console.error('Error fetching product:', error);
  } else {
    console.log('SmartHeart Power Pack Adult details:');
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
