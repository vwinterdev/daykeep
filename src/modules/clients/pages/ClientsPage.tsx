import { UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState, EmptyStateIcon } from '@/modules/common/components/EmptyState'

export default function ClientsPage() {
  const { t } = useTranslation()
  return (
    <EmptyState title={t('clientsEmpty')} description={t('clientsDetail')}>
      <EmptyStateIcon><UsersRound size={56} strokeWidth={1.15} /></EmptyStateIcon>
    </EmptyState>
  )
}
