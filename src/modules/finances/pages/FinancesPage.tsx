import { Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState, EmptyStateIcon } from '@/modules/common/components/EmptyState'

export default function FinancesPage() {
  const { t } = useTranslation()
  return (
    <EmptyState title={t('financesEmpty')} description={t('financesDetail')}>
      <EmptyStateIcon><Wallet size={56} strokeWidth={1.15} /></EmptyStateIcon>
    </EmptyState>
  )
}
