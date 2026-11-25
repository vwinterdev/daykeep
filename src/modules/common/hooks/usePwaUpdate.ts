import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export const usePwaUpdate = () => {
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error: unknown) {
      console.error('Не удалось зарегистрировать service worker.', error)
      setError('offlineError')
    },
  })

  const update = async (): Promise<void> => {
    setUpdating(true)
    try {
      await updateServiceWorker(true)
    } catch (error) {
      console.error('Не удалось обновить приложение.', error)
      setError('updateError')
    } finally {
      setUpdating(false)
    }
  }

  const dismiss = (): void => {
    setOfflineReady(false)
    setNeedRefresh(false)
    setError('')
  }

  return { offlineReady, needRefresh, error, updating, update, dismiss }
}
