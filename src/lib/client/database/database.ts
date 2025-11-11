import { DB } from '@/lib/types'
import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '../../../prisma/dev.db')

const dialect = new SqliteDialect({
  database: new SQLite(dbPath),
})


export const db = new Kysely<DB>({
  dialect,
})