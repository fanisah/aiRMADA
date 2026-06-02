-- Fix RLS policies to handle case-insensitive role comparisons
-- This allows both 'manager' and 'MANAGER' to work

-- Update the current_user_role function to return lowercase
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT LOWER(role::text)::user_role FROM users WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Note: The policies themselves already use 'manager', 'dispatcher', 'driver' (lowercase)
-- so they will work once the function returns lowercase values
