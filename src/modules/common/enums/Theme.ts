export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export const isTheme = (value: unknown): value is Theme =>
  Object.values(Theme).some((theme) => theme === value)
