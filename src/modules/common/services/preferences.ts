import { isLanguage, Language } from '@/modules/common/enums/Language'
import { isTheme, Theme } from '@/modules/common/enums/Theme'
import type { Preferences } from '@/modules/common/types/Preferences'
const storageKey = 'journal.preferences'

export const readPreferences = (): Preferences => {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
    const data = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {}
    return {
      theme: isTheme(data.theme) ? data.theme : Theme.Light,
      language: isLanguage(data.language) ? data.language : Language.English,
    }
  } catch {
    return { theme: Theme.Light, language: Language.English }
  }
}

export const applyTheme = (theme: Theme): void => {
  document.documentElement.classList.toggle('dark', theme === Theme.Dark)
  const color = getComputedStyle(document.documentElement).getPropertyValue('--theme-paper').trim()
  if (color) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
}

export const storePreferences = ({ theme, language }: Preferences): void => {
  applyTheme(theme)
  try {
    // Только оформление, без имени, Telegram и других данных профиля.
    localStorage.setItem(storageKey, JSON.stringify({ theme, language }))
  } catch {
    // Недоступное хранилище не должно мешать настройкам текущей сессии.
  }
}
