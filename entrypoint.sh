#!/bin/sh
set -e

# Initialize database if it doesn't exist or is empty
if [ ! -f /app/src/db/dev.db ] || [ ! -s /app/src/db/dev.db ]; then
  echo "Initializing database..."
  npm run db:prepare
  npm run db:generate
  echo "Database initialized."
else
  echo "Database already exists, skipping initialization."
fi

# Start the application
exec "$@"