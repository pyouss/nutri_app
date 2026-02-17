# 🧠 Improved Modular Database Schema - Architecture Guide

## Overview

The new database schema (v2) is a significant improvement over the initial design, focusing on **modularity**, **normalization**, and **smart automation**.

---

## 🎯 Key Improvements

### 1. **Normalized Relational Structure**

**Before (v1)**: JSONB storage of ingredients and meal items
```sql
-- Old approach: Data embedded as JSON
meal_templates (
  ingredients JSONB -- [{name, quantity, calories, ...}]
)
daily_meal_plans (
  meal_items JSONB -- [{template_name, calories, ...}]
)
```

**After (v2)**: Proper relational tables
```sql
-- New approach: Normalized relationships
meal_templates_v2 (id, name, total_calories, ...)
  ↓
meal_template_ingredients (template_id, ingredient_id, quantity)
  ↓
ingredients_master (id, name, calories_per_100g, ...)

daily_meal_plans_v2 (id, plan_name, ...)
  ↓
daily_meal_plan_items (plan_id, template_id, meal_time, ...)
  ↓
meal_templates_v2 (id, name, ...)
```

**Benefits**:
- ✅ Can query ingredients individually
- ✅ Update ingredient data once, affects all templates
- ✅ Better indexing and performance
- ✅ Referential integrity with foreign keys
- ✅ Easier to build features like "ingredient search" or "allergen filtering"

---

### 2. **Automatic Macro Calculation**

**Before**: Manual calculation required
```typescript
// Had to manually calculate and store macros
const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0)
```

**After**: Database triggers auto-calculate
```sql
-- Triggers automatically compute macros when ingredients change
CREATE TRIGGER auto_calculate_ingredient_macros ...
CREATE TRIGGER update_template_totals_on_ingredient_change ...
```

**Benefits**:
- ✅ Always accurate - no stale data
- ✅ No manual recalculation needed
- ✅ Update ingredient once, all templates update
- ✅ Less code in application layer

---

### 3. **Single Source of Truth for Ingredients**

**Before**: Two separate tables (`ingredients` and `ingredient_library`)

**After**: One consolidated `ingredients_master` table

**Benefits**:
- ✅ No confusion about which table to use
- ✅ Public and private ingredients in one place
- ✅ Better data consistency
- ✅ Easier to maintain

---

### 4. **Enhanced Meal Templates**

**New fields added**:
```typescript
{
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  cuisine_type: string // 'french', 'italian', etc.
  prep_time_minutes: number
  cook_time_minutes: number
  servings: number
  tags: string[] // ['high-protein', 'quick', 'vegetarian']
  difficulty_level: 'easy' | 'medium' | 'hard'
  is_verified: boolean // Verified by nutritionist
  version: number // Support for template updates
  parent_template_id: UUID // Track template inheritance
}
```

**Benefits**:
- ✅ Better filtering and search
- ✅ Can sort by prep time, difficulty
- ✅ Track template versions (clone and modify)
- ✅ More user-friendly display

---

### 5. **Smarter Daily Meal Plans**

**Before**: Array of items in JSONB

**After**: Proper junction table with rich data
```sql
daily_meal_plan_items (
  template_id,         -- Link to actual template
  meal_time,           -- 'breakfast', 'lunch', 'dinner'
  suggested_time,      -- '08:00', '13:00'
  serving_multiplier,  -- 1.5x the recipe
  adjustment_notes,    -- "Add 126g more pasta"
  display_order        -- Order in the day
)
```

**Benefits**:
- ✅ Schedule meals throughout the day
- ✅ Easy portion adjustments (1.5x, 2x)
- ✅ Better UI presentation
- ✅ Can query "all breakfast meals" efficiently

---

### 6. **Improved Meal Logging**

**New `user_meal_logs` table** replaces old `meals`:

```sql
user_meal_logs (
  meal_date,
  meal_time,              -- Actual time logged
  meal_type,              -- breakfast/lunch/dinner
  template_id,            -- Link to template if used
  plan_item_id,           -- Link to plan if following one
  serving_multiplier,     -- Adjusted portion
  satisfaction_rating,    -- 1-5 stars
  notes
)
```

**Companion table for detailed tracking**:
```sql
user_meal_log_ingredients (
  meal_log_id,
  ingredient_id,
  quantity,
  unit
)
```

**Benefits**:
- ✅ Track which meals came from templates vs custom
- ✅ Store satisfaction ratings for personalization
- ✅ Ingredient-level tracking (detailed analytics)
- ✅ Better compliance tracking

---

### 7. **Favorites System**

New `user_favorite_templates` table:
```sql
user_favorite_templates (
  user_id,
  template_id,
  custom_name,        -- User can rename
  frequency_count,    -- How often logged
  last_logged_at
)
```

