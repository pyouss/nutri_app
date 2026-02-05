import type { CreateMealRequest, Meal } from '@/lib/types/meal'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function createMeal(
  supabaseClient: SupabaseClient,
  userId: string,
  data: CreateMealRequest
): Promise<Meal> {
  const { macro_mode, ingredients, ...rest } = data

  // Calculate total macros if ingredient-level
  let totalCalories = null
  let totalProtein = null
  let totalCarbs = null
  let totalFat = null

  if (macro_mode === 'ingredient-level' && ingredients) {
    totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0)
    totalProtein = ingredients.reduce((sum, ing) => sum + ing.protein, 0)
    totalCarbs = ingredients.reduce((sum, ing) => sum + ing.carbs, 0)
    totalFat = ingredients.reduce((sum, ing) => sum + ing.fat, 0)
  } else {
    totalCalories = data.total_calories ?? null
    totalProtein = data.total_protein ?? null
    totalCarbs = data.total_carbs ?? null
    totalFat = data.total_fat ?? null
  }

  // Insert meal into database (using authenticated client with RLS context)
  const { data: meal, error } = await supabaseClient
    .from('meals')
    .insert({
      user_id: userId,
      meal_name: data.meal_name,
      meal_date: data.meal_date,
      total_calories: totalCalories,
      total_protein: totalProtein,
      total_carbs: totalCarbs,
      total_fat: totalFat,
      ingredients: macro_mode === 'ingredient-level' ? ingredients : null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create meal: ${error.message}`)
  }

  return meal as Meal
}
