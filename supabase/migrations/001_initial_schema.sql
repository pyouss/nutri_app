-- Migration: 001_initial_schema.sql
-- Description: Create initial database schema with users, meals, and ingredients tables
-- Created: 2026-02-03

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Note: This table extends Supabase Auth users if using Supabase Auth
-- For now, we create a separate users table that can be linked to auth.users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MEALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meal_name VARCHAR(255) NOT NULL,
    total_calories INTEGER,
    total_protein NUMERIC(10, 2),
    total_carbs NUMERIC(10, 2),
    total_fat NUMERIC(10, 2),
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create trigger to auto-update updated_at on meals table
CREATE TRIGGER update_meals_updated_at
    BEFORE UPDATE ON meals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INGREDIENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(255) NOT NULL,
    calories_per_100g NUMERIC(10, 2),
    protein_per_100g NUMERIC(10, 2),
    carbs_per_100g NUMERIC(10, 2),
    fat_per_100g NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create trigger to auto-update updated_at on ingredients table
CREATE TRIGGER update_ingredients_updated_at
    BEFORE UPDATE ON ingredients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- RLS Policy for users table: users can only read/update their own row
CREATE POLICY "Users can only access their own user data"
    ON users
    FOR ALL
    USING (auth.uid()::text = id::text);

-- RLS Policy for meals table: users can only access meals where user_id matches auth.uid()
CREATE POLICY "Users can only access their own meals"
    ON meals
    FOR ALL
    USING (auth.uid()::text = user_id::text);

-- RLS Policy for ingredients table: users can only access ingredients where user_id matches auth.uid()
CREATE POLICY "Users can only access their own ingredients"
    ON ingredients
    FOR ALL
    USING (auth.uid()::text = user_id::text);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on meals.user_id for join performance
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);

-- Index on meals.meal_date for date-based queries
CREATE INDEX IF NOT EXISTS idx_meals_meal_date ON meals(meal_date);

-- Index on ingredients.user_id for join performance
CREATE INDEX IF NOT EXISTS idx_ingredients_user_id ON ingredients(user_id);

-- Index on ingredients.ingredient_name for autocomplete queries
CREATE INDEX IF NOT EXISTS idx_ingredients_ingredient_name ON ingredients(ingredient_name);
