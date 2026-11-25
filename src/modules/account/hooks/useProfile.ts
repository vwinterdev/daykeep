import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Profile } from '@/modules/account/adapters/Profile'
import { AuthApi } from '@/modules/account/api/AuthApi'
import { ProfileApi } from '@/modules/account/api/ProfileApi'
import { ProfileState } from '@/modules/account/enums/ProfileState'
import { applyPreferences } from '@/modules/common/services/applyPreferences'

export const useProfile = (client: SupabaseClient, id: string) => {
  const profileApi = useMemo(() => new ProfileApi(client), [client])
  const authApi = useMemo(() => new AuthApi(client), [client])
  const [profile, setProfile] = useState(() => new Profile())
  const [state, setState] = useState(ProfileState.Loading)
  const [attempt, setAttempt] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const abort = new AbortController()
    const load = async (): Promise<void> => {
      try {
        const loaded = await profileApi.load(id, abort.signal)
        if (abort.signal.aborted) return
        await applyPreferences(loaded)
        if (abort.signal.aborted) return
        setProfile(loaded)
        setState(ProfileState.Ready)
      } catch {
        if (!abort.signal.aborted) setState(ProfileState.Failed)
      }
    }
    void load()
    return () => abort.abort()
  }, [profileApi, id, attempt])

  const change = (patch: Partial<Pick<Profile, 'name' | 'telegramUsername' | 'theme' | 'language'>>): void => {
    setProfile((current) => Object.assign(new Profile(), current, patch))
    setSaved(false)
    setError('')
  }

  const save = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setSaved(false)
    setBusy(true)
    setError('')
    try {
      const updated = await profileApi.save(id, profile)
      setProfile(updated)
      await applyPreferences(updated)
      setSaved(true)
    } catch {
      setError('profileSaveError')
    } finally {
      setBusy(false)
    }
  }

  const signOut = async (): Promise<void> => {
    setBusy(true)
    setError('')
    setSaved(false)
    try {
      await authApi.signOut()
    } catch {
      setError('signOutError')
    } finally {
      setBusy(false)
    }
  }

  const retry = (): void => {
    setState(ProfileState.Loading)
    setAttempt((current) => current + 1)
  }

  return { profile, state, busy, error, saved, change, save, signOut, retry }
}
