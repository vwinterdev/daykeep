import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { AuthApi } from '@/modules/account/api/AuthApi'

export const useSignIn = (client: SupabaseClient) => {
  const api = useMemo(() => new AuthApi(client), [client])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    setError('')
    try {
      await api.signIn(String(form.get('email')).trim(), String(form.get('password')))
    } catch (error) {
      setError(error instanceof Error && 'code' in error && error.code === 'invalid_credentials'
        ? 'invalidCredentials' : 'signInError')
    } finally {
      setBusy(false)
    }
  }

  return { busy, error, submit }
}
