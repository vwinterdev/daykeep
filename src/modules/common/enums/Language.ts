export enum Language {
  English = 'en',
  Tajik = 'tg',
  Russian = 'ru',
}

export const isLanguage = (value: unknown): value is Language =>
  Object.values(Language).some((language) => language === value)
