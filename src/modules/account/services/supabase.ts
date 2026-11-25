import type { SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/modules/common/config/env'

let client: Promise<SupabaseClient> | undefined

export const getSupabaseClient = (): Promise<SupabaseClient> => {
  const { supabaseUrl, supabasePublishableKey } = env
  if (!supabaseUrl || !supabasePublishableKey) {
    return Promise.reject(new Error('Supabase is not configured'))
  }
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: true, detectSessionInUrl: false },
    }),
  )
  return client
}
