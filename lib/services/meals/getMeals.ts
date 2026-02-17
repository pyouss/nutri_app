import { supabase } from '@/lib/db/supabase'
import type { Meal } from '@/lib/types/meal'

export interface GetMealsOptions {
  limit?: number
  offset?: number
}

export async function getMeals(
  userId: string,
  options: GetMealsOptions = {}
): Promise<Meal[]> {
  const { limit, offset } = options

  // Get Supabase client
  const supabaseClient = supabase()

  // Query meals for user, ordered by created_at DESC (most recent first)
  let query = supabaseClient
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  // Add pagination if provided
  if (limit) {
    query = query.limit(limit)
  }
  if (offset) {
    query = query.range(offset, offset + (limit || 10) - 1)
  }

  const { data: meals, error } = await query

  if (error) {
    throw new Error(`Failed to fetch meals: ${error.message}`)
  }

  return meals as Meal[]
}
