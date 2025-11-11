## vogon

This application connects to a Plex Media Server, imports movie and TV show libraries, and lets you replace poster artwork with alternatives from TMDB, Fanart.tv, and other sources.


## Requirements

- **Node v20+**
- **Plex Server**
- **Plex token**: [How to find your token](https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/)
- **TMDB API key**: [Get an API key](https://www.themoviedb.org/settings/api)
- **Local network access** to Plex
- OPTIONAL
   - **Fanart.tv API Key** [Get an API key](https://fanart.tv/get-an-api-key/)
   - **ThePosterDB Credentials** [Create a free account][https://theposterdb.com/]

## Getting Started
1. Clone this repo: `git clone https://github.com/joemaddalone/vogon.git`
2. Install dependencies: `npm install`
3. Prepare the database `npm run db:generate`
4. OPTIONAL -> Copy `env.example` to `.env` and fill in your credentials
   -  this can also be handled in the app
5. Build the production optimized app: `npm run build`
6. Start the server: `npm run start`


## Useful Scripts

- `npm run dev` – Next.js development server
- `npm run build` – production build
- `npm run start` – run the production build
- `npm run lint` – lint the codebase
- `npm run db:generate` – run initial sqlite database setup
