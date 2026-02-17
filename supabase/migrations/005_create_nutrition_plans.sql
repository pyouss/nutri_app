-- Migration: 005_create_nutrition_plans.sql
-- Description: Create tables for nutrition plan templates and user plans
-- Created: 2026-02-16

-- ============================================================================
-- NUTRITION PROTOCOLS TABLE
-- Stores the base protocol information (maintenance, deficit phases)
-- ============================================================================
CREATE TABLE IF NOT EXISTS nutrition_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL, -- e.g., "Protocole 2: Recomposition corporelle"
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- PROTOCOL PHASES TABLE
-- Different phases of a protocol (maintenance, deficit, surplus)
-- ============================================================================
CREATE TABLE IF NOT EXISTS protocol_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_id UUID NOT NULL REFERENCES nutrition_protocols(id) ON DELETE CASCADE,
    phase_name VARCHAR(100) NOT NULL, -- e.g., "Maintenance", "Deficit -300kcal"
    daily_calories INTEGER NOT NULL,
    target_protein NUMERIC(10, 2) NOT NULL,
    target_carbs NUMERIC(10, 2) NOT NULL,
    target_fat NUMERIC(10, 2) NOT NULL,
    phase_order INTEGER DEFAULT 1, -- Order of phases in the protocol
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- MEAL TEMPLATES TABLE
-- Pre-made meal recipes (e.g., "Spaghettis gourmands", "Club gourmand")
-- ============================================================================
CREATE TABLE IF NOT EXISTS meal_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_calories INTEGER NOT NULL,
    total_protein NUMERIC(10, 2) NOT NULL,
    total_carbs NUMERIC(10, 2) NOT NULL,
    total_fat NUMERIC(10, 2) NOT NULL,
    ingredients JSONB NOT NULL, -- Array of {name, quantity, unit}
    preparation_notes TEXT,
    is_public BOOLEAN DEFAULT true, -- Public templates vs user-specific
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- DAILY MEAL PLANS TABLE
-- Complete daily menu plans (e.g., "Menu 1", "Menu 2")
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id UUID NOT NULL REFERENCES protocol_phases(id) ON DELETE CASCADE,
    menu_name VARCHAR(255) NOT NULL, -- e.g., "Menu 1", "Menu 2"
    menu_type VARCHAR(50), -- e.g., "P+" (protein-focused), "G+" (carb-focused), "L+" (fat-focused)
    total_calories INTEGER NOT NULL,
    total_protein NUMERIC(10, 2) NOT NULL,
    total_carbs NUMERIC(10, 2) NOT NULL,
    total_fat NUMERIC(10, 2) NOT NULL,
    meal_items JSONB NOT NULL, -- Array of meal template references or custom meals
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- USER NUTRITION PLANS TABLE
-- Links users to their active nutrition plan with personal data
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_nutrition_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    protocol_id UUID NOT NULL REFERENCES nutrition_protocols(id) ON DELETE CASCADE,
    current_phase_id UUID REFERENCES protocol_phases(id) ON DELETE SET NULL,
    
    -- Personal information
    age INTEGER,
    height_cm NUMERIC(5, 2),
    weight_kg NUMERIC(5, 2),
    body_fat_percentage NUMERIC(4, 1),
    
    -- Dates
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    current_phase_start_date DATE,
    
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Only one active plan per user
    CONSTRAINT unique_active_plan_per_user UNIQUE (user_id, is_active)
);

-- ============================================================================
-- INGREDIENT LIBRARY TABLE (Enhanced from existing ingredients table)
-- Base ingredient data with nutritional info per 100g
-- ============================================================================
CREATE TABLE IF NOT EXISTS ingredient_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    calories_per_100g NUMERIC(10, 2) NOT NULL,
    protein_per_100g NUMERIC(10, 2) NOT NULL,
    carbs_per_100g NUMERIC(10, 2) NOT NULL,
    fat_per_100g NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100), -- e.g., "protein", "carbs", "vegetables", "dairy"
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_nutrition_protocols_updated_at
    BEFORE UPDATE ON nutrition_protocols
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocol_phases_updated_at
    BEFORE UPDATE ON protocol_phases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_templates_updated_at
    BEFORE UPDATE ON meal_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_meal_plans_updated_at
    BEFORE UPDATE ON daily_meal_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_nutrition_plans_updated_at
    BEFORE UPDATE ON user_nutrition_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredient_library_updated_at
    BEFORE UPDATE ON ingredient_library
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Public templates are readable by all, but only admins can modify
ALTER TABLE nutrition_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_library ENABLE ROW LEVEL SECURITY;

-- User-specific tables
ALTER TABLE user_nutrition_plans ENABLE ROW LEVEL SECURITY;

-- Read access to public nutrition data
CREATE POLICY "Anyone can view public nutrition protocols"
    ON nutrition_protocols FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view protocol phases"
    ON protocol_phases FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view public meal templates"
    ON meal_templates FOR SELECT
    USING (is_public = true OR created_by::text = auth.uid()::text);

CREATE POLICY "Anyone can view daily meal plans"
    ON daily_meal_plans FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view public ingredients"
    ON ingredient_library FOR SELECT
    USING (is_public = true);

-- User nutrition plans - users only access their own
CREATE POLICY "Users can view their own nutrition plans"
    ON user_nutrition_plans FOR SELECT
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own nutrition plans"
    ON user_nutrition_plans FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own nutrition plans"
    ON user_nutrition_plans FOR UPDATE
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own nutrition plans"
    ON user_nutrition_plans FOR DELETE
    USING (auth.uid()::text = user_id::text);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_protocol_phases_protocol_id ON protocol_phases(protocol_id);
CREATE INDEX idx_daily_meal_plans_phase_id ON daily_meal_plans(phase_id);
CREATE INDEX idx_meal_templates_name ON meal_templates(name);
CREATE INDEX idx_ingredient_library_name ON ingredient_library(name);
CREATE INDEX idx_user_nutrition_plans_user_id ON user_nutrition_plans(user_id);
CREATE INDEX idx_user_nutrition_plans_active ON user_nutrition_plans(user_id, is_active) WHERE is_active = true;

-- GIN index for JSONB columns
CREATE INDEX idx_meal_templates_ingredients ON meal_templates USING GIN (ingredients);
CREATE INDEX idx_daily_meal_plans_meal_items ON daily_meal_plans USING GIN (meal_items);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE nutrition_protocols IS 'Base nutrition protocols (e.g., maintenance, recomposition, bulking)';
COMMENT ON TABLE protocol_phases IS 'Different phases within a protocol with specific macro targets';
COMMENT ON TABLE meal_templates IS 'Pre-made meal recipes with ingredients and macros';
COMMENT ON TABLE daily_meal_plans IS 'Complete daily meal plans composed of multiple meal templates';
COMMENT ON TABLE user_nutrition_plans IS 'User-specific nutrition plan tracking with personal data';
COMMENT ON TABLE ingredient_library IS 'Library of ingredients with nutritional data per 100g';
