import { useTranslation } from 'react-i18next'
import { Button } from '@/modules/common/components/ui/button'
import { usePwaUpdate } from '@/modules/common/hooks/usePwaUpdate'

export function PwaPrompt() {
  const { t } = useTranslation()
  const { offlineReady, needRefresh, error, updating, update, dismiss } = usePwaUpdate()
  if (!offlineReady && !needRefresh && !error) return null

  return (
    <section className="sticky top-0 z-10 mb-5 rounded-xl border border-input bg-background p-4" aria-label={t('appStatus')}>
      <p className="text-sm leading-relaxed" role="status">
        {t(error || (needRefresh ? 'updateAvailable' : 'offlineReady'))}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {needRefresh && !error && (
          <Button type="button" disabled={updating} onClick={() => { void update() }}>
            {t(updating ? 'updating' : 'update')}
          </Button>
        )}
        <Button type="button" variant="outline" disabled={updating} onClick={dismiss}>
          {t(needRefresh && !error ? 'later' : 'close')}
        </Button>
      </div>
    </section>
  )
}
