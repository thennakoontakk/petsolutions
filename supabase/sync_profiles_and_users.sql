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

-- 1b. Allow pre-provisioned profiles from Admin Console before user signup
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 1c. Security definer helper to check admin/owner status without RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND (is_admin = true OR role = 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Create / update the trigger function so ANY new sign up automatically creates or links a profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_profile RECORD;
BEGIN
  SELECT * INTO existing_profile
  FROM public.profiles
  WHERE LOWER(email) = LOWER(NEW.email)
  LIMIT 1;

  IF existing_profile.id IS NOT NULL THEN
    UPDATE public.profiles
    SET
      id = NEW.id,
      email = LOWER(NEW.email),
      full_name = COALESCE(existing_profile.full_name, NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      role = COALESCE(existing_profile.role, 'customer'),
      is_admin = COALESCE(existing_profile.is_admin, false)
    WHERE id = existing_profile.id;
    RETURN NEW;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, is_admin)
  VALUES (
    NEW.id,
    LOWER(NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN LOWER(NEW.email) IN ('admin@petsolutions.lk', 'owner@petsolutions.lk') THEN 'owner'
      WHEN LOWER(NEW.email) = 'staff@petsolutions.lk' THEN 'staff'
      WHEN LOWER(NEW.email) = 'pharmacist@petsolutions.lk' THEN 'pharmacist'
      ELSE 'customer'
    END,
    CASE 
      WHEN LOWER(NEW.email) IN ('admin@petsolutions.lk', 'owner@petsolutions.lk', 'staff@petsolutions.lk', 'pharmacist@petsolutions.lk') THEN true
      ELSE false
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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

-- 4. Enable RLS on profiles and ensure Admins/Owners can read, insert, update & delete profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.is_admin(auth.uid()));
