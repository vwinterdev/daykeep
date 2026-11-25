import { sql } from 'drizzle-orm'
import { check, pgEnum, pgPolicy, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { authenticatedRole, authUsers } from 'drizzle-orm/supabase'

export const profileTheme = pgEnum('profile_theme', ['light', 'dark'])
export const profileLanguage = pgEnum('profile_language', ['en', 'tg', 'ru'])

export const profiles = pgTable('profiles', {
  id: uuid().primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),
  // Настройки nullable, дефолты задаёт адаптер на фронтенде.
  name: text(),
  telegramUsername: text('telegram_username'),
  theme: profileTheme(),
  language: profileLanguage(),
}, (table) => {
  const own = sql`(select auth.uid()) = ${table.id}`
  return [
    check('profiles_name_length', sql`char_length(btrim(${table.name})) between 1 and 100`),
    check('profiles_telegram_username', sql`${table.telegramUsername} ~ '^[A-Za-z][A-Za-z0-9_]{4,31}$'`),
    pgPolicy('profiles_own', { for: 'all', to: authenticatedRole, using: own, withCheck: own }),
  ]
}).enableRLS()
