import { useTranslation } from 'react-i18next'
import { KeyRound } from 'lucide-react'
import { ProfileForm } from '@/modules/account/components/ProfileForm'
import { SignInForm } from '@/modules/account/components/SignInForm'
import { useAccountSession } from '@/modules/account/hooks/useAccountSession'
import { isSupabaseConfigured } from '@/modules/common/config/env'

export default function AccountPage() {
  const { t } = useTranslation()
  const { supabase, session, failed } = useAccountSession()

  if (!isSupabaseConfigured) {
    return (
      <section className="rounded-2xl border border-line bg-background p-[18px]">
        <span className="mb-3 grid size-[35px] shrink-0 place-items-center rounded-[10px] bg-sage text-primary"><KeyRound size={18} /></span>
        <h2 className="text-xl leading-tight font-[720] tracking-[-.025em]">{t('connectSupabase')}</h2>
        <p className="mt-2 text-sm leading-[1.55] text-muted-foreground">{t('configDescription')}</p>
        <ul className="my-[13px] rounded-lg bg-sage p-2.5 text-sm [&_code]:text-[.82em] [&_code]:[overflow-wrap:anywhere]"><li><code>VITE_SUPABASE_URL</code></li><li><code>VITE_SUPABASE_PUBLISHABLE_KEY</code></li></ul>
        <p className="mt-2 text-sm leading-[1.55] text-muted-foreground">{t('configHelp')}</p>
      </section>
    )
  }

  if (failed) return <p role="alert">{t('connectionError')}</p>
  if (!supabase || session === undefined) return <p role="status">{t('checkingSession')}</p>
  return session
    ? <ProfileForm key={session.user.id} api={supabase} id={session.user.id} email={session.user.email} />
    : <SignInForm api={supabase} />
}
