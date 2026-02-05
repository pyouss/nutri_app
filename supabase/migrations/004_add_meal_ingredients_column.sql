-- Migration: 004_add_meal_ingredients_column.sql
-- Description: Add ingredients column to meals table for ingredient-level meal tracking
-- Created: 2026-02-05

ALTER TABLE meals
  ADD COLUMN IF NOT EXISTS ingredients JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN meals.ingredients IS 
  'JSONB array of ingredients for ingredient-level meals. Structure: [{name, portionSize, calories, protein, carbs, fat}]. NULL for meal-level entries.';

-- Add index for JSONB queries (if needed for future ingredient search)
CREATE INDEX IF NOT EXISTS idx_meals_ingredients ON meals USING GIN (ingredients);
