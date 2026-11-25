import type { SupabaseClient } from '@supabase/supabase-js'
import { useTranslation } from 'react-i18next'
import { ProfileState } from '@/modules/account/enums/ProfileState'
import { useProfile } from '@/modules/account/hooks/useProfile'
import { Button } from '@/modules/common/components/ui/button'
import { Input } from '@/modules/common/components/ui/input'
import { Label } from '@/modules/common/components/ui/label'
import { isLanguage, Language } from '@/modules/common/enums/Language'
import { isTheme, Theme } from '@/modules/common/enums/Theme'

export function ProfileForm({ api, id, email }: { api: SupabaseClient; id: string; email?: string }) {
  const { t } = useTranslation()
  const { profile, state, busy, error, saved, change, save, signOut, retry } = useProfile(api, id)

  return (
    <section className="rounded-2xl border border-line bg-background p-[18px]">
      <h2 className="text-xl leading-tight font-[720] tracking-[-.025em]">{t('profileTitle')}</h2>
      {email && <p className="mt-2 text-sm leading-[1.55] break-all text-muted-foreground">{email}</p>}
      {state === ProfileState.Loading && <p className="mt-2 text-sm leading-[1.55] text-muted-foreground" role="status">{t('profileLoading')}</p>}
      {state === ProfileState.Failed && <div className="mt-[18px] grid gap-3.5 [&_label]:mb-[7px]">
        <p className="mt-2 text-sm leading-[1.55] text-destructive" role="alert">{t('profileLoadError')}</p>
        <Button variant="outline" onClick={retry} disabled={busy}>{t('retry')}</Button>
      </div>}
      {state === ProfileState.Ready && <form className="mt-[18px] grid gap-3.5 [&_label]:mb-[7px]" onSubmit={save}>
        <div><Label htmlFor="name">{t('name')}</Label><Input id="name" name="name" autoComplete="name" value={profile.name} onChange={(event) => change({ name: event.target.value })} maxLength={100} disabled={busy} /></div>
        <div>
          <Label htmlFor="telegram">{t('telegram')}</Label>
          <Input id="telegram" name="telegram" value={profile.telegramUsername} onChange={(event) => change({ telegramUsername: event.target.value })} pattern="@?[A-Za-z][A-Za-z0-9_]{4,31}" title={t('telegramInvalid')} maxLength={33} aria-describedby="telegram-hint" autoCapitalize="none" spellCheck={false} disabled={busy} />
          <p className="mt-2 text-sm leading-[1.55] text-muted-foreground" id="telegram-hint">{t('telegramHint')}</p>
        </div>
        <div>
          <Label htmlFor="theme">{t('theme')}</Label>
          <select className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-50" id="theme" name="theme" value={profile.theme} disabled={busy} onChange={(event) => { if (isTheme(event.target.value)) change({ theme: event.target.value }) }}>
            {Object.values(Theme).map((theme) => <option key={theme} value={theme}>{t(theme === Theme.Light ? 'lightTheme' : 'darkTheme')}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="language">{t('language')}</Label>
          <select className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-50" id="language" name="language" value={profile.language} disabled={busy} onChange={(event) => { if (isLanguage(event.target.value)) change({ language: event.target.value }) }}>
            {Object.values(Language).map((language) => <option key={language} value={language}>{t(`language_${language}`)}</option>)}
          </select>
        </div>
        <Button type="submit" disabled={busy}>{t(busy ? 'saving' : 'saveProfile')}</Button>
      </form>}
      {saved && <p className="mt-2 text-sm leading-[1.55] text-muted-foreground" role="status">{t('profileSaved')}</p>}
      {error && <p className="mt-2 text-sm leading-[1.55] text-destructive" role="alert">{t(error)}</p>}
      <Button className="mt-5 w-full" variant="outline" onClick={signOut} disabled={busy}>{t('signOut')}</Button>
    </section>
  )
}
