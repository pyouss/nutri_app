-- Migration: 006_improved_nutrition_schema.sql
-- Description: Improved modular and normalized nutrition plan schema
-- This replaces the JSONB approach with proper relational tables
-- Created: 2026-02-16

-- ============================================================================
-- STEP 1: Drop old schema tables (if you want fresh start)
-- Comment out if you want to keep existing data and migrate
-- ============================================================================
-- DROP TABLE IF EXISTS daily_meal_plans CASCADE;
-- DROP TABLE IF EXISTS meal_templates CASCADE;
-- DROP TABLE IF EXISTS ingredient_library CASCADE;

-- ============================================================================
-- PREREQUISITE TABLES (from migration 005)
-- These are needed for foreign key relationships
-- ============================================================================

-- NUTRITION PROTOCOLS TABLE
-- Stores the base protocol information (maintenance, deficit phases)
CREATE TABLE IF NOT EXISTS nutrition_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL, -- e.g., "Protocole 2: Recomposition corporelle"
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- PROTOCOL PHASES TABLE
-- Different phases of a protocol (maintenance, deficit, surplus)
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

-- USER NUTRITION PLANS TABLE
-- Links users to their active nutrition plan with personal data
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- CONSOLIDATED INGREDIENTS TABLE
-- Single source of truth for all ingredients
-- ============================================================================
CREATE TABLE IF NOT EXISTS ingredients_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100), -- 'protein', 'carbs', 'vegetables', 'dairy', 'fats', 'fruits', 'grains'
    
    -- Nutritional data per 100g (standard)
    calories_per_100g NUMERIC(10, 2) NOT NULL,
    protein_per_100g NUMERIC(10, 2) NOT NULL DEFAULT 0,
    carbs_per_100g NUMERIC(10, 2) NOT NULL DEFAULT 0,
    fat_per_100g NUMERIC(10, 2) NOT NULL DEFAULT 0,
    fiber_per_100g NUMERIC(10, 2) DEFAULT 0,
    
    -- Additional metadata
    default_unit VARCHAR(20) DEFAULT 'g', -- 'g', 'ml', 'piece', 'cup', 'tbsp'
    default_serving_size NUMERIC(10, 2), -- in default_unit
    brand VARCHAR(255), -- For branded items
    
    -- Visibility
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- MEAL TEMPLATES (Improved)
-- Base template without embedded ingredient data
-- ============================================================================
CREATE TABLE IF NOT EXISTS meal_templates_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Meal classification
    meal_type VARCHAR(50), -- 'breakfast', 'lunch', 'dinner', 'snack', 'pre-workout', 'post-workout'
    cuisine_type VARCHAR(50), -- 'french', 'italian', 'asian', etc.
    
    -- Calculated totals (computed from ingredients)
    total_calories INTEGER,
    total_protein NUMERIC(10, 2),
    total_carbs NUMERIC(10, 2),
    total_fat NUMERIC(10, 2),
    total_fiber NUMERIC(10, 2),
    
    -- Preparation
    prep_time_minutes INTEGER, -- Preparation time
    cook_time_minutes INTEGER, -- Cooking time
    servings INTEGER DEFAULT 1, -- How many servings this recipe makes
    preparation_notes TEXT,
    cooking_instructions TEXT,
    
    -- Tagging
    tags TEXT[], -- ['high-protein', 'quick', 'vegetarian', 'meal-prep-friendly']
    difficulty_level VARCHAR(20), -- 'easy', 'medium', 'hard'
    
    -- Visibility & ownership
    is_public BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false, -- Verified by nutritionist/admin
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Version control
    version INTEGER DEFAULT 1,
    parent_template_id UUID REFERENCES meal_templates_v2(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- MEAL TEMPLATE INGREDIENTS (Junction Table)
-- Many-to-many: Templates can have multiple ingredients
-- ============================================================================
CREATE TABLE IF NOT EXISTS meal_template_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES meal_templates_v2(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients_master(id) ON DELETE CASCADE,
    
    -- Quantity specification
    quantity NUMERIC(10, 2) NOT NULL, -- Amount of ingredient
    unit VARCHAR(20) NOT NULL DEFAULT 'g', -- 'g', 'ml', 'piece', 'cup', 'tbsp'
    
    -- Calculated macros for this specific quantity
    calories NUMERIC(10, 2),
    protein NUMERIC(10, 2),
    carbs NUMERIC(10, 2),
    fat NUMERIC(10, 2),
    
    -- Preparation notes for this ingredient in this recipe
    preparation_note TEXT, -- e.g., "cooked", "diced", "raw"
    is_optional BOOLEAN DEFAULT false,
    
    -- Order in recipe
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Ensure no duplicate ingredients in same template
    UNIQUE(template_id, ingredient_id)
);

-- ============================================================================
-- DAILY MEAL PLANS (Improved)
-- Collection of meals for a complete day
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_meal_plans_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id UUID NOT NULL REFERENCES protocol_phases(id) ON DELETE CASCADE,
    
    plan_name VARCHAR(255) NOT NULL, -- "Menu 1", "Menu 2", etc.
    plan_type VARCHAR(50), -- 'P+' (protein), 'G+' (carbs), 'L+' (fats), 'balanced'
    
    -- Target macros for this day
    total_calories INTEGER NOT NULL,
    total_protein NUMERIC(10, 2) NOT NULL,
    total_carbs NUMERIC(10, 2) NOT NULL,
    total_fat NUMERIC(10, 2) NOT NULL,
    
    -- Planning metadata
    difficulty_level VARCHAR(20), -- 'easy', 'medium', 'hard'
    prep_required TEXT, -- "Some meal prep required on Sunday"
    notes TEXT,
    
    -- Visibility
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- DAILY MEAL PLAN ITEMS (Junction Table)
-- Links meal plans to specific meals/templates
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_meal_plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES daily_meal_plans_v2(id) ON DELETE CASCADE,
    
    -- Either reference a template OR specify custom meal
    template_id UUID REFERENCES meal_templates_v2(id) ON DELETE CASCADE,
    
    -- Custom meal details (if not using template)
    custom_meal_name VARCHAR(255),
    custom_calories INTEGER,
    custom_protein NUMERIC(10, 2),
    custom_carbs NUMERIC(10, 2),
    custom_fat NUMERIC(10, 2),
    
    -- Meal timing
    meal_time VARCHAR(50), -- 'breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'
    suggested_time TIME, -- e.g., '08:00', '13:00', '19:00'
    
    -- Quantity adjustment
    serving_multiplier NUMERIC(4, 2) DEFAULT 1.0, -- 1.0 = standard serving, 1.5 = 1.5x recipe
    adjustment_notes TEXT, -- "Add 126g more pasta"
    
    -- Order in the day
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Must have either template or custom meal
    CONSTRAINT must_have_meal CHECK (
        template_id IS NOT NULL OR 
        (custom_meal_name IS NOT NULL AND custom_calories IS NOT NULL)
    )
);

