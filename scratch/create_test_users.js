const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`${name}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

// In Node, we want to make sure auth doesn't complain about PKCE flow redirect or storage.
// We can use standard flow.
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

async function run() {
  console.log('--- Registering standard user: user@petsolutions.lk ---');
  const { data: userSignUpData, error: userSignUpError } = await supabase.auth.signUp({
    email: 'user@petsolutions.lk',
    password: 'UserPassword123',
    options: {
      data: { full_name: 'Test User' }
    }
  });

  if (userSignUpError) {
    console.log('Standard user registration message/error:', userSignUpError.message);
  } else {
    console.log('Standard user registered successfully:', userSignUpData.user?.id);
  }

  console.log('\n--- Registering admin user: admin@petsolutions.lk ---');
  const { data: adminSignUpData, error: adminSignUpError } = await supabase.auth.signUp({
    email: 'admin@petsolutions.lk',
    password: 'AdminPassword123',
    options: {
      data: { full_name: 'Test Admin' }
    }
  });

  let adminUserId = adminSignUpData.user?.id;
  if (adminSignUpError) {
    console.log('Admin user registration message/error:', adminSignUpError.message);
    if (adminSignUpError.message.includes('already registered') || adminSignUpError.status === 422) {
      // If already registered, we can try to sign in to get the ID and update it.
    }
  } else {
    console.log('Admin user registered successfully:', adminUserId);
  }

  // Now, let's login as admin to get auth context and perform the profile update
  console.log('\n--- Logging in as admin to escalate privileges ---');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@petsolutions.lk',
    password: 'AdminPassword123'
  });

  if (signInError) {
    console.error('Failed to log in as admin:', signInError.message);
    return;
  }

  adminUserId = signInData.user.id;
  console.log('Logged in successfully. User ID:', adminUserId);

  console.log('Updating profile to is_admin = true...');
  const { data: updateData, error: updateError } = await supabase
    .from('profiles')
    .update({ is_admin: true })
    .eq('id', adminUserId)
    .select();

  if (updateError) {
    console.error('Error escalating admin privileges:', updateError);
  } else {
    console.log('Admin privileges escalated successfully! Profile:', updateData);
  }
}

run();
