/**
 * Supabase Admin/Service Client for Server-side Operations
 * Tries multiple strategies to bypass RLS:
 * 1. Service role key (best - bypasses RLS completely)
 * 2. Anon key (fallback - may bypass RLS if table policies allow)
 * 3. User context (fallback - subject to RLS policies)
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from './server'

export async function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // Try service role key first (best option)
  if (url && serviceRoleKey) {
    return createSupabaseClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  // Fallback to anon key (may bypass RLS if table allows)
  if (url && anonKey) {
    console.warn('Service role key not configured, using anon key. RLS policies still apply.')
    return createSupabaseClient(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  // Final fallback to user context (subject to RLS)
  console.warn(
    'Could not create admin client. Using user context. ' +
      'This will fail if user does not have proper RLS permissions. ' +
      'For proper server-side access, add SUPABASE_SERVICE_ROLE_KEY to .env.local'
  )
  return await createClient()
}
