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
 * Note: In API routes, authentication is handled via Bearer token in Authorization header.
 * The client-side uses localStorage for session persistence.
 * 
 * @returns {SupabaseClient} The Supabase client instance
 * @throws {Error} If environment variables are missing or invalid
 */
function getSupabaseClient(): SupabaseClient {
  validateSupabaseConfig()
  
  // Server-side: Create a fresh client each time (no session persistence needed)
  if (typeof window === 'undefined') {
    return createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  }
  
  // Client-side: Use singleton with localStorage
  if (!supabase) {
    supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  
  return supabase
}

/**
 * Validates that Supabase environment variables are present and correctly formatted.
 * 
 * @throws {Error} If environment variables are missing or invalid format
 */
// validateSupabaseConfig is already defined above

/**
 * Creates an authenticated Supabase client for server-side use with RLS.
 * This client will have the auth context set, allowing RLS policies to work properly.
 * 
 * @param accessToken - The user's access token from Authorization header
 * @returns {SupabaseClient} Authenticated Supabase client with RLS context
 */
function createAuthenticatedClient(accessToken: string): SupabaseClient {
  validateSupabaseConfig()
  
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

// Export the client getter function
export { 
  getSupabaseClient as supabase, 
  createAuthenticatedClient,
  validateSupabaseConfig 
}
