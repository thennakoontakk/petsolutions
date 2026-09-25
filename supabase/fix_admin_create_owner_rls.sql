-- =====================================================================
-- Fix 403 Forbidden (42501 RLS Violation) When Creating Owner/Admin/Staff
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jnakxlejkmyptoffvhsa/sql
-- =====================================================================

-- 1. Update the security definer helper to recognize both is_admin = true and role = 'owner'
-- Using SECURITY DEFINER avoids infinite RLS recursion on public.profiles
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND (is_admin = true OR role = 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Allow pre-provisioning new Owner / Staff profiles from the Admin Console
-- before the user has registered in auth.users:
--   a) Ensure profiles.id generates a UUID automatically when not supplied
--   b) Drop the strict auth.users foreign key constraint so Admins can add new emails directly
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Ensure the 'role' column exists on public.profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'customer' CHECK (role IN ('owner', 'staff', 'pharmacist', 'customer'));
  END IF;
END $$;

-- 4. Enable RLS and add the missing INSERT / UPDATE / DELETE policies on public.profiles
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

-- 5. Update the signup trigger so pre-provisioned Owner/Staff profiles keep their role
-- and link to the new auth.users ID when they later sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_profile RECORD;
  assigned_role TEXT;
  assigned_admin BOOLEAN;
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

  assigned_role := CASE 
    WHEN LOWER(NEW.email) IN ('admin@petsolutions.lk', 'owner@petsolutions.lk') THEN 'owner'
    WHEN LOWER(NEW.email) = 'staff@petsolutions.lk' THEN 'staff'
    WHEN LOWER(NEW.email) = 'pharmacist@petsolutions.lk' THEN 'pharmacist'
    ELSE 'customer'
  END;

  assigned_admin := CASE 
    WHEN LOWER(NEW.email) IN ('admin@petsolutions.lk', 'owner@petsolutions.lk', 'staff@petsolutions.lk', 'pharmacist@petsolutions.lk') THEN true
    ELSE false
  END;

  INSERT INTO public.profiles (id, email, full_name, role, is_admin)
  VALUES (
    NEW.id,
    LOWER(NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    assigned_role,
    assigned_admin
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
