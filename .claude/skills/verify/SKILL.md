---
name: verify
description: Build, launch, and drive irish-poker end-to-end to verify changes at the UI surface
---

# Verifying irish-poker

Two processes are needed:

```bash
PORT=4101 node server.js          # authoritative Socket.IO game server (client falls back to localhost:4101)
npm run dev                       # Next.js client on localhost:3000
```

Gotchas:
- `server.js` does NOT load `.env` — pass `PORT=4101` explicitly.
- If pages show "missing required error components, refreshing..." or 404s,
  the dev server's `.next` dir is corrupted (usually after `next build` ran
  against it). Fix: kill `next dev`, `rm -rf .next`, restart.
- Real AdSense ads never render on localhost; dev mode shows dashed "Ad"
  placeholder boxes at the exact reserved sizes (see components/Ads/AdBanner.tsx).

Driving a full game headlessly (no playwright in repo): `npm i playwright-core`
in the scratchpad and launch the cached Chromium at
`~/Library/Caches/ms-playwright/chromium-*/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`.

Flow to exercise everything: fill `input[placeholder="Your name"]` → click
"Create a Party" → read party code from `sessionStorage["irish-poker:session"]`
→ second browser context fills name + `input[placeholder="CODE"]` → "Join" →
host clicks "Deal the Cards". A 2-player game reaches game over ("Sláinte")
after 8 turns. Per turn: click a guess button (Red / Higher / Inside / ♥ Hearts);
on a correct guess the guesser must click another player's name chip then the
"Send N drink(s)" button. Interludes last 5s. "Run it back" restarts.

Check mobile with a 390×844 viewport — the compact table layout (<760px) is
where overlap bugs live (fixed-position EmoteBar vs in-flow GuessBar vs the
bottom ad anchor, coordinated via the `--anchor-h` CSS var set in Game/Table.tsx).
