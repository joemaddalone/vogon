import fs from 'fs';
import path from 'path';

const translationsDir = path.join(process.cwd(), 'src', 'lib', 'i18n', 'en');
const files = fs.readdirSync(translationsDir);

const translations: Record<string, Record<string, string>> = {};

for (const file of files) {
  // Only process .json files
  if (file.endsWith('.json')) {
    const key = path.basename(file, '.json');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    translations[key] = require(`./${file}`);
  }
}

export default translations;