**Benefits**:
- ✅ Quick access to frequently used meals
- ✅ Personalized recommendations
- ✅ Track eating patterns

---

### 8. **Better Ingredient Management**

Enhanced `ingredients_master`:
```sql
{
  category: 'protein' | 'carbs' | 'vegetables' | ...
  default_unit: 'g' | 'ml' | 'piece'
  default_serving_size: number
  fiber_per_100g: number
  brand: string  -- For branded items
}
```

**Benefits**:
- ✅ Categorize ingredients
- ✅ Support different units properly
- ✅ Track fiber (important for nutrition)
- ✅ Brand-specific items (e.g., "Uncle Ben's Rice")

---

## 📊 Architecture Comparison

### Schema v1 (Original)
```
nutrition_protocols
  ↓
protocol_phases
  ↓
meal_templates [ingredients: JSONB]
  ↓
daily_meal_plans [meal_items: JSONB]
  ↓
user_nutrition_plans
```

### Schema v2 (Improved)
```
nutrition_protocols
  ↓
protocol_phases
  ↓
daily_meal_plans_v2
  ↓
daily_meal_plan_items ←→ meal_templates_v2
                            ↓
                      meal_template_ingredients
                            ↓
                      ingredients_master

user_nutrition_plans
  ↓
user_meal_logs ←→ meal_templates_v2
  ↓
user_meal_log_ingredients ←→ ingredients_master
  ↓
user_favorite_templates
```

**Notice**:
- More tables, but each has a single responsibility
- Clear relationships between entities
- No duplicate data
- Easy to extend with new features

---

## 🚀 Smart Features Enabled

### 1. **Automatic Macro Recalculation**
When you update an ingredient's nutritional data, **all templates using it automatically update**.

Example:
```sql
-- Update chicken protein content
UPDATE ingredients_master 
SET protein_per_100g = 24 
WHERE name = 'Blanc de poulet';

-- All templates with chicken instantly have updated totals! ✨
```

### 2. **Flexible Unit Conversion**
The `calculate_ingredient_macros()` function handles unit conversions:
```sql
-- Calculate macros for different units
SELECT * FROM calculate_ingredient_macros(
  'ingredient-uuid', 
  200,  -- quantity
  'g'   -- unit
);
-- Returns: {calories, protein, carbs, fat}
```

### 3. **Template Versioning**
Clone and modify templates without losing the original:
```sql
meal_templates_v2 (
  version: 2,
  parent_template_id: 'original-template-id'
)
```

### 4. **Ingredient Usage Analytics**
Query which ingredients are most used:
```sql
SELECT 
  i.name,
  COUNT(DISTINCT mti.template_id) as templates_count,
  COUNT(DISTINCT uml.id) as times_logged
FROM ingredients_master i
JOIN meal_template_ingredients mti ON i.id = mti.ingredient_id
LEFT JOIN user_meal_log_ingredients umli ON i.id = umli.ingredient_id
LEFT JOIN user_meal_logs uml ON umli.meal_log_id = uml.id
WHERE uml.user_id = 'user-id'
GROUP BY i.name
ORDER BY times_logged DESC;
```

### 5. **Meal Time Optimization**
Suggest meals based on time of day:
```sql
SELECT * FROM daily_meal_plan_items
WHERE meal_time = 'breakfast'
  AND suggested_time BETWEEN '07:00' AND '10:00';
```

### 6. **Portion Adjustment**
Easily scale recipes:
```sql
-- Log 1.5x serving of a template
INSERT INTO user_meal_logs (
  template_id,
  serving_multiplier: 1.5,
  total_calories: template.total_calories * 1.5,
  ...
)
```

---

## 🎯 Modularity Benefits

### 1. **Separation of Concerns**
Each table has **one clear responsibility**:
- `ingredients_master`: Ingredient data
- `meal_templates_v2`: Recipe metadata
- `meal_template_ingredients`: Recipe composition
- `daily_meal_plans_v2`: Plan metadata
- `daily_meal_plan_items`: Plan composition

### 2. **Easy to Extend**
Add new features without breaking existing ones:
- Add `allergens` table → Link to ingredients
- Add `meal_template_reviews` table → User ratings
- Add `shopping_lists` table → Generated from plans
- Add `meal_prep_schedules` table → Weekly prep plans

### 3. **Better Testing**
Test each component independently:
- Test ingredient calculations
- Test template creation
- Test plan generation
- Each module is isolated

### 4. **Performance Optimization**
- Index specific columns that need it
- Query only what you need (no parsing JSONB)
- Join only relevant tables
- Cache frequently used data

---

## 🔄 Migration Path

