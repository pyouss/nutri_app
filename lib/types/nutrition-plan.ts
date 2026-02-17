// Types for nutrition plan system

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

export interface MealTemplateIngredient {
  name: string
  quantity: number
  unit: string // "g", "ml", "piece", etc.
}

export interface MealTemplate {
  id: string
  name: string
  description: string | null
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  ingredients: MealTemplateIngredient[]
  preparation_notes: string | null
  is_public: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface DailyMealPlanItem {
  template_id?: string // Reference to meal_templates
  template_name?: string
  custom_meal?: {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  notes?: string
  adjustments?: string // e.g., "Rajouter 126g de spaghettis"
}

export interface DailyMealPlan {
  id: string
  phase_id: string
  menu_name: string
  menu_type: string | null // "P+", "G+", "L+", null
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  meal_items: DailyMealPlanItem[]
  notes: string | null
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

export interface IngredientLibrary {
  id: string
  name: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  category: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

// API Request/Response types
export interface CreateUserNutritionPlanRequest {
  protocol_id: string
  current_phase_id?: string
  age?: number
  height_cm?: number
  weight_kg?: number
  body_fat_percentage?: number
  notes?: string
}

export interface UpdatePhaseRequest {
  phase_id: string
  notes?: string
}

// Composite types for views
export interface NutritionPlanWithDetails extends UserNutritionPlan {
  protocol: NutritionProtocol
  current_phase: ProtocolPhase | null
}

export interface DailyMealPlanWithPhase extends DailyMealPlan {
  phase: ProtocolPhase
}

export interface ProtocolWithPhases extends NutritionProtocol {
  phases: ProtocolPhase[]
}

// Summary types for dashboard
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
}

export interface WeeklyProgress {
  week_start: string
  week_end: string
  avg_calories: number
  avg_protein: number
  avg_carbs: number
  avg_fat: number
  compliance_rate: number // percentage of days with logged meals
}
