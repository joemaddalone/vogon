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
   - **ThePosterDB Credentials** [Create a free account](https://theposterdb.com/)



https://github.com/user-attachments/assets/d9803c83-92da-44b0-9332-5e4aaa1683fe



## Getting Started
1. Clone this repo: `git clone https://github.com/joemaddalone/vogon.git`
2. `cd vogon`
3. Install dependencies: `npm install`
4. Prepare the database `npm run db:generate`
5. Build the production optimized app: `npm run build`
6. Start the server: `npm run start`


## Useful Scripts

- `npm run dev` – Next.js development server
- `npm run build` – production build
- `npm run start` – run the production build
- `npm run lint` – lint the codebase
- `npm run db:generate` – run initial sqlite database setup