### Option A: Fresh Start (Recommended for development)
1. Drop old tables (v1)
2. Apply new schema (006_improved_nutrition_schema.sql)
3. Run new import script (import-nutrition-plan-v2)

### Option B: Gradual Migration (For production with existing data)
1. Keep v1 tables running
2. Create v2 tables alongside
3. Migrate data gradually
4. Update app to use v2
5. Deprecate v1 tables

---

## 📈 Performance Comparison

### Query: "Get all templates with chicken"

**v1 (JSONB)**:
```sql
SELECT * FROM meal_templates
WHERE ingredients::text LIKE '%poulet%';
-- ❌ Slow: Full table scan with text search
```

**v2 (Normalized)**:
```sql
SELECT DISTINCT t.*
FROM meal_templates_v2 t
JOIN meal_template_ingredients mti ON t.id = mti.template_id
JOIN ingredients_master i ON mti.ingredient_id = i.id
WHERE i.name LIKE '%poulet%';
-- ✅ Fast: Uses indexes on foreign keys
```

### Query: "Calculate daily macros for user"

**v1**: Parse JSONB, sum manually in application
**v2**: Simple aggregation with indexed columns

```sql
SELECT 
  meal_date,
  SUM(total_calories) as calories,
  SUM(total_protein) as protein,
  SUM(total_carbs) as carbs,
  SUM(total_fat) as fat
FROM user_meal_logs
WHERE user_id = 'user-id'
  AND meal_date = CURRENT_DATE
GROUP BY meal_date;
-- ✅ Very fast with proper indexes
```

---

## 🎨 UI/UX Improvements Enabled

### 1. **Ingredient Search & Filter**
```typescript
// Search for recipes by ingredient
GET /api/templates?ingredient=chicken&meal_type=lunch
// Only possible with normalized ingredients!
```

### 2. **Smart Suggestions**
```typescript
// "Users who logged this also logged..."
// Based on meal_log patterns
```

### 3. **Prep Time Filter**
```typescript
// Show only quick meals (< 15 min prep)
GET /api/templates?max_prep_time=15
```

### 4. **Difficulty Progression**
```typescript
// Start with easy, progress to medium/hard
// Track user's cooking skill level
```

### 5. **Favorite Templates**
```typescript
// Quick access to frequently logged meals
GET /api/favorites?sort=frequency_count
```

---

## 🧪 Data Integrity Features

### 1. **Foreign Key Constraints**
- Can't delete ingredient if used in templates
- Can't delete template if used in logs
- Referential integrity enforced

### 2. **Check Constraints**
```sql
CONSTRAINT must_have_meal CHECK (
  template_id IS NOT NULL OR 
  custom_meal_name IS NOT NULL
)
```

### 3. **Unique Constraints**
```sql
UNIQUE(template_id, ingredient_id)
-- Prevent duplicate ingredients in template
```

### 4. **Automatic Timestamps**
- `created_at` auto-set on insert
- `updated_at` auto-updated via trigger

---

## 📝 Summary

### What Makes It Smarter?

1. **🔄 Self-Updating**: Macros recalculate automatically
2. **🎯 Precise**: No data duplication, single source of truth
3. **🚀 Performant**: Proper indexes, efficient queries
4. **🧩 Modular**: Each table has one clear purpose
5. **📊 Queryable**: Can analyze data in powerful ways
6. **🔒 Safe**: Enforced data integrity
7. **🌱 Extensible**: Easy to add new features
8. **👤 User-Focused**: Favorites, ratings, personalization

### Better Logic Through:

- **Triggers**: Auto-calculate derived data
- **Functions**: Reusable calculation logic
- **Views**: Pre-joined data for common queries
- **Constraints**: Enforce business rules at DB level
- **Indexes**: Fast lookups and queries

---

## 🎓 Learning Resources

### Normalization
- [Database Normalization Explained](https://en.wikipedia.org/wiki/Database_normalization)
- Achieved: 3NF (Third Normal Form)

### Design Patterns
- Repository Pattern (via junction tables)
- Observer Pattern (via triggers)
- Strategy Pattern (via template inheritance)

### Best Practices Applied
- ✅ Don't use JSONB for relational data
- ✅ Use foreign keys for referential integrity
- ✅ Let database do calculations (triggers)
- ✅ Index frequently queried columns
- ✅ One table = one entity type
- ✅ Use views for complex queries

---

## 🚀 Next Steps

1. **Apply Migration**: Run `006_improved_nutrition_schema.sql`
2. **Import Data**: Run `npm run import:nutrition-plan-v2`
3. **Update UI**: Use new types from `nutrition-plan-v2.ts`
4. **Test Queries**: Verify auto-calculation works
5. **Add Features**: Leverage the modular structure

The new schema is ready for production use and can scale to thousands of users and recipes! 🎉