-- ============================================================================
-- USER MEAL LOG (Track actual consumption)
-- Replaces the old 'meals' table with better structure
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_meal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Meal identification
    meal_name VARCHAR(255) NOT NULL,
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_time TIME,
    meal_type VARCHAR(50), -- 'breakfast', 'lunch', 'dinner', 'snack'
    
    -- Source of meal
    template_id UUID REFERENCES meal_templates_v2(id) ON DELETE SET NULL,
    plan_item_id UUID REFERENCES daily_meal_plan_items(id) ON DELETE SET NULL,
    
    -- Nutritional totals
    total_calories INTEGER NOT NULL,
    total_protein NUMERIC(10, 2),
    total_carbs NUMERIC(10, 2),
    total_fat NUMERIC(10, 2),
    
    -- Serving adjustment
    serving_multiplier NUMERIC(4, 2) DEFAULT 1.0,
    
    -- User notes
    notes TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- USER MEAL LOG INGREDIENTS (What they actually ate)
-- Track ingredient-level consumption
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_meal_log_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_log_id UUID NOT NULL REFERENCES user_meal_logs(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients_master(id) ON DELETE CASCADE,
    
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    
    -- Calculated macros
    calories NUMERIC(10, 2),
    protein NUMERIC(10, 2),
    carbs NUMERIC(10, 2),
    fat NUMERIC(10, 2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- USER FAVORITES
-- Track user's favorite meals and templates
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_favorite_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES meal_templates_v2(id) ON DELETE CASCADE,
    
    custom_name VARCHAR(255), -- User can rename it
    notes TEXT,
    frequency_count INTEGER DEFAULT 0, -- How many times logged
    last_logged_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(user_id, template_id)
);

-- ============================================================================
-- COMPUTED FUNCTIONS
-- Functions to automatically calculate macros
-- ============================================================================

-- Function to calculate meal template totals from ingredients
CREATE OR REPLACE FUNCTION calculate_template_macros(template_uuid UUID)
RETURNS TABLE (
    calories NUMERIC,
    protein NUMERIC,
    carbs NUMERIC,
    fat NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(COALESCE(mti.calories, 0))::NUMERIC,
        SUM(COALESCE(mti.protein, 0))::NUMERIC,
        SUM(COALESCE(mti.carbs, 0))::NUMERIC,
        SUM(COALESCE(mti.fat, 0))::NUMERIC
    FROM meal_template_ingredients mti
    WHERE mti.template_id = template_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate ingredient macros based on quantity
CREATE OR REPLACE FUNCTION calculate_ingredient_macros(
    ingredient_uuid UUID,
    qty NUMERIC,
    unit_name VARCHAR
)
RETURNS TABLE (
    calories NUMERIC,
    protein NUMERIC,
    carbs NUMERIC,
    fat NUMERIC
) AS $$
DECLARE
    ing_record RECORD;
    quantity_in_grams NUMERIC;
BEGIN
    -- Get ingredient data
    SELECT * INTO ing_record
    FROM ingredients_master
    WHERE id = ingredient_uuid;
    
    -- Convert unit to grams (simplified - you can expand this)
    CASE unit_name
        WHEN 'kg' THEN quantity_in_grams := qty * 1000;
        WHEN 'ml' THEN quantity_in_grams := qty; -- Assume density = 1
        WHEN 'piece' THEN quantity_in_grams := qty * COALESCE(ing_record.default_serving_size, 100);
        ELSE quantity_in_grams := qty; -- Default is grams
    END CASE;
    
    -- Calculate macros per 100g
    RETURN QUERY
    SELECT 
        (ing_record.calories_per_100g * quantity_in_grams / 100)::NUMERIC,
        (ing_record.protein_per_100g * quantity_in_grams / 100)::NUMERIC,
        (ing_record.carbs_per_100g * quantity_in_grams / 100)::NUMERIC,
        (ing_record.fat_per_100g * quantity_in_grams / 100)::NUMERIC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_nutrition_protocols_updated_at ON nutrition_protocols;
DROP TRIGGER IF EXISTS update_protocol_phases_updated_at ON protocol_phases;
DROP TRIGGER IF EXISTS update_user_nutrition_plans_updated_at ON user_nutrition_plans;
DROP TRIGGER IF EXISTS update_ingredients_master_updated_at ON ingredients_master;
DROP TRIGGER IF EXISTS update_meal_templates_v2_updated_at ON meal_templates_v2;
DROP TRIGGER IF EXISTS update_meal_template_ingredients_updated_at ON meal_template_ingredients;
DROP TRIGGER IF EXISTS update_daily_meal_plans_v2_updated_at ON daily_meal_plans_v2;
DROP TRIGGER IF EXISTS update_user_meal_logs_updated_at ON user_meal_logs;
DROP TRIGGER IF EXISTS auto_calculate_ingredient_macros ON meal_template_ingredients;
DROP TRIGGER IF EXISTS update_template_totals_on_ingredient_change ON meal_template_ingredients;

CREATE TRIGGER update_nutrition_protocols_updated_at
    BEFORE UPDATE ON nutrition_protocols
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocol_phases_updated_at
    BEFORE UPDATE ON protocol_phases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_nutrition_plans_updated_at
    BEFORE UPDATE ON user_nutrition_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredients_master_updated_at
    BEFORE UPDATE ON ingredients_master
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_templates_v2_updated_at
    BEFORE UPDATE ON meal_templates_v2
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_template_ingredients_updated_at
    BEFORE UPDATE ON meal_template_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_meal_plans_v2_updated_at
    BEFORE UPDATE ON daily_meal_plans_v2
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_meal_logs_updated_at
    BEFORE UPDATE ON user_meal_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-calculate macros when ingredient is added to template
CREATE OR REPLACE FUNCTION trigger_calculate_template_ingredient_macros()
RETURNS TRIGGER AS $$
DECLARE
    macro_data RECORD;
BEGIN
    -- Calculate macros for this ingredient quantity
    SELECT * INTO macro_data
    FROM calculate_ingredient_macros(NEW.ingredient_id, NEW.quantity, NEW.unit);
    
    -- Update the record with calculated values
    NEW.calories := macro_data.calories;
    NEW.protein := macro_data.protein;
    NEW.carbs := macro_data.carbs;
    NEW.fat := macro_data.fat;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_calculate_ingredient_macros
    BEFORE INSERT OR UPDATE ON meal_template_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION trigger_calculate_template_ingredient_macros();

-- Trigger to update template totals when ingredients change
CREATE OR REPLACE FUNCTION trigger_update_template_totals()
RETURNS TRIGGER AS $$
DECLARE
    totals RECORD;
BEGIN
    -- Calculate new totals
    SELECT * INTO totals
    FROM calculate_template_macros(COALESCE(NEW.template_id, OLD.template_id));
    
    -- Update the template
    UPDATE meal_templates_v2
    SET 
        total_calories = totals.calories::INTEGER,
        total_protein = totals.protein,
        total_carbs = totals.carbs,
        total_fat = totals.fat,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.template_id, OLD.template_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_template_totals_on_ingredient_change
    AFTER INSERT OR UPDATE OR DELETE ON meal_template_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_template_totals();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE nutrition_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_templates_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_template_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_meal_plans_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meal_log_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view nutrition protocols" ON nutrition_protocols;
DROP POLICY IF EXISTS "Anyone can view protocol phases" ON protocol_phases;
DROP POLICY IF EXISTS "Users can view their own nutrition plans" ON user_nutrition_plans;
DROP POLICY IF EXISTS "Users can create nutrition plans" ON user_nutrition_plans;
DROP POLICY IF EXISTS "Users can update their nutrition plans" ON user_nutrition_plans;
DROP POLICY IF EXISTS "Users can delete their nutrition plans" ON user_nutrition_plans;
DROP POLICY IF EXISTS "Anyone can view public ingredients" ON ingredients_master;
DROP POLICY IF EXISTS "Users can create ingredients" ON ingredients_master;
DROP POLICY IF EXISTS "Anyone can view public meal templates" ON meal_templates_v2;
DROP POLICY IF EXISTS "Users can create meal templates" ON meal_templates_v2;
DROP POLICY IF EXISTS "Users can update their meal templates" ON meal_templates_v2;
DROP POLICY IF EXISTS "Anyone can view template ingredients" ON meal_template_ingredients;
DROP POLICY IF EXISTS "Anyone can view public meal plans" ON daily_meal_plans_v2;
DROP POLICY IF EXISTS "Anyone can view meal plan items" ON daily_meal_plan_items;
DROP POLICY IF EXISTS "Users can view their own meal logs" ON user_meal_logs;
DROP POLICY IF EXISTS "Users can view their own meal log ingredients" ON user_meal_log_ingredients;
DROP POLICY IF EXISTS "Users can manage their favorites" ON user_favorite_templates;

-- Public read access to nutrition protocols
CREATE POLICY "Anyone can view nutrition protocols"
    ON nutrition_protocols FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view protocol phases"
    ON protocol_phases FOR SELECT
    USING (true);

-- User nutrition plans - private
CREATE POLICY "Users can view their own nutrition plans"
    ON user_nutrition_plans FOR SELECT
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create nutrition plans"
    ON user_nutrition_plans FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their nutrition plans"
    ON user_nutrition_plans FOR UPDATE
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their nutrition plans"
    ON user_nutrition_plans FOR DELETE
    USING (auth.uid()::text = user_id::text);

-- Public read access to ingredients
CREATE POLICY "Anyone can view public ingredients"
    ON ingredients_master FOR SELECT
    USING (is_public = true OR created_by::text = auth.uid()::text);

-- Users can create their own ingredients
CREATE POLICY "Users can create ingredients"
    ON ingredients_master FOR INSERT
    WITH CHECK (auth.uid()::text = created_by::text);

-- Public read access to meal templates
CREATE POLICY "Anyone can view public meal templates"
    ON meal_templates_v2 FOR SELECT
    USING (is_public = true OR created_by::text = auth.uid()::text);

CREATE POLICY "Users can create meal templates"
    ON meal_templates_v2 FOR INSERT
    WITH CHECK (auth.uid()::text = created_by::text);

CREATE POLICY "Users can update their meal templates"
    ON meal_templates_v2 FOR UPDATE
    USING (auth.uid()::text = created_by::text);

-- Template ingredients inherit template permissions
CREATE POLICY "Anyone can view template ingredients"
    ON meal_template_ingredients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM meal_templates_v2 t
            WHERE t.id = template_id 
            AND (t.is_public = true OR t.created_by::text = auth.uid()::text)
        )
    );

