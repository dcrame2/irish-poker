# Irish Poker 🍀

A multiplayer online drinking card game. Create a party, share the 4-letter
code, and play with friends in person or across the world.

## Architecture

- **`server.js`** — the authoritative game server (Express + Socket.IO).
  All game state lives here: rooms, hands, turns, drink counts. The deck is
  generated and shuffled server-side; unrevealed cards are never sent to
  clients, so nobody can peek via devtools.
- **Next.js app** (`src/pages` + `components/`) — the client. It holds no
  authoritative state; it renders whatever `room_state` snapshot the server
  broadcasts and sends player intents (`make_guess`, `pick_drinkers`, …).

### Disconnect handling

Every browser tab gets a persistent `playerId` (sessionStorage). If a socket
drops, socket.io reconnects automatically and the client re-emits
`rejoin_room` — the server re-attaches the player to their seat and sends a
full snapshot. The game never stalls:

- A disconnected player's turn auto-skips after a countdown (host can skip
  immediately).
- If their whole browser dies, they can reclaim their seat by rejoining with
  the same name and party code.
- Lobby members who stay disconnected ~30s are dropped; mid-game seats are
  kept until the game ends.

## Development

```bash
npm run dev          # Next.js frontend (http://localhost:3000)
npm run dev:server   # game server on port 4101 (auto-restarts via nodemon)
```

The client finds the socket server via `utils/pathUrl.js`:
`NEXT_PUBLIC_SOCKET_URL` env override → production URL → `http://localhost:4101`.

**Testing multiplayer locally:** open the app in several tabs — each tab is
its own player (identity is per-tab). Use one normal + one incognito window,
or just multiple tabs.

## Production

- Frontend: `npm run build` (deployed at irish-poker.com, set
  `NEXT_PUBLIC_ENV=production`)
- Game server: `npm start` (deployed at irish-poker.onrender.com; binds
  `$PORT`, defaults to 3001)
