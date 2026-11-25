import { CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState, EmptyStateIcon } from '@/modules/common/components/EmptyState'

export default function CalendarPage() {
  const { t } = useTranslation()
  return (
    <EmptyState title={t('calendarEmpty')} description={t('calendarDetail')}>
      <EmptyStateIcon><CalendarDays size={56} strokeWidth={1.15} /></EmptyStateIcon>
    </EmptyState>
  )
}
