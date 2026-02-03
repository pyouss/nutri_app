import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Helper function to validate environment variables format
function validateSupabaseConfig(): void {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.\n' +
        'Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  // Validate URL format
  try {
    const url = new URL(supabaseUrl)
    if (url.protocol !== 'https:') {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL must use HTTPS protocol')
    }
    if (!url.hostname.includes('.supabase.co')) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase project URL')
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    }
    throw error
  }

  // Validate anon key format (should be a JWT)
  if (!supabaseAnonKey.startsWith('eyJ')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (should start with "eyJ" for JWT format)')
  }
  if (supabaseAnonKey.split('.').length !== 3) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (JWT should have 3 parts separated by dots)')
  }
}

// Create client only if environment variables are available
// This allows the module to be imported during build without errors
// TODO: Add database type definitions in Story 1.3 for full type safety
let supabase: SupabaseClient | null = null

/**
 * Gets the Supabase client instance (singleton pattern).
 * Validates environment variables and creates client on first call.
 * 
 * @returns {SupabaseClient} The Supabase client instance
 * @throws {Error} If environment variables are missing or invalid
 */
function getSupabaseClient(): SupabaseClient {
  validateSupabaseConfig()
  
  if (!supabase) {
    supabase = createClient(supabaseUrl!, supabaseAnonKey!)
  }
  
  return supabase
}

/**
 * Validates that Supabase environment variables are present and correctly formatted.
 * 
 * @throws {Error} If environment variables are missing or invalid format
 */
// validateSupabaseConfig is already defined above

// Export the client getter function
export { getSupabaseClient as supabase, validateSupabaseConfig }
