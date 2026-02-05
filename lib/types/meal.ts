export interface MealIngredient {
  name: string
  portionSize: number // in grams
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Meal {
  id: string
  user_id: string
  meal_name: string
  total_calories: number | null
  total_protein: number | null
  total_carbs: number | null
  total_fat: number | null
  meal_date: string // ISO date string
  ingredients?: MealIngredient[] | null // For ingredient-level meals
  created_at: string
  updated_at: string
}

export interface CreateMealRequest {
  meal_name: string
  meal_date: string // ISO date string
  macro_mode: 'ingredient-level' | 'meal-level'
  // For ingredient-level
  ingredients?: MealIngredient[]
  // For meal-level
  total_calories?: number
  total_protein?: number
  total_carbs?: number
  total_fat?: number
}

export interface CreateMealResponse {
  id: string
  meal_name: string
  meal_date: string
  total_calories: number | null
  total_protein: number | null
  total_carbs: number | null
  total_fat: number | null
  ingredients?: MealIngredient[] | null
  created_at: string
  updated_at: string
}
