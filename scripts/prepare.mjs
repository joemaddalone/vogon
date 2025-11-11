// create an empty dev.db file if it doesn't exist
import { writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../src/prisma/dev.db');

if (!existsSync(dbPath)) {
    await writeFile(dbPath, '');
}