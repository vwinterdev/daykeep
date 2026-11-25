import { sql } from 'drizzle-orm'
import { check, pgPolicy, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { authenticatedRole, authUsers } from 'drizzle-orm/supabase'

export const profiles = pgTable('profiles', {
  id: uuid().primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),
  name: text().notNull(),
}, (table) => {
  const own = sql`(select auth.uid()) = ${table.id}`
  return [
    check('profiles_name_length', sql`char_length(btrim(${table.name})) between 1 and 100`),
    pgPolicy('profiles_read_own', { for: 'select', to: authenticatedRole, using: own }),
    pgPolicy('profiles_insert_own', { for: 'insert', to: authenticatedRole, withCheck: own }),
    pgPolicy('profiles_update_own', { for: 'update', to: authenticatedRole, using: own, withCheck: own }),
  ]
}).enableRLS()
