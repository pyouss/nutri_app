import { z } from 'zod'

export const MealIngredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required').max(255),
  portionSize: z.number().positive('Portion size must be positive'),
  calories: z.number().min(0, 'Calories cannot be negative'),
  protein: z.number().min(0, 'Protein cannot be negative'),
  carbs: z.number().min(0, 'Carbs cannot be negative'),
  fat: z.number().min(0, 'Fat cannot be negative'),
})

export const CreateMealSchema = z.object({
  meal_name: z.string().min(1, 'Meal name is required').max(255),
  meal_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  macro_mode: z.enum(['ingredient-level', 'meal-level']),
  // Conditional validation based on macro_mode
  ingredients: z.array(MealIngredientSchema).optional(),
  total_calories: z.number().min(0).optional(),
  total_protein: z.number().min(0).optional(),
  total_carbs: z.number().min(0).optional(),
  total_fat: z.number().min(0).optional(),
}).refine((data) => {
  if (data.macro_mode === 'ingredient-level') {
    return data.ingredients && data.ingredients.length > 0
  }
  return true
}, {
  message: 'At least one ingredient is required for ingredient-level meals',
  path: ['ingredients'],
}).refine((data) => {
  if (data.macro_mode === 'meal-level') {
    return (
      data.total_calories !== undefined ||
      data.total_protein !== undefined ||
      data.total_carbs !== undefined ||
      data.total_fat !== undefined
    )
  }
  return true
}, {
  message: 'At least one macro value is required for meal-level meals',
  path: ['total_calories'],
})
