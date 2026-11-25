import { useEffect, useState } from 'react'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { Profile } from '@/modules/account/adapters/Profile'
import { getSupabaseClient } from '@/modules/account/services/supabase'
import { isSupabaseConfigured } from '@/modules/common/config/env'
import { applyPreferences } from '@/modules/common/services/applyPreferences'

export const useAccountSession = () => {
  const [supabase, setSupabase] = useState<SupabaseClient>()
  const [session, setSession] = useState<Session | null>()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true
    let unsubscribe: (() => void) | undefined
    getSupabaseClient().then((api) => {
      if (!active) return
      const { data } = api.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession)
        if (!nextSession) void applyPreferences(new Profile()).catch(console.error)
      })
      unsubscribe = () => data.subscription.unsubscribe()
      setSupabase(api)
    }).catch(() => { if (active) setFailed(true) })
    return () => { active = false; unsubscribe?.() }
  }, [])

  return { supabase, session, failed }
}
