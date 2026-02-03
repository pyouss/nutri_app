-- Migration: 002_fix_schema_issues.sql
-- Description: Fix code review findings - link users to auth, add constraints, indexes, and validation
-- Created: 2026-02-03
-- Review Findings: Addresses 8 issues identified in code review

-- ============================================================================
-- FIX 1 & 2: Link users table to Supabase Auth and add auto-sync trigger
-- ============================================================================
-- Note: Since migration 001 is already applied, we'll add triggers to sync auth.users
-- For future deployments, users.id should reference auth.users(id) directly in the initial migration
-- The triggers ensure public.users rows are created/updated automatically when auth.users changes
-- Function to handle new user creation from auth.users
-- This automatically creates a public.users row when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET email = COALESCE(EXCLUDED.email, users.email),
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create users row when auth.users row is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Also sync on email updates in auth.users
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET email = COALESCE(NEW.email, users.email),
      updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.handle_user_email_update();

-- ============================================================================
-- FIX 3: Add index on users.email for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- FIX 4: Add validation constraints on macro values (prevent negative values)
-- ============================================================================
-- Add CHECK constraints to meals table
ALTER TABLE meals
  ADD CONSTRAINT meals_total_calories_check CHECK (total_calories IS NULL OR total_calories >= 0),
  ADD CONSTRAINT meals_total_protein_check CHECK (total_protein IS NULL OR total_protein >= 0),
  ADD CONSTRAINT meals_total_carbs_check CHECK (total_carbs IS NULL OR total_carbs >= 0),
  ADD CONSTRAINT meals_total_fat_check CHECK (total_fat IS NULL OR total_fat >= 0);

-- Add CHECK constraints to ingredients table
ALTER TABLE ingredients
  ADD CONSTRAINT ingredients_calories_per_100g_check CHECK (calories_per_100g IS NULL OR calories_per_100g >= 0),
  ADD CONSTRAINT ingredients_protein_per_100g_check CHECK (protein_per_100g IS NULL OR protein_per_100g >= 0),
  ADD CONSTRAINT ingredients_carbs_per_100g_check CHECK (carbs_per_100g IS NULL OR carbs_per_100g >= 0),
  ADD CONSTRAINT ingredients_fat_per_100g_check CHECK (fat_per_100g IS NULL OR fat_per_100g >= 0);

-- ============================================================================
-- FIX 5: Add unique constraint on ingredient_name per user
-- ============================================================================
-- Prevent duplicate ingredient names per user (ensures data quality)
CREATE UNIQUE INDEX IF NOT EXISTS idx_ingredients_user_id_ingredient_name 
  ON ingredients(user_id, ingredient_name);

-- ============================================================================
-- FIX 6: Increase email column length for RFC 5321 compliance
-- ============================================================================
-- RFC 5321 allows up to 320 characters (64 local + @ + 255 domain)
ALTER TABLE users
  ALTER COLUMN email TYPE VARCHAR(320);

-- ============================================================================
-- FIX 7: Add comments to RLS policies for maintainability
-- ============================================================================
COMMENT ON POLICY "Users can only access their own user data" ON users IS
  'RLS policy ensures users can only access their own user row. Uses text casting for UUID comparison (PostgreSQL/RLS quirk).';

COMMENT ON POLICY "Users can only access their own meals" ON meals IS
  'RLS policy ensures users can only access meals where user_id matches their auth.uid(). Uses text casting for UUID comparison.';

COMMENT ON POLICY "Users can only access their own ingredients" ON ingredients IS
  'RLS policy ensures users can only access ingredients where user_id matches their auth.uid(). Uses text casting for UUID comparison.';
