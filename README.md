## vogon

This application connects to a Plex Media Server, imports movie and TV show libraries, and lets you replace poster artwork with alternatives from TMDB, Fanart.tv, and other sources.

## Getting Started

1. Install dependencies: `npm install`
2. Prepare the database `npm run db:generate`
3. OPTIONAL: Copy `env.example` to `.env` and fill in your Plex/TMDB credentials (this can also be handled in the app)
4. Build the production optimized app: `npm run build`
5. Start the server: `npm run start`


## Useful Scripts

- `npm run dev` – Next.js development server
- `npm run build` – production build
- `npm run start` – run the production build
- `npm run lint` – lint the codebase
- `npm run db:generate` – run initial sqlite database setup
