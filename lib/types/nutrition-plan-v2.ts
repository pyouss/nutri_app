// Improved types for modular nutrition plan system

// ============================================================================
// INGREDIENTS
// ============================================================================

export interface IngredientMaster {
  id: string
  name: string
  category: 'protein' | 'carbs' | 'vegetables' | 'dairy' | 'fats' | 'fruits' | 'grains' | string | null
  
  // Nutritional data per 100g
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  fiber_per_100g: number | null
  
  // Metadata
  default_unit: string // 'g', 'ml', 'piece', 'cup', 'tbsp'
  default_serving_size: number | null
  brand: string | null
  
  // Visibility
  is_public: boolean
  created_by: string | null
  
  created_at: string
  updated_at: string
}

export interface CreateIngredientRequest {
  name: string
  category?: string
  calories_per_100g: number
  protein_per_100g?: number
  carbs_per_100g?: number
  fat_per_100g?: number
  fiber_per_100g?: number
  default_unit?: string
  default_serving_size?: number
  brand?: string
}

// ============================================================================
// MEAL TEMPLATES
// ============================================================================

export interface MealTemplateV2 {
  id: string
  name: string
  description: string | null
  
  // Classification
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout' | 'post-workout' | string | null
  cuisine_type: string | null
  
  // Calculated totals (auto-computed from ingredients)
  total_calories: number | null
  total_protein: number | null
  total_carbs: number | null
  total_fat: number | null
  total_fiber: number | null
  
  // Preparation
  prep_time_minutes: number | null
  cook_time_minutes: number | null
  servings: number
  preparation_notes: string | null
  cooking_instructions: string | null
  
  // Tagging
  tags: string[] | null
  difficulty_level: 'easy' | 'medium' | 'hard' | null
  
  // Visibility
  is_public: boolean
  is_verified: boolean
  created_by: string | null
  
  // Version control
  version: number
  parent_template_id: string | null
  
  created_at: string
  updated_at: string
}

export interface MealTemplateIngredient {
  id: string
  template_id: string
  ingredient_id: string
  
  // Quantity
  quantity: number
  unit: string
  
  // Calculated macros for this quantity
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  
  // Notes
  preparation_note: string | null // "cooked", "diced", "raw"
  is_optional: boolean
  display_order: number
  
  created_at: string
  updated_at: string
}

// Template with ingredients embedded
export interface MealTemplateComplete extends MealTemplateV2 {
  ingredients: Array<{
    ingredient_id: string
    ingredient_name: string
    quantity: number
    unit: string
    calories: number
    protein: number
    carbs: number
    fat: number
    preparation_note: string | null
    is_optional: boolean
  }>
}

export interface CreateMealTemplateRequest {
  name: string
  description?: string
  meal_type?: string
  cuisine_type?: string
  prep_time_minutes?: number
  cook_time_minutes?: number
  servings?: number
  preparation_notes?: string
  cooking_instructions?: string
  tags?: string[]
  difficulty_level?: 'easy' | 'medium' | 'hard'
  ingredients: Array<{
    ingredient_id: string
    quantity: number
    unit: string
    preparation_note?: string
    is_optional?: boolean
    display_order?: number
  }>
}

// ============================================================================
// DAILY MEAL PLANS
// ============================================================================

export interface DailyMealPlanV2 {
  id: string
  phase_id: string
  plan_name: string
  plan_type: 'P+' | 'G+' | 'L+' | 'balanced' | string | null
  
  // Target macros
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  
  // Metadata
  difficulty_level: 'easy' | 'medium' | 'hard' | null
  prep_required: string | null
  notes: string | null
  
  // Visibility
  is_public: boolean
  created_by: string | null
  
  created_at: string
  updated_at: string
}

export interface DailyMealPlanItem {
  id: string
  plan_id: string
  
  // Either template or custom
  template_id: string | null
  custom_meal_name: string | null
  custom_calories: number | null
  custom_protein: number | null
  custom_carbs: number | null
  custom_fat: number | null
  
  // Timing
  meal_time: 'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner' | 'snack3' | string
  suggested_time: string | null // HH:MM format
  
  // Adjustments
  serving_multiplier: number
  adjustment_notes: string | null
  display_order: number
  
  created_at: string
}

