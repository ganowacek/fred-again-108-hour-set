# Fred again.. USB002 Live Archive

An interactive web app for exploring Fred again..'s USB002 108-hour YouTube archive by tour city, show, and timestamp.

[Open the live archive](https://ganowacek.github.io/fred-again-108-hour-set/)

## Features

- Full-screen Leaflet map with glowing tour markers and a dark / light theme toggle
- **Car Mode** — a large, high-contrast, touch-friendly list view for safe use while
  driving, with quick-jump city navigation and no map interaction required
- Grouped city drawers for Toronto 1/2, NY1-NY6, and LDN1-LDN4
- In-browser playback via the YouTube IFrame Player API (inline on mobile Safari)
  with Play/Pause and Previous/Next segment controls
- Tappable mini-player that expands into a full-screen, Apple-Music-style
  "Now Playing" view (large video, title, city/show, timestamp range, transport controls)
- "YouTube" and "YouTube Music" buttons kept as secondary launch options
- Persistent player that keeps playing while switching between Map, Car, mini, and full views
- Remembers your last view (Map or Car) and theme via local storage
- Structured TypeScript data in `src/data/sets.ts` for easy editing
- Responsive layout for desktop and mobile

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit the archive data

All tour data lives in `src/data/sets.ts`.

Each set is declared with:

```ts
set("unique-id", "28:04:00", "Fred")
```

The app automatically converts the timestamp to seconds for YouTube embeds. For example, `28:04:00` becomes `101040`.

## Deploy

The app deploys automatically to GitHub Pages when changes land on `main`.

Live URL: [https://ganowacek.github.io/fred-again-108-hour-set/](https://ganowacek.github.io/fred-again-108-hour-set/)
