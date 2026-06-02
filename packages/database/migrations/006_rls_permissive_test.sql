-- FIX: RLS policies to allow authenticated users (temporary for testing/development)
-- These policies will be made more restrictive in production
-- This allows any logged-in user to read/write vehicles without role restrictions

-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "vehicles_write" ON vehicles;
DROP POLICY IF EXISTS "vehicles_select" ON vehicles;

-- Create new permissive policies for testing
-- Allow authenticated users to read vehicles
CREATE POLICY "vehicles_select_authenticated" ON vehicles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to create/update/delete vehicles
CREATE POLICY "vehicles_write_authenticated" ON vehicles FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow public read access (optional, for demo)
CREATE POLICY "vehicles_select_public" ON vehicles FOR SELECT
  USING (true);

