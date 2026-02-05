-- ROLLBACK for Migration 004: Remove ingredients column
-- Description: Rollback script to remove ingredients column if needed
-- Created: 2026-02-05
-- WARNING: This will drop the ingredients column and all data in it

-- Drop the index first
DROP INDEX IF EXISTS idx_meals_ingredients;

-- Remove the column
ALTER TABLE meals
  DROP COLUMN IF EXISTS ingredients;

-- Note: This rollback will permanently delete all ingredient-level data
-- Make sure to backup data before running this rollback
