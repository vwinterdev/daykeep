import { defineConfig } from 'drizzle-kit'
import config from '../drizzle.config'

const url = process.env.DATABASE_URL?.trim()
if (!url) {
  throw new Error('Укажите DATABASE_URL выбранной базы в db/.env или в окружении команды.')
}

export default defineConfig({ ...config, dbCredentials: { url } })
