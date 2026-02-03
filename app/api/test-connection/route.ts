import { supabase, validateSupabaseConfig } from '@/lib/db/supabase'
import { NextResponse } from 'next/server'

// Mark route as dynamic to avoid build-time execution
export const dynamic = 'force-dynamic'

// Supabase error codes that indicate connection success (table doesn't exist)
const CONNECTION_SUCCESS_ERROR_CODES = ['PGRST116', 'PGRST205'] as const
const CONNECTION_SUCCESS_MESSAGE_KEYWORDS = ['relation', 'does not exist', 'schema cache', 'not found'] as const

// Check if error indicates successful connection (table just doesn't exist)
function isConnectionSuccessError(error: { code?: string; message?: string }): boolean {
  if (error.code && CONNECTION_SUCCESS_ERROR_CODES.includes(error.code as any)) {
    return true
  }
  
  if (error.message) {
    const lowerMessage = error.message.toLowerCase()
    return CONNECTION_SUCCESS_MESSAGE_KEYWORDS.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    )
  }
  
  return false
}

// Sanitize error for production (don't expose sensitive details)
function sanitizeError(error: unknown, isProduction: boolean): {
  message: string
  code?: string
  details?: unknown
} {
  if (isProduction) {
    // In production, only return generic error message
    return {
      message: 'Supabase connection failed. Please check your configuration.',
    }
  }

  // In development, return detailed error information
  let errorMessage = 'Unknown error'
  let errorCode: string | undefined
  let errorDetails: Record<string, unknown> = {}

  if (error instanceof Error) {
    errorMessage = error.message
    if ('code' in error) {
      errorCode = (error as { code?: string }).code
    }
    if ('details' in error) {
      errorDetails.details = (error as { details?: unknown }).details
    }
    if ('hint' in error) {
      errorDetails.hint = (error as { hint?: unknown }).hint
    }
  } else if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>
    errorMessage = String(err.message || err.error || 'Unknown error')
    errorCode = String(err.code || '')
    if (err.details) errorDetails.details = err.details
    if (err.hint) errorDetails.hint = err.hint
  }

  return {
    message: errorMessage,
    code: errorCode,
    ...(Object.keys(errorDetails).length > 0 ? { details: errorDetails } : {}),
  }
}

export async function GET() {
  try {
    // Validate environment variables first
    validateSupabaseConfig()

    // Get Supabase client (validates env vars)
    const client = supabase()

    // Test connection by making a simple query to a non-existent table
    // If we get a Supabase error response, it means connection is working
    // PGRST116 = "relation does not exist"
    // PGRST205 = "table not in schema cache" (also means connection works)
    const { data, error } = await client.from('_test_connection').select('*').limit(1)

    // Check if error is just "table doesn't exist" (which means connection works)
    if (error) {
      if (isConnectionSuccessError(error)) {
        return NextResponse.json(
          {
            success: true,
            message: 'Supabase connection successful',
            note: 'Connection verified (table does not exist, which is expected)',
            timestamp: new Date().toISOString(),
          },
          { status: 200 }
        )
      }
      // Any other error means connection failed
      throw error
    }

    // If no error, connection is working
    return NextResponse.json(
      {
        success: true,
        message: 'Supabase connection successful',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const isProduction = process.env.NODE_ENV === 'production'
    const sanitizedError = sanitizeError(error, isProduction)

    return NextResponse.json(
      {
        success: false,
        message: 'Supabase connection failed',
        error: sanitizedError.message,
        ...(sanitizedError.code ? { code: sanitizedError.code } : {}),
        ...(sanitizedError.details ? { details: sanitizedError.details } : {}),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
