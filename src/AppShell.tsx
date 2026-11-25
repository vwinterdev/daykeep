import { useLayoutEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { UserRound } from 'lucide-react'
import { PwaPrompt } from '@/components/PwaPrompt'

type Section = { path: string; title: string; icon: ComponentType<{ size: number; strokeWidth: number }> }

export function AppShell({ path, sections, children }: { path: string; sections: readonly Section[]; children: ReactNode }) {
  const main = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (main.current) main.current.scrollTop = 0
  }, [path])

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="#/">
          <img src="/icons/journal.svg" width="36" height="36" alt="" />
          <span>Деловой журнал</span>
        </a>
        <a className="account-link" href="#/account" aria-current={path === '/account' ? 'page' : undefined}>
          <UserRound size={16} strokeWidth={1.7} /> Аккаунт
        </a>
      </header>
      <main className="app-main" ref={main} tabIndex={0} aria-label="Содержимое раздела">
        <PwaPrompt />
        {children}
      </main>
      <nav className="tab-bar" aria-label="Основная навигация">
        {sections.map(({ path: href, title, icon: Icon }) => (
          <a key={href} href={`#${href}`} aria-current={path === href ? 'page' : undefined}>
            <span className="tab-icon"><Icon size={20} strokeWidth={1.8} /></span>
            {title}
          </a>
        ))}
      </nav>
    </div>
  )
}
