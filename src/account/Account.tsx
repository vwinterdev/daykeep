import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
let client: Promise<SupabaseClient> | undefined

export default function Account() {
  if (!url || !key) {
    return (
      <section className="account-card">
        <span className="shortcut-icon"><KeyRound size={18} /></span>
        <h2>Подключите Supabase</h2>
        <p>Журнал можно просматривать без аккаунта. Чтобы войти и сохранить имя, задайте адрес проекта и публичный ключ:</p>
        <ul className="config-list"><li><code>VITE_SUPABASE_URL</code></li><li><code>VITE_SUPABASE_PUBLISHABLE_KEY</code></li></ul>
        <p>Локально добавьте их в <code>.env.local</code>, на Vercel — в настройки окружения. Затем примените миграцию из <code>db/migrations</code>. Подробности — в README проекта.</p>
      </section>
    )
  }
  return <ConnectedAccount />
}

function ConnectedAccount() {
  const [supabase, setSupabase] = useState<SupabaseClient>()
  const [session, setSession] = useState<Session | null>()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined
    client ??= import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url!, key!, { auth: { persistSession: true, detectSessionInUrl: false } }),
    )
    client.then((api) => {
      if (!active) return
      const { data } = api.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
      unsubscribe = () => data.subscription.unsubscribe()
      setSupabase(api)
    }).catch(() => { if (active) setFailed(true) })
    return () => { active = false; unsubscribe?.() }
  }, [])

  if (failed) return <p role="alert">Не удалось подключиться к Supabase. Проверьте настройки и обновите страницу.</p>
  if (!supabase || session === undefined) return <p role="status">Проверяем сессию…</p>
  return session
    ? <Profile key={session.user.id} api={supabase} id={session.user.id} email={session.user.email} />
    : <SignIn api={supabase} />
}

function SignIn({ api }: { api: SupabaseClient }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    setError('')
    try {
      const { error } = await api.auth.signInWithPassword({ email: String(form.get('email')).trim(), password: String(form.get('password')) })
      if (error) setError(error.code === 'invalid_credentials'
        ? 'Неверная почта или пароль.'
        : 'Не удалось войти. Проверьте подключение и настройки входа.')
    } catch {
      setError('Не удалось войти. Проверьте подключение и попробуйте ещё раз.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="account-card">
      <h2>Вход в журнал</h2>
      <p>Используйте почту и пароль пользователя Supabase.</p>
      <form className="account-form" onSubmit={submit}>
        <div><Label htmlFor="email">Электронная почта</Label><Input id="email" name="email" type="email" autoComplete="username" required disabled={busy} /></div>
        <div><Label htmlFor="password">Пароль</Label><Input id="password" name="password" type="password" autoComplete="current-password" required disabled={busy} /></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Входим…' : 'Войти'}</Button>
      </form>
    </section>
  )
}

function Profile({ api, id, email }: { api: SupabaseClient; id: string; email?: string }) {
  const [name, setName] = useState('')
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')
  const [attempt, setAttempt] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const abort = new AbortController()
    async function load() {
      try {
        const { data, error } = await api.from('profiles').select('name').eq('id', id).abortSignal(abort.signal).maybeSingle()
        if (abort.signal.aborted) return
        if (error) throw error
        setName(data?.name ?? '')
        setState('ready')
      } catch {
        if (!abort.signal.aborted) setState('failed')
      }
    }
    void load()
    return () => abort.abort()
  }, [api, id, attempt])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = name.trim()
    setSaved(false)
    if (!normalized) { setError('Введите имя.'); return }
    setBusy(true)
    setError('')
    try {
      const { error } = await api.from('profiles').upsert({ id, name: normalized }, { onConflict: 'id' })
      if (error) throw error
      setName(normalized)
      setSaved(true)
    } catch {
      setError('Не удалось сохранить имя. Проверьте подключение и попробуйте ещё раз.')
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    setError('')
    setSaved(false)
    try {
      const { error } = await api.auth.signOut({ scope: 'local' })
      if (error) throw error
    } catch {
      setError('Не удалось выйти. Проверьте подключение и попробуйте ещё раз.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="account-card">
      <h2>Ваш профиль</h2>
      {email && <p className="break-all">{email}</p>}
      {state === 'loading' && <p role="status">Загружаем профиль…</p>}
      {state === 'failed' && <div className="account-form">
        <p className="form-error" role="alert">Не удалось загрузить профиль. Проверьте подключение и применение миграции.</p>
        <Button variant="outline" onClick={() => { setState('loading'); setAttempt(attempt + 1) }} disabled={busy}>Повторить</Button>
      </div>}
      {state === 'ready' && <form className="account-form" onSubmit={save}>
        <div><Label htmlFor="name">Имя</Label><Input id="name" name="name" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); setSaved(false); setError('') }} required maxLength={100} disabled={busy} /></div>
        <Button type="submit" disabled={busy}>Сохранить имя</Button>
      </form>}
      {saved && <p role="status">Имя сохранено.</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <Button className="mt-5 w-full" variant="outline" onClick={signOut} disabled={busy}>Выйти</Button>
    </section>
  )
}
