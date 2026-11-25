import type { SupabaseClient } from '@supabase/supabase-js'
import { useTranslation } from 'react-i18next'
import { useSignIn } from '@/modules/account/hooks/useSignIn'
import { Button } from '@/modules/common/components/ui/button'
import { Input } from '@/modules/common/components/ui/input'
import { Label } from '@/modules/common/components/ui/label'

export function SignInForm({ api }: { api: SupabaseClient }) {
  const { t } = useTranslation()
  const { busy, error, submit } = useSignIn(api)

  return (
    <section className="rounded-2xl border border-line bg-background p-[18px]">
      <h2 className="text-xl leading-tight font-[720] tracking-[-.025em]">{t('signInTitle')}</h2>
      <p className="mt-2 text-sm leading-[1.55] text-muted-foreground">{t('signInDescription')}</p>
      <form className="mt-[18px] grid gap-3.5 [&_label]:mb-[7px]" onSubmit={submit}>
        <div><Label htmlFor="email">{t('email')}</Label><Input id="email" name="email" type="email" autoComplete="username" required disabled={busy} /></div>
        <div><Label htmlFor="password">{t('password')}</Label><Input id="password" name="password" type="password" autoComplete="current-password" required disabled={busy} /></div>
        {error && <p className="mt-2 text-sm leading-[1.55] text-destructive" role="alert">{t(error)}</p>}
        <Button type="submit" disabled={busy}>{t(busy ? 'signingIn' : 'signIn')}</Button>
      </form>
    </section>
  )
}
