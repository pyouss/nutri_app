-- Migration: 003_fix_trigger_rls.sql
-- Description: Fix RLS policy to allow trigger function to insert users
-- Created: 2026-02-03
-- Issue: RLS policy blocks trigger from inserting new user rows

-- ============================================================================
-- FIX: Allow trigger function to bypass RLS for user creation
-- ============================================================================

-- The issue is that the RLS policy blocks the trigger function from inserting
-- We need to either:
-- 1. Add a policy that allows inserts when id matches auth.uid()
-- 2. Or grant the function owner permissions to bypass RLS

-- Option 1: Add a more permissive policy for INSERT operations
-- This allows inserts when the id matches the authenticated user's id
-- During signup, auth.uid() will be the new user's id

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can only access their own user data" ON users;

-- Create separate policies for each operation
-- SELECT policy: users can only read their own data
CREATE POLICY "Users can only read their own user data"
    ON users
    FOR SELECT
    USING (auth.uid()::text = id::text);

-- UPDATE policy: users can only update their own data
CREATE POLICY "Users can only update their own user data"
    ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text);

-- INSERT policy: allow inserts when id matches auth.uid() (for trigger)
-- The trigger function runs with SECURITY DEFINER, so it should have permissions
-- But we need to allow inserts when the id matches the authenticated user
-- During signup, auth.uid() will be the new user's id
CREATE POLICY "Users can insert their own user data"
    ON users
    FOR INSERT
    WITH CHECK (auth.uid()::text = id::text);

-- Alternative approach: Grant the function owner (postgres) permission to bypass RLS
-- But the above policy approach is safer and more explicit

-- Ensure the trigger function has the right permissions
-- The function already uses SECURITY DEFINER, which should work
-- But we need to make sure the RLS policy allows it

-- Verify the trigger function exists and is correct
-- (It should already exist from migration 002)
