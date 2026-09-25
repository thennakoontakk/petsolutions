const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jnakxlejkmyptoffvhsa.supabase.co',
  'sb_publishable_bdZoe5MN7YgLgfS5dnZCdg_L2Y1PqFB',
  { auth: { persistSession: false } }
);

async function testAdminFetch() {
  console.log('Logging in as admin@petsolutions.lk...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@petsolutions.lk',
    password: 'AdminPassword123',
  });

  if (authError) {
    console.log('Sign in error:', authError.message);
  } else {
    console.log('Signed in successfully! User ID:', authData.user.id);
  }

  const { data: profiles, error: profError } = await supabase.from('profiles').select('*');
  if (profError) {
    console.error('Profiles query error:', profError);
  } else {
    console.log('Profiles returned with admin token:', profiles);
  }
}

testAdminFetch();