// Complete plan with meals
export interface DailyMealPlanComplete extends DailyMealPlanV2 {
  phase_name: string
  phase_target_calories: number
  meals: Array<{
    meal_time: string
    suggested_time: string | null
    template_id: string | null
    template_name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    serving_multiplier: number
    adjustment_notes: string | null
  }>
}

export interface CreateDailyMealPlanRequest {
  phase_id: string
  plan_name: string
  plan_type?: string
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  difficulty_level?: 'easy' | 'medium' | 'hard'
  prep_required?: string
  notes?: string
  meals: Array<{
    template_id?: string
    custom_meal_name?: string
    custom_calories?: number
    custom_protein?: number
    custom_carbs?: number
    custom_fat?: number
    meal_time: string
    suggested_time?: string
    serving_multiplier?: number
    adjustment_notes?: string
    display_order?: number
  }>
}

// ============================================================================
// USER MEAL LOGS
// ============================================================================

export interface UserMealLog {
  id: string
  user_id: string
  
  // Meal info
  meal_name: string
  meal_date: string
  meal_time: string | null
  meal_type: string | null
  
  // Source
  template_id: string | null
  plan_item_id: string | null
  
  // Nutritional totals
  total_calories: number
  total_protein: number | null
  total_carbs: number | null
  total_fat: number | null
  
  // Adjustments
  serving_multiplier: number
  
  // User feedback
  notes: string | null
  satisfaction_rating: number | null // 1-5
  
  created_at: string
  updated_at: string
}

export interface UserMealLogIngredient {
  id: string
  meal_log_id: string
  ingredient_id: string
  
  quantity: number
  unit: string
  
  // Calculated
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  
  created_at: string
}

export interface CreateUserMealLogRequest {
  meal_name: string
  meal_date: string
  meal_time?: string
  meal_type?: string
  template_id?: string
  plan_item_id?: string
  total_calories: number
  total_protein?: number
  total_carbs?: number
  total_fat?: number
  serving_multiplier?: number
  notes?: string
  satisfaction_rating?: number
  ingredients?: Array<{
    ingredient_id: string
    quantity: number
    unit: string
  }>
}

// ============================================================================
// USER FAVORITES
// ============================================================================

export interface UserFavoriteTemplate {
  id: string
  user_id: string
  template_id: string
  custom_name: string | null
  notes: string | null
  frequency_count: number
  last_logged_at: string | null
  created_at: string
}

// ============================================================================
// NUTRITION PROTOCOLS (from previous schema)
// ============================================================================

export interface NutritionProtocol {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface ProtocolPhase {
  id: string
  protocol_id: string
  phase_name: string
  daily_calories: number
  target_protein: number
  target_carbs: number
  target_fat: number
  phase_order: number
  created_at: string
  updated_at: string
}

export interface UserNutritionPlan {
  id: string
  user_id: string
  protocol_id: string
  current_phase_id: string | null
  age: number | null
  height_cm: number | null
  weight_kg: number | null
  body_fat_percentage: number | null
  start_date: string
  current_phase_start_date: string | null
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// ANALYTICS & SUMMARIES
// ============================================================================

export interface DailyMacroSummary {
  date: string
  target_calories: number
  target_protein: number
  target_carbs: number
  target_fat: number
  actual_calories: number
  actual_protein: number
  actual_carbs: number
  actual_fat: number
  meals_logged: number
  compliance_percentage: number
}

export interface WeeklyProgress {
  week_start: string
  week_end: string
  avg_calories: number
  avg_protein: number
  avg_carbs: number
  avg_fat: number
  days_logged: number
  compliance_rate: number
}

export interface IngredientUsageStats {
  ingredient_id: string
  ingredient_name: string
  times_used: number
  total_quantity: number
  unit: string
  last_used: string
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type MacroCalculationResult = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type MealTimeType = 
  | 'breakfast'
  | 'snack1'
  | 'lunch'
  | 'snack2'
  | 'dinner'
  | 'snack3'
  | 'pre-workout'
  | 'post-workout'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export type MealPlanType = 'P+' | 'G+' | 'L+' | 'balanced'

export type IngredientCategory = 
  | 'protein'
  | 'carbs'
  | 'vegetables'
  | 'dairy'
  | 'fats'
  | 'fruits'
  | 'grains'
  | 'condiments'
  | 'beverages'
