import type { ReactNode } from 'react'
import { UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoutePath } from '@/app/enums/RoutePath'
import { useScrollReset } from '@/app/hooks/useScrollReset'
import { PwaPrompt } from '@/modules/common/components/PwaPrompt'
import type { NavigationItem } from '@/modules/common/types/NavigationItem'

export function AppShell({ path, sections, children }: { path: string; sections: readonly NavigationItem[]; children: ReactNode }) {
  const { t } = useTranslation()
  const main = useScrollReset(path)

  return (
    <div className="grid h-dvh w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-paper min-[481px]:mx-auto min-[481px]:my-4 min-[481px]:h-[calc(100dvh-32px)] min-[481px]:w-[430px] min-[481px]:rounded-[22px] min-[481px]:border min-[481px]:border-line min-[481px]:shadow-shell">
      <header className="flex items-center justify-between gap-2 border-b border-line bg-background px-[clamp(14px,5.3vw,23px)] pt-[calc(10px+env(safe-area-inset-top,0px))] pb-2.5">
        <a className="inline-flex min-h-11 items-center gap-[9px] rounded-[10px] text-base font-[740] tracking-[-.035em]" href={`#${RoutePath.Overview}`}>
          <img className="shrink-0" src="/icons/journal.svg" width="36" height="36" alt="" />
          <span>{t('appName')}</span>
        </a>
        <a className="inline-flex min-h-11 items-center gap-1.5 rounded-[10px] border border-line px-2.5 text-[13px] font-[640] text-primary hover:bg-sage aria-[current=page]:bg-sage" href={`#${RoutePath.Account}`} aria-current={path === RoutePath.Account ? 'page' : undefined}>
          <UserRound size={16} strokeWidth={1.7} /> {t('accountTitle')}
        </a>
      </header>
      <main className="overflow-auto overscroll-y-contain px-[clamp(16px,5.6vw,24px)] pt-[25px] pb-6 focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2" ref={main} tabIndex={0} aria-label={t('mainContent')}>
        <PwaPrompt />
        {children}
      </main>
      <nav className="grid grid-cols-4 border-t border-line bg-background px-2 pt-[5px] pb-[calc(6px+env(safe-area-inset-bottom,0px))]" aria-label={t('mainNavigation')}>
        {sections.map(({ path: href, title, icon: Icon }) => (
          <a className="group grid min-h-[55px] content-center justify-items-center gap-0.5 rounded-[10px] text-[11px] font-[640] text-muted-foreground aria-[current=page]:font-[760] aria-[current=page]:text-primary" key={href} href={`#${href}`} aria-current={path === href ? 'page' : undefined}>
            <span className="grid h-[29px] w-[49px] place-items-center rounded-[20px] group-hover:bg-hover group-aria-[current=page]:bg-selected"><Icon size={20} strokeWidth={1.8} /></span>
            {title}
          </a>
        ))}
      </nav>
    </div>
  )
}
