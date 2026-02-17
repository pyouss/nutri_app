import { NextRequest, NextResponse } from 'next/server'
import { supabase, createAuthenticatedClient } from '@/lib/db/supabase'
import { createMeal } from '@/lib/services/meals/createMeal'
import { getMeals } from '@/lib/services/meals/getMeals'
import { CreateMealSchema } from '@/lib/validation/meal'
import { checkRateLimit } from '@/lib/utils/rateLimit'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get('authorization')
    
    // Validate Authorization header format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: { message: 'Unauthorized - Invalid authorization header', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!token || token.trim().length === 0) {
      return NextResponse.json(
        { error: { message: 'Unauthorized - No token provided', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }
    
    // Create authenticated Supabase client with RLS context
    const supabaseClient = createAuthenticatedClient(token)
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized - Invalid token', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    const userId = user.id

    // Rate limiting: 20 meals per minute per user
    const rateLimit = checkRateLimit(userId, {
      maxRequests: 20,
      windowMs: 60 * 1000, // 1 minute
    })

    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: { 
            message: 'Too many requests. Please wait before creating more meals.', 
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
          } 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: { message: 'Invalid JSON in request body', code: 'INVALID_JSON' } },
        { status: 400 }
      )
    }
    const validatedData = CreateMealSchema.parse(body)

    // Create meal using authenticated client (for RLS)
    const meal = await createMeal(supabaseClient, userId, validatedData)

    // Return created meal (201 Created)
    return NextResponse.json({
      id: meal.id,
      meal_name: meal.meal_name,
      meal_date: meal.meal_date,
      total_calories: meal.total_calories,
      total_protein: meal.total_protein,
      total_carbs: meal.total_carbs,
      total_fat: meal.total_fat,
      ingredients: meal.ingredients,
      created_at: meal.created_at,
      updated_at: meal.updated_at,
    }, { status: 201 })

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.issues,
          }
        },
        { status: 400 }
      )
    }

    // Handle other errors
    console.error('Error creating meal:', error)
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to create meal',
          code: 'INTERNAL_ERROR',
        }
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get('authorization')
    
    // Validate Authorization header format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: { message: 'Unauthorized - Invalid authorization header', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!token || token.trim().length === 0) {
      return NextResponse.json(
        { error: { message: 'Unauthorized - No token provided', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }
    
    // Create authenticated Supabase client
    const supabaseClient = createAuthenticatedClient(token)
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized - Invalid token', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    const userId = user.id

    // Get query parameters (for future pagination/filtering)
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    // Get meals for user
    const meals = await getMeals(userId, { limit, offset })

    // Return meals (200 OK)
    return NextResponse.json(meals, { status: 200 })

  } catch (error) {
    console.error('Error fetching meals:', error)
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch meals',
          code: 'INTERNAL_ERROR',
        }
      },
      { status: 500 }
    )
  }
}
