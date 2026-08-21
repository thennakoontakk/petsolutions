-- =====================================================================
-- SQL Script to Fix RLS Infinite Recursion on Profiles Table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jnakxlejkmyptoffvhsa/sql
-- =====================================================================

-- 1. Create a security definer function to check admin status
-- This bypasses RLS checks on the profiles table, preventing infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Drop existing admin policies that caused recursion
DROP POLICY IF EXISTS "Admins can do everything on categories" ON categories;
DROP POLICY IF EXISTS "Admins can do everything on products" ON products;
DROP POLICY IF EXISTS "Admins can do everything on variants" ON product_variants;
DROP POLICY IF EXISTS "Admins can do everything on offers" ON offers;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;

-- 3. Recreate admin policies using the security definer function
CREATE POLICY "Admins can do everything on categories" ON categories FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can do everything on products" ON products FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can do everything on variants" ON product_variants FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can do everything on offers" ON offers FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all orders" ON orders FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all order items" ON order_items FOR ALL 
  USING (public.is_admin(auth.uid()));
