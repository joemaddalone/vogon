//  delete dev.db file if it exist
import { existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../src/prisma/dev.db');

if (existsSync(dbPath)) {
    unlinkSync(dbPath);
}