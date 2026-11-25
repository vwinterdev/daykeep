import { isLanguage, Language } from '@/modules/common/enums/Language'
import { isTheme, Theme } from '@/modules/common/enums/Theme'

export interface ProfileRaw {
  name?: string | null
  telegram_username?: string | null
  theme?: Theme | null
  language?: Language | null
}

export const telegramUsernamePattern = /^[A-Za-z][A-Za-z0-9_]{4,31}$/

export class Profile {
  constructor(
    public name = '',
    public telegramUsername = '',
    public theme = Theme.Light,
    public language = Language.English,
  ) {}

  static fromRaw(raw: unknown): Profile {
    if (raw == null) return new Profile()
    if (typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid profile')
    const data = raw as Record<string, unknown>
    return new Profile(
      typeof data.name === 'string' ? data.name : '',
      typeof data.telegram_username === 'string' ? data.telegram_username : '',
      isTheme(data.theme) ? data.theme : Theme.Light,
      isLanguage(data.language) ? data.language : Language.English,
    )
  }

  toRaw(): ProfileRaw {
    const name = this.name.trim()
    const telegramUsername = this.telegramUsername.trim().replace(/^@/, '').toLowerCase()
    if (name.length > 100 || (telegramUsername && !telegramUsernamePattern.test(telegramUsername)) ||
        !isTheme(this.theme) || !isLanguage(this.language)) {
      throw new Error('Invalid profile settings')
    }
    return {
      name: name || null,
      telegram_username: telegramUsername || null,
      theme: this.theme,
      language: this.language,
    }
  }
}
