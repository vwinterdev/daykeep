import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/modules/common/components/EmptyState'
import type { NavigationItem } from '@/modules/common/types/NavigationItem'
import { JournalArt } from '@/modules/overview/components/JournalArt'

export default function OverviewPage({ shortcuts }: { shortcuts: readonly NavigationItem[] }) {
  const { t } = useTranslation()
  return (
    <>
      <EmptyState title={t('overviewEmpty')} description={t('overviewDetail')}>
        <JournalArt />
      </EmptyState>
      <section className="mt-[23px]" aria-labelledby="shortcuts-title">
        <h2 className="mb-[9px] text-[15px] font-[710]" id="shortcuts-title">{t('sectionsTitle')}</h2>
        <ul className="m-0 list-none divide-y divide-line border-y border-line p-0">
          {shortcuts.map(({ path, title, description, icon: Icon }) => (
            <li key={path}>
              <a className="flex min-h-[55px] items-center gap-[11px] rounded-lg px-1 py-1.5 hover:bg-hover" href={`#${path}`}>
                <span className="grid size-[35px] shrink-0 place-items-center rounded-[10px] bg-sage text-primary"><Icon size={18} strokeWidth={1.7} /></span>
                <span className="text-sm leading-tight font-[690]">{title}<small className="mt-0.5 block text-xs font-normal text-muted-foreground">{description}</small></span>
                <ChevronRight className="ml-auto shrink-0 text-muted-foreground" size={17} />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
