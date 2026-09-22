-- =====================================================================
-- Sync auth.users with public.profiles & Ensure Owner/Admin RLS access
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jnakxlejkmyptoffvhsa/sql
-- =====================================================================

-- 1. Ensure the 'role' column exists on public.profiles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'customer' CHECK (role IN ('owner', 'staff', 'pharmacist', 'customer'));
    END IF;
END $$;

-- 2. Create / update the trigger function so ANY new sign up automatically creates a profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN NEW.email IN ('admin@petsolutions.lk', 'owner@petsolutions.lk') THEN 'owner'
      WHEN NEW.email = 'staff@petsolutions.lk' THEN 'staff'
      WHEN NEW.email = 'pharmacist@petsolutions.lk' THEN 'pharmacist'
      ELSE 'customer'
    END,
    CASE 
      WHEN NEW.email IN ('admin@petsolutions.lk', 'owner@petsolutions.lk', 'staff@petsolutions.lk', 'pharmacist@petsolutions.lk') THEN true
      ELSE false
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rebind the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill / Sync any users that are already inside auth.users into public.profiles
INSERT INTO public.profiles (id, email, full_name, role, is_admin)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  CASE 
    WHEN email IN ('admin@petsolutions.lk', 'owner@petsolutions.lk') THEN 'owner'
    WHEN email = 'staff@petsolutions.lk' THEN 'staff'
    WHEN email = 'pharmacist@petsolutions.lk' THEN 'pharmacist'
    ELSE 'customer'
  END,
  CASE 
    WHEN email IN ('admin@petsolutions.lk', 'owner@petsolutions.lk', 'staff@petsolutions.lk', 'pharmacist@petsolutions.lk') THEN true
    ELSE false
  END
FROM auth.users
ON CONFLICT (id) DO UPDATE 
SET 
  email = EXCLUDED.email,
  role = COALESCE(public.profiles.role, EXCLUDED.role),
  is_admin = COALESCE(public.profiles.is_admin, EXCLUDED.is_admin);

-- 4. Enable RLS on profiles and ensure Admins/Owners can read & update all profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR role = 'owner'))
  );

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR role = 'owner'))
  );