-- Daily meal plans - public read
CREATE POLICY "Anyone can view public meal plans"
    ON daily_meal_plans_v2 FOR SELECT
    USING (is_public = true);

CREATE POLICY "Anyone can view meal plan items"
    ON daily_meal_plan_items FOR SELECT
    USING (true);

-- User meal logs - private
CREATE POLICY "Users can view their own meal logs"
    ON user_meal_logs FOR ALL
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own meal log ingredients"
    ON user_meal_log_ingredients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_meal_logs uml
            WHERE uml.id = meal_log_id AND uml.user_id::text = auth.uid()::text
        )
    );

-- Favorites - private
CREATE POLICY "Users can manage their favorites"
    ON user_favorite_templates FOR ALL
    USING (auth.uid()::text = user_id::text);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Nutrition protocols and phases
CREATE INDEX IF NOT EXISTS idx_protocol_phases_protocol_id ON protocol_phases(protocol_id);
CREATE INDEX IF NOT EXISTS idx_user_nutrition_plans_user_id ON user_nutrition_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_nutrition_plans_active ON user_nutrition_plans(user_id, is_active) WHERE is_active = true;

-- Ingredients
CREATE INDEX IF NOT EXISTS idx_ingredients_master_name ON ingredients_master(name);
CREATE INDEX IF NOT EXISTS idx_ingredients_master_category ON ingredients_master(category);
CREATE INDEX IF NOT EXISTS idx_ingredients_master_public ON ingredients_master(is_public);

