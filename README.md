# Fred again.. USB002 Live Archive

An interactive web app for exploring Fred again..'s USB002 108-hour YouTube archive by tour city, show, and timestamp.

## Features

- Dark, full-screen Leaflet map with glowing tour markers
- Grouped city drawers for Toronto 1/2, NY1-NY6, and LDN1-LDN4
- Timestamped YouTube launch links from the original archive video
- Persistent playback dock that stays open while browsing other cities
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

### Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Keep the default Next.js settings.
4. Deploy.

### GitHub Pages

This app is built for Next.js hosting. For GitHub Pages, configure a static export or use a deployment action that runs `npm run build` and publishes the generated output. Vercel is the simplest route for this project because the default Next.js setup works out of the box.
