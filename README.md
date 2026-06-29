# Fred again.. USB002 Live Archive

An interactive web app for exploring Fred again..'s USB002 108-hour YouTube archive by tour city, show, and timestamp.

[Open the live archive](https://ganowacek.github.io/fred-again-108-hour-set/)

## Features

- Full-screen Leaflet map with glowing tour markers and a dark / light theme toggle
- **Car Mode** — a large, high-contrast, touch-friendly list view for safe use while
  driving, with quick-jump city navigation and no map interaction required
- Grouped city drawers for Toronto 1/2, NY1-NY6, and LDN1-LDN4
- Embedded YouTube player that loads the original archive video at the correct timestamp
- "YouTube" and "YouTube Music" launch buttons that deep-link to the same timestamp
- Persistent playback dock that keeps playing while switching between Map and Car Mode
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
