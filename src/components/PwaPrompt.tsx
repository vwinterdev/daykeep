import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from './ui/button'

export function PwaPrompt() {
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error: unknown) {
      console.error('Не удалось зарегистрировать service worker.', error)
      setError('Офлайн-режим не включился. Проверьте подключение и обновите страницу.')
    },
  })

  if (!offlineReady && !needRefresh && !error) return null

  async function update() {
    setUpdating(true)
    try {
      await updateServiceWorker(true)
    } catch (error) {
      console.error('Не удалось обновить приложение.', error)
      setError('Не удалось обновить приложение. Проверьте подключение и попробуйте перезагрузить страницу.')
    } finally {
      setUpdating(false)
    }
  }

  function dismiss() {
    setOfflineReady(false)
    setNeedRefresh(false)
    setError('')
  }

  return (
    <section className="sticky top-0 z-10 mb-5 rounded-xl border border-input bg-background p-4" aria-label="Состояние приложения">
      <p className="text-sm leading-relaxed" role="status">
        {error || (needRefresh
          ? 'Доступно обновление. Перед перезагрузкой сохраните изменения во всех вкладках приложения.'
          : 'Приложение готово к работе офлайн. Для входа и работы с профилем нужен интернет.')}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {needRefresh && !error && (
          <Button type="button" disabled={updating} onClick={() => { void update() }}>
            {updating ? 'Обновляем…' : 'Обновить'}
          </Button>
        )}
        <Button type="button" variant="outline" disabled={updating} onClick={dismiss}>
          {needRefresh && !error ? 'Позже' : 'Закрыть'}
        </Button>
      </div>
    </section>
  )
}
