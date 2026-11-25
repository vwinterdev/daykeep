import { Component, lazy, Suspense, useEffect, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, CalendarDays, ChevronRight, LayoutGrid, UserRound, UsersRound, Wallet } from 'lucide-react'
import { AppShell } from './AppShell'
import { JournalArt } from './JournalArt'

const Account = lazy(() => import('./account/Account'))

const sections = [
  { path: '/', title: 'Обзор', icon: LayoutGrid, note: 'Ваш рабочий журнал', subtitle: 'Записи, клиенты и оплаты — в одном месте.', empty: 'Пока без записей', detail: 'Здесь появятся ближайшие дела и итоги вашей работы.' },
  { path: '/calendar', title: 'Календарь', icon: CalendarDays, note: 'Рабочее время', subtitle: 'Планируйте работу по дням и часам.', empty: 'Календарь пока пуст', detail: 'Здесь появятся занятые интервалы и предстоящие встречи.' },
  { path: '/clients', title: 'Клиенты', icon: UsersRound, note: 'Контакты', subtitle: 'Держите историю работы с клиентами под рукой.', empty: 'Клиентов пока нет', detail: 'Здесь будут контакты и история работы с каждым клиентом.' },
  { path: '/finances', title: 'Финансы', icon: Wallet, note: 'Расчёты', subtitle: 'Следите за оплатами и остатком к оплате.', empty: 'Оплат пока нет', detail: 'Здесь появятся поступления и суммы, которые вам ещё должны.' },
] as const
const account = { path: '/account', title: 'Аккаунт', icon: UserRound, note: 'Настройки', subtitle: 'Вход и данные вашего профиля.' }

function subscribe(listener: () => void) {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

function getPath() {
  return window.location.hash.slice(1) || '/'
}

class AccountBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed
      ? <p role="alert">Не удалось открыть аккаунт. Проверьте подключение и обновите страницу.</p>
      : this.props.children
  }
}

export function App() {
  const path = useSyncExternalStore(subscribe, getPath)
  const index = sections.findIndex((section) => section.path === path)
  const isAccount = path === account.path
  const section = sections[index] ?? sections[0]
  const missing = !isAccount && index < 0
  const page = isAccount ? account : section
  const title = missing ? 'Раздел не найден' : page.title

  useEffect(() => {
    document.title = `${title} — Деловой журнал`
  }, [title])

  return (
    <AppShell path={path} sections={sections}>
      <div className="page-intro">
        {!missing && <div className="page-kicker"><span />{page.note}</div>}
        <h1>{title}</h1>
        {!missing && <p>{page.subtitle}</p>}
      </div>
      {missing ? (
        <a className="return-link" href="#/">Вернуться в обзор <ArrowUpRight size={17} /></a>
      ) : isAccount ? (
        <AccountBoundary><Suspense fallback={<p role="status">Загружаем аккаунт…</p>}><Account /></Suspense></AccountBoundary>
      ) : (
        <>
          <section className="empty-card" aria-labelledby="empty-title">
            <div className="empty-card__art">
              {index === 0 ? <JournalArt /> : <div className="section-art"><page.icon size={56} strokeWidth={1.15} /></div>}
            </div>
            <div className="empty-card__copy">
              <h2 id="empty-title">{section.empty}</h2>
              <p>{section.detail}</p>
            </div>
          </section>
          {index === 0 && (
            <section className="shortcut-section" aria-labelledby="shortcuts-title">
              <h2 id="shortcuts-title">Разделы журнала</h2>
              <ul className="shortcut-list">
                {sections.slice(1).map(({ path, title, icon: Icon }, i) => (
                  <li key={path}>
                    <a href={`#${path}`}>
                      <span className="shortcut-icon"><Icon size={18} strokeWidth={1.7} /></span>
                      <span className="shortcut-label">{title}<small>{['Интервалы и встречи', 'Контакты и история', 'Оплаты и долги'][i]}</small></span>
                      <ChevronRight className="shortcut-arrow" size={17} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </AppShell>
  )
}
