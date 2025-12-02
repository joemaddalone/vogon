<h1 align="center" id="title">vogon</h1>
<div align="center">

![VOGON](https://img.shields.io/badge/VOGON-Art%20Management-blue?style=for-the-badge)
[![Buy Me A Coffee](https://img.shields.io/badge/Support-Buy%20Me%20A%20Coffee-orange?style=for-the-badge)](https://buymeacoffee.com/joemaddalone)


</div>

> **Note**
> This application connects to one or more Plex or Jellyfin Media Servers, imports movie and TV show libraries, and lets you replace movie, show and season artwork with alternatives from TMDB, Fanart.tv, and other sources.


## Key Features

- **Handles Multiple Servers**: Add as many Plex and Jellyfin servers as you like
- **Fast Import**: Vogon does not store image files so reset your libraries as often as you like
- **Sourcing**: Vogon currently supports TMDB, Fanart.tv, and ThePosterDB.  Plenty of options to choose from.
- **Update Everything**: Update Movie posters and backdrops, TV Show posters and backdrops, and Season posters.

## Usage

- **Plex or Jellyfin Server**
  - Plex
    - **Plex token**: [How to find your token](https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/)
  - Jellyfin
    - **Jellyfin API key**: Dashboard > Api Keys
    - **Jellyfin user Id**: this is user id NOT username
- **TMDB API key**: [Get an API key](https://www.themoviedb.org/settings/api)
- **Local network access** to Plex
- OPTIONAL
   - **Fanart.tv API Key** [Get an API key](https://fanart.tv/get-an-api-key/)
   - **ThePosterDB Credentials** [Create a free account](https://theposterdb.com/)


## Deployment Guide

### Docker Deployment

docker-compose.yml example (aka just adding the thing to your home lab / media server)

```yaml
services:
  vogon:
    image: ghcr.io/joemaddalone/vogon:latest
    container_name: vogon
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./vogon/data:/app/src/db
    # environment:
    #   - TMDB_API_KEY=
    #   - FANART_API_KEY=
    #   - THEPOSTERDB_EMAIL=
    #   - THEPOSTERDB_PASSWORD=
    #   - REMOVE_OVERLAYS=true
```

## Local Guide

Build using Docker for local containerized hosting:

```bash
# Clone the repository
git clone https://github.com/joemaddalone/vogon.git && cd vogon

# Build and start the container
docker compose -f docker-compose-dev.yml up -d --build

# Access the application at http://localhost:3000 (or your configured port)
```

### Local Development Requirements

- **Node v20+**


### Production Build

```bash
# Clone the repository
git clone https://github.com/joemaddalone/vogon.git && cd vogon

# Install dependencies
npm install

# Set up the database
npm run db:generate

# Build the application
npm run build

# Start production server
npm start

# Open your browser at http://localhost:3000
```

https://github.com/user-attachments/assets/d9803c83-92da-44b0-9332-5e4aaa1683fe

---

### Dev Build

```bash
# Clone the repository
git clone https://github.com/joemaddalone/vogon.git && cd vogon

# Install dependencies
npm install

# Set up the database
npm run db:generate

# Start the development server
npm run dev

# Open your browser at http://localhost:3000
```


[Support Open Source](https://buymeacoffee.com/joemaddalone)



---

## Support the Project

Your support helps maintain and improve this project! Please consider:

- [Buy me a coffee](https://www.buymeacoffee.com/joemaddalone)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request