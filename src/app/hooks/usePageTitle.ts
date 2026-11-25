import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const usePageTitle = (title: string): void => {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = `${title} — ${t('appName')}`
  }, [title, t])
}
