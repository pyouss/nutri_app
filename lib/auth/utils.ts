import { supabase } from '@/lib/db/supabase'
import { redirect } from 'next/navigation'

/**
 * Get the current authenticated user
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase().auth.getSession()
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    return session?.user ?? null
  } catch (error) {
    console.error('Unexpected error getting user:', error)
    return null
  }
}

/**
 * Get the current session
 * @returns The current session or null if not authenticated
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase().auth.getSession()
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    return session
  } catch (error) {
    console.error('Unexpected error getting session:', error)
    return null
  }
}

/**
 * Require authentication - throws error or redirects if not authenticated
 * Use in server components or API routes
 * @param redirectTo Optional redirect path (default: '/login')
 * @returns The current user (never null if function completes)
 */
export async function requireAuth(redirectTo: string = '/login') {
  const user = await getCurrentUser()
  if (!user) {
    redirect(redirectTo)
  }
  return user
}

/**
 * Check if user is authenticated (client-side)
 * @returns Promise that resolves to true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase().auth.getSession()
    return !!session
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}