-- Meal templates
CREATE INDEX IF NOT EXISTS idx_meal_templates_v2_name ON meal_templates_v2(name);
CREATE INDEX IF NOT EXISTS idx_meal_templates_v2_type ON meal_templates_v2(meal_type);
CREATE INDEX IF NOT EXISTS idx_meal_templates_v2_public ON meal_templates_v2(is_public);
CREATE INDEX IF NOT EXISTS idx_meal_templates_v2_tags ON meal_templates_v2 USING GIN(tags);

-- Template ingredients
CREATE INDEX IF NOT EXISTS idx_meal_template_ingredients_template ON meal_template_ingredients(template_id);
CREATE INDEX IF NOT EXISTS idx_meal_template_ingredients_ingredient ON meal_template_ingredients(ingredient_id);

-- Daily meal plans
CREATE INDEX IF NOT EXISTS idx_daily_meal_plans_v2_phase ON daily_meal_plans_v2(phase_id);
CREATE INDEX IF NOT EXISTS idx_daily_meal_plan_items_plan ON daily_meal_plan_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_meal_plan_items_template ON daily_meal_plan_items(template_id);

-- User meal logs
CREATE INDEX IF NOT EXISTS idx_user_meal_logs_user_date ON user_meal_logs(user_id, meal_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_meal_logs_template ON user_meal_logs(template_id);
CREATE INDEX IF NOT EXISTS idx_user_meal_log_ingredients_log ON user_meal_log_ingredients(meal_log_id);

-- Favorites
CREATE INDEX IF NOT EXISTS idx_user_favorite_templates_user ON user_favorite_templates(user_id);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Complete meal template with ingredients
CREATE OR REPLACE VIEW meal_templates_complete AS
SELECT 
    t.id,
    t.name,
    t.description,
    t.meal_type,
    t.total_calories,
    t.total_protein,
    t.total_carbs,
    t.total_fat,
    t.prep_time_minutes,
    t.cook_time_minutes,
    t.servings,
    t.tags,
    t.difficulty_level,
    t.is_public,
    t.is_verified,
    json_agg(
        json_build_object(
            'ingredient_id', i.id,
            'ingredient_name', i.name,
            'quantity', mti.quantity,
            'unit', mti.unit,
            'calories', mti.calories,
            'protein', mti.protein,
            'carbs', mti.carbs,
            'fat', mti.fat,
            'preparation_note', mti.preparation_note,
            'is_optional', mti.is_optional
        ) ORDER BY mti.display_order
    ) as ingredients
FROM meal_templates_v2 t
LEFT JOIN meal_template_ingredients mti ON t.id = mti.template_id
LEFT JOIN ingredients_master i ON mti.ingredient_id = i.id
GROUP BY t.id;

-- View: Daily meal plan with all meals
CREATE OR REPLACE VIEW daily_meal_plans_complete AS
SELECT 
    p.id,
    p.plan_name,
    p.plan_type,
    p.total_calories,
    p.total_protein,
    p.total_carbs,
    p.total_fat,
    ph.phase_name,
    ph.daily_calories as phase_target_calories,
    json_agg(
        json_build_object(
            'meal_time', pi.meal_time,
            'suggested_time', pi.suggested_time,
            'template_id', pi.template_id,
            'template_name', COALESCE(t.name, pi.custom_meal_name),
            'calories', COALESCE(t.total_calories * pi.serving_multiplier, pi.custom_calories),
            'protein', COALESCE(t.total_protein * pi.serving_multiplier, pi.custom_protein),
            'carbs', COALESCE(t.total_carbs * pi.serving_multiplier, pi.custom_carbs),
            'fat', COALESCE(t.total_fat * pi.serving_multiplier, pi.custom_fat),
            'serving_multiplier', pi.serving_multiplier,
            'adjustment_notes', pi.adjustment_notes
        ) ORDER BY pi.display_order
    ) as meals
FROM daily_meal_plans_v2 p
JOIN protocol_phases ph ON p.phase_id = ph.id
LEFT JOIN daily_meal_plan_items pi ON p.id = pi.plan_id
LEFT JOIN meal_templates_v2 t ON pi.template_id = t.id
GROUP BY p.id, ph.phase_name, ph.daily_calories;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE nutrition_protocols IS 'Base nutrition protocol definitions (e.g., Recomposition, Cutting)';
COMMENT ON TABLE protocol_phases IS 'Different phases within a protocol with specific macro targets';
COMMENT ON TABLE user_nutrition_plans IS 'User-specific nutrition plan tracking with personal data';
COMMENT ON TABLE ingredients_master IS 'Master list of all ingredients with nutritional data per 100g';
COMMENT ON TABLE meal_templates_v2 IS 'Meal/recipe templates with computed nutritional totals';
COMMENT ON TABLE meal_template_ingredients IS 'Junction table linking templates to ingredients with quantities';
COMMENT ON TABLE daily_meal_plans_v2 IS 'Complete daily meal plans for nutrition phases';
COMMENT ON TABLE daily_meal_plan_items IS 'Individual meals within a daily plan';
COMMENT ON TABLE user_meal_logs IS 'User''s actual meal consumption logs';
COMMENT ON TABLE user_meal_log_ingredients IS 'Ingredient-level tracking of what user ate';
COMMENT ON TABLE user_favorite_templates IS 'User''s favorite meal templates for quick access';
