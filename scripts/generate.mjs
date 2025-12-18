// Generate the tables using kysely
import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../src/db/dev.db');
const dbDir = dirname(dbPath);

// Ensure directory exists
if (!existsSync(dbDir)) {
	await mkdir(dbDir, { recursive: true });
}

const dialect = new SqliteDialect({
	database: new SQLite(dbPath),
});

const db = new Kysely({ dialect });

await db.schema.createTable('Media').ifNotExists()
	.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
	.addColumn('artUrl', 'text')
	.addColumn('contentRating', 'text')
	.addColumn('duration', 'integer')
	.addColumn('guid', 'text')
	.addColumn('index', 'integer')
	.addColumn('libraryKey', 'text')
	.addColumn('parentIndex', 'integer')
	.addColumn('parentKey', 'text')
	.addColumn('parentRatingKey', 'text')
	.addColumn('parentTheme', 'text')
	.addColumn('parentThumb', 'text')
	.addColumn('parentTitle', 'text')
	.addColumn('rating', 'real')
	.addColumn('ratingKey', 'text')
	.addColumn('releaseDate', 'text')
	.addColumn('summary', 'text')
	.addColumn('thumbUrl', 'text')
	.addColumn('title', 'text')
	.addColumn('type', 'integer', (col) => col.notNull().defaultTo(0))
	.addColumn('year', 'integer')
	.addColumn('serverId', 'integer', (col) =>
		col.references('server.id').onDelete('cascade').notNull(),
	)
	.execute();


// If Media does not have column: releaseDate, add it
try {
	await db.schema.alterTable('Media')
		.addColumn('releaseDate', 'text')
		.execute();
} catch (e) {
	// nothing
}




await db.schema.createTable('Configuration').ifNotExists()
	.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
	.addColumn('tmdbApiKey', 'text')
	.addColumn('fanartApiKey', 'text')
	.addColumn('removeOverlays', 'integer', (col) => col.notNull().defaultTo(0))
	.addColumn('thePosterDbEmail', 'text')
	.addColumn('thePosterDbPassword', 'text')
	.execute();

await db.schema.createTable('Server').ifNotExists()
	.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
	.addColumn('name', 'text')
	.addColumn('url', 'text')
	.addColumn('token', 'text')
	.addColumn('userid', 'text')
	.addColumn('type', 'text')
	.execute();

await db.schema.createTable('Session').ifNotExists()
	.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
	.addColumn('serverId', 'integer')
	.execute()



