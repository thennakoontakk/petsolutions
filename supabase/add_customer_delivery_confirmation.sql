-- Migration: Add customer delivery confirmation RLS policy
-- Allows customers to update their own orders from 'shipped' → 'delivered'
-- while preserving full admin authority.

-- Check: This policy already exists in the database.
-- Included here for documentation and version control.

-- The policy constrains:
--   USING: user owns the order AND current status is 'shipped'
--   WITH CHECK: user owns the order AND new status is 'delivered'
-- This means customers can ONLY mark shipped orders as delivered, nothing else.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'orders'
    AND policyname = 'Users can confirm delivery of own shipped orders'
  ) THEN
    CREATE POLICY "Users can confirm delivery of own shipped orders"
      ON orders FOR UPDATE
      USING (auth.uid() = user_id AND status = 'shipped')
      WITH CHECK (auth.uid() = user_id AND status = 'delivered');
  END IF;
END
$$;

-- Admin retains full authority via existing policy:
-- "Admins can manage all orders" ON orders FOR ALL
--   USING (is_admin(auth.uid()))
