import '@/modules/common/styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { i18nReady } from '@/modules/common/config/i18n'

const root = document.getElementById('root')!
root.textContent = 'Loading…'
void i18nReady.then(() => {
  createRoot(root).render(<StrictMode><App /></StrictMode>)
}).catch((error: unknown) => {
  console.error('Не удалось загрузить переводы.', error)
  root.textContent = 'Could not load the app. Check your connection and reload.'
})
