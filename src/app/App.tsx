import { Suspense } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AppShell } from '@/app/components/AppShell'
import { RoutePath } from '@/app/enums/RoutePath'
import { useHashPath } from '@/app/hooks/useHashPath'
import { usePageTitle } from '@/app/hooks/usePageTitle'
import { routes, sectionRoutes } from '@/app/router/routes'
import { ErrorBoundary } from '@/modules/common/components/ErrorBoundary'
import type { NavigationItem } from '@/modules/common/types/NavigationItem'

export function App() {
  const { t } = useTranslation()
  const path = useHashPath()
  const route = routes.find((item) => item.path === path)
  const Page = route?.component
  const title = route ? t(`${route.key}Title`) : t('notFound')
  const sections: NavigationItem[] = sectionRoutes.map(({ path, key, icon }) => ({
    path, icon, title: t(`${key}Title`),
    description: key === 'overview' ? '' : t(`${key}Shortcut`),
  }))
  usePageTitle(title)

  return (
    <AppShell path={path} sections={sections}>
      <div className="mb-[22px]">
        {route && <div className="flex items-center gap-2 text-[13px] font-[650] text-primary"><span className="size-[7px] rounded-full bg-marker" />{t(`${route.key}Note`)}</div>}
        <h1 className="mt-[5px] mb-1 text-[clamp(35px,10vw,42px)] leading-[1.1] font-[740] tracking-[-.055em]">{title}</h1>
        {route && <p className="text-[15px] leading-[1.55] text-muted-foreground">{t(`${route.key}Subtitle`)}</p>}
      </div>
      {Page ? (
        <ErrorBoundary key={path} fallback={<p role="alert">{t('pageOpenError')}</p>}>
          <Suspense fallback={<p role="status">{t('pageLoading')}</p>}>
            <Page shortcuts={sections.slice(1)} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <a className="inline-flex min-h-11 items-center gap-1.5 underline" href={`#${RoutePath.Overview}`}>{t('returnOverview')} <ArrowUpRight size={17} /></a>
      )}
    </AppShell>
  )
}
