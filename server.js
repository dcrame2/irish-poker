// Irish Poker — authoritative game server.
//
// All game state lives here. Clients identify with a persistent playerId
// (stored in their browser), so a dropped socket is just a hiccup: the player
// reconnects, re-authenticates with the same playerId, and receives a full
// snapshot of the room. If a player stays disconnected on their turn, the
// game keeps moving — their turn auto-skips after a countdown (or the host
// can skip immediately).

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const {
  dealHands,
  evaluateGuess,
  isValidOption,
  rankLabel,
} = require("./utils/gameLogic");

const app = express();
app.use(cors());
app.get("/health", (_req, res) => res.json({ ok: true }));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  // Aggressive heartbeats so dead connections are detected fast, and a
  // generous recovery window for flaky mobile networks.
  pingInterval: 10000,
  pingTimeout: 8000,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

// ---------------------------------------------------------------------------
// Timing constants (ms)
// ---------------------------------------------------------------------------
const num = (v, fallback) => (v ? Number(v) : fallback);
const INTERLUDE_MS = num(process.env.INTERLUDE_MS, 5000); // how long a guess result stays on screen
const DRINK_PICK_MS = num(process.env.DRINK_PICK_MS, 45000); // max time to choose who drinks
const SKIP_DISCONNECTED_MS = num(process.env.SKIP_DISCONNECTED_MS, 25000); // grace before skipping a disconnected player's turn
const SKIP_LEFT_MS = num(process.env.SKIP_LEFT_MS, 2500); // near-instant skip for players who left for good
const LOBBY_REMOVE_MS = num(process.env.LOBBY_REMOVE_MS, 30000); // remove disconnected players from a lobby after this
const EMPTY_ROOM_TTL_MS = 10 * 60 * 1000; // delete rooms with nobody connected

const MAX_PLAYERS = 10;
const MAX_CHAT = 100;

// ---------------------------------------------------------------------------
// Room state
// ---------------------------------------------------------------------------
// rooms: Map<code, Room>
// Room = {
//   code, hostId, phase: "lobby"|"playing"|"results",
//   players: Map<playerId, Player>,
//   order: [playerId],            // seat order
//   chat: [{ id, playerId, username, text, at }],
//   game: null | Game,
//   timers: { turn, interlude, pick, empty },
// }
// Player = { id, username, avatar, connected, left, socketId, drinks, totalDrinks }
// Game = {
//   turnOrder: [playerId], hands: { [playerId]: Card[4] },
//   round: 0..3, turn: idx into turnOrder,
//   awaiting: "guess"|"drink_pick"|"interlude",
//   skipDeadline: ts|null, pickDeadline: ts|null, interludeUntil: ts|null,
//   lastResult: null | {...},
// }
const rooms = new Map();

function makeCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I/O to avoid confusion
  let code = "";
  do {
    code = Array.from({ length: 4 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join("");
  } while (rooms.has(code));
  return code;
}

function createRoom() {
  const room = {
    code: makeCode(),
    hostId: null,
    phase: "lobby",
    players: new Map(),
    order: [],
    chat: [],
    game: null,
    timers: {},
  };
  rooms.set(room.code, room);
  return room;
}

function clearTimer(room, name) {
  if (room.timers[name]) {
    clearTimeout(room.timers[name]);
    room.timers[name] = null;
  }
}

function clearAllTimers(room) {
  Object.keys(room.timers).forEach((name) => clearTimer(room, name));
}

function deleteRoom(room) {
  clearAllTimers(room);
  rooms.delete(room.code);
}

// ---------------------------------------------------------------------------
// Serialization — what clients are allowed to see.
// Unrevealed card faces are masked so nobody can peek via devtools.
// ---------------------------------------------------------------------------
function maskCard(card) {
  if (card.revealed) {
    return {
      hidden: false,
      suit: card.suit,
      rank: card.rank,
      label: rankLabel(card.rank),
      guess: card.guess,
      correct: card.correct,
    };
  }
  return { hidden: true };
}

function serializeRoom(room) {
  const players = room.order
    .map((id) => room.players.get(id))
    .filter(Boolean)
    .map((p) => ({
      id: p.id,
      username: p.username,
      avatar: p.avatar,
      connected: p.connected,
      left: p.left,
      drinks: p.drinks,
      totalDrinks: p.totalDrinks,
      isHost: p.id === room.hostId,
    }));

  let game = null;
  if (room.game) {
    const g = room.game;
    const hands = {};
    for (const [pid, hand] of Object.entries(g.hands)) {
      hands[pid] = hand.map(maskCard);
    }
    game = {
      turnOrder: g.turnOrder,
      currentPlayerId: g.turnOrder[g.turn] ?? null,
      round: g.round,
      turn: g.turn,
      awaiting: g.awaiting,
      skipDeadline: g.skipDeadline,
      pickDeadline: g.pickDeadline,
      interludeUntil: g.interludeUntil,
      lastResult: g.lastResult,
      hands,
    };
  }

  return {
    code: room.code,
    hostId: room.hostId,
    phase: room.phase,
    players,
    game,
    chat: room.chat,
    serverNow: Date.now(),
  };
}

function broadcast(room) {
  io.to(room.code).emit("room_state", serializeRoom(room));
}

function announce(room, type, payload = {}) {
  io.to(room.code).emit("game_event", { type, at: Date.now(), ...payload });
}

// ---------------------------------------------------------------------------
// Game flow
// ---------------------------------------------------------------------------
function startGame(room) {
  // Only deal to players who are actually here — anyone offline at deal
  // time sits this one out (they can still watch and join the next deal).
  const activeIds = room.order.filter((id) => {
    const p = room.players.get(id);
    return p && !p.left && p.connected;
  });
  if (activeIds.length === 0) return;

  for (const id of activeIds) {
    const p = room.players.get(id);
    p.drinks = 0;
  }

  room.phase = "playing";
  room.game = {
    turnOrder: activeIds,
    hands: dealHands(activeIds),
    round: 0,
    turn: 0,
    awaiting: "guess",
    skipDeadline: null,
    pickDeadline: null,
    interludeUntil: null,
    lastResult: null,
  };
  announce(room, "game_started");
  armTurn(room);
  broadcast(room);
}

// Called whenever a new turn begins (or the current player's connection
// status changes). Sets up the auto-skip countdown if they're gone.
function armTurn(room) {
  const g = room.game;
  if (!g || g.awaiting !== "guess") return;
  clearTimer(room, "turn");

  const currentId = g.turnOrder[g.turn];
  const player = room.players.get(currentId);
  if (!player) return;

  if (player.left || !player.connected) {
    const wait = player.left ? SKIP_LEFT_MS : SKIP_DISCONNECTED_MS;
    g.skipDeadline = Date.now() + wait;
    room.timers.turn = setTimeout(() => skipTurn(room, "timeout"), wait);
  } else {
    g.skipDeadline = null;
  }
}

function skipTurn(room, reason) {
  const g = room.game;
  if (!g || g.awaiting !== "guess") return;
  clearTimer(room, "turn");

  const currentId = g.turnOrder[g.turn];
  const player = room.players.get(currentId);
  const card = g.hands[currentId]?.[g.round];
  if (card) {
    card.revealed = true;
    card.guess = "skipped";
    card.correct = null;
  }

  g.lastResult = {
    type: "skip",
    playerId: currentId,
    username: player?.username ?? "Player",
    round: g.round,
    card: card ? maskCard(card) : null,
  };
  announce(room, "turn_skipped", {
    playerId: currentId,
    username: player?.username,
    reason,
  });
  beginInterlude(room, INTERLUDE_MS * 0.6);
  broadcast(room);
}

function beginInterlude(room, ms = INTERLUDE_MS) {
  const g = room.game;
  if (!g) return;
  clearTimer(room, "interlude");
  clearTimer(room, "pick");
  g.awaiting = "interlude";
  g.skipDeadline = null;
  g.pickDeadline = null;
  g.interludeUntil = Date.now() + ms;
  room.timers.interlude = setTimeout(() => advanceTurn(room), ms);
}

function advanceTurn(room) {
  const g = room.game;
  if (!g) return;
  clearTimer(room, "interlude");

  g.interludeUntil = null;
  g.lastResult = null;
  g.turn += 1;
  if (g.turn >= g.turnOrder.length) {
    g.turn = 0;
    g.round += 1;
  }

  if (g.round > 3) {
    finishGame(room);
    return;
  }

  g.awaiting = "guess";
  armTurn(room);
  broadcast(room);
}

function finishGame(room) {
  const g = room.game;
  room.phase = "results";
  g.awaiting = "interlude";

  // Reveal everything at the end.
  for (const hand of Object.values(g.hands)) {
    for (const card of hand) card.revealed = true;
  }
  for (const id of g.turnOrder) {
    const p = room.players.get(id);
    if (p) p.totalDrinks += p.drinks;
  }
  announce(room, "game_over");
  broadcast(room);
}

function resolveGuess(room, playerId, option) {
  const g = room.game;
  const player = room.players.get(playerId);
  if (!g || !player || g.awaiting !== "guess") return;
  if (g.turnOrder[g.turn] !== playerId) return;
  if (!isValidOption(g.round, option)) return;

  clearTimer(room, "turn");

  const hand = g.hands[playerId];
  const correct = evaluateGuess(hand, g.round, option);
  const card = hand[g.round];
  card.revealed = true;
  card.guess = option;
  card.correct = correct;

  const revealedCard = maskCard(card);
  const othersConnected = room.order.some((id) => {
    const p = room.players.get(id);
    return p && p.id !== playerId && p.connected && !p.left;
  });

  g.lastResult = {
    type: "guess",
    playerId,
    username: player.username,
    option,
    correct,
    round: g.round,
    card: revealedCard,
    drinkers: null,
  };

  announce(room, "guess_made", {
    playerId,
    username: player.username,
    option,
    correct,
    card: revealedCard,
    round: g.round,
  });

  if (correct && othersConnected) {
    // Winner hands out drinks.
    g.awaiting = "drink_pick";
    g.pickDeadline = Date.now() + DRINK_PICK_MS;
    clearTimer(room, "pick");
    room.timers.pick = setTimeout(() => {
      // Picker stalled out — nobody drinks, move on.
      finishDrinkPick(room, playerId, []);
    }, DRINK_PICK_MS);
  } else {
    if (!correct) {
      player.drinks += 1;
    }
    beginInterlude(room);
  }
  broadcast(room);
}

function finishDrinkPick(room, pickerId, drinkerIds) {
  const g = room.game;
  if (!g || g.awaiting !== "drink_pick") return;
  if (g.turnOrder[g.turn] !== pickerId) return;
  clearTimer(room, "pick");

  const valid = (drinkerIds || []).filter(
    (id) => room.players.has(id) && id !== pickerId
  );
  const names = [];
  for (const id of valid) {
    const p = room.players.get(id);
    p.drinks += 1;
    names.push(p.username);
  }

  if (g.lastResult && g.lastResult.type === "guess") {
    g.lastResult.drinkers = valid.map((id) => ({
      id,
      username: room.players.get(id).username,
    }));
  }

  announce(room, "drinks_assigned", {
    pickerId,
    pickerName: room.players.get(pickerId)?.username,
    drinkers: names,
    drinkerIds: valid,
  });
  beginInterlude(room);
  broadcast(room);
}

// ---------------------------------------------------------------------------
// Presence
// ---------------------------------------------------------------------------
// Re-key a player onto a new playerId (seat takeover after their old
// browser session was lost for good).
function transferSeat(room, oldId, newId) {
  const player = room.players.get(oldId);
  if (!player || room.players.has(newId)) return;
  room.players.delete(oldId);
  player.id = newId;
  room.players.set(newId, player);
  room.order = room.order.map((id) => (id === oldId ? newId : id));
  if (room.hostId === oldId) room.hostId = newId;
  const g = room.game;
  if (g) {
    g.turnOrder = g.turnOrder.map((id) => (id === oldId ? newId : id));
    if (g.hands[oldId]) {
      g.hands[newId] = g.hands[oldId];
      delete g.hands[oldId];
    }
    if (g.lastResult?.playerId === oldId) g.lastResult.playerId = newId;
  }
}

function ensureHost(room) {
  const host = room.players.get(room.hostId);
  if (host && host.connected && !host.left) return;
  const next = room.order
    .map((id) => room.players.get(id))
    .find((p) => p && p.connected && !p.left);
  if (next && next.id !== room.hostId) {
    room.hostId = next.id;
    announce(room, "new_host", { playerId: next.id, username: next.username });
  }
}

function removePlayer(room, playerId) {
  const player = room.players.get(playerId);
  if (!player) return;

  if (room.phase === "lobby") {
    room.players.delete(playerId);
    room.order = room.order.filter((id) => id !== playerId);
  } else {
    // Mid-game we keep their seat/cards but fast-skip their turns.
    player.left = true;
    player.connected = false;
    const g = room.game;
    if (g && g.awaiting === "guess" && g.turnOrder[g.turn] === playerId) {
      armTurn(room);
    }
    if (g && g.awaiting === "drink_pick" && g.turnOrder[g.turn] === playerId) {
      finishDrinkPick(room, playerId, []);
    }
  }
  ensureHost(room);

  const anyoneConnected = [...room.players.values()].some((p) => p.connected);
  if (room.players.size === 0) {
    deleteRoom(room);
    return;
  }
  if (!anyoneConnected) {
    clearTimer(room, "empty");
    room.timers.empty = setTimeout(() => deleteRoom(room), EMPTY_ROOM_TTL_MS);
  }
  broadcast(room);
}

function handleDisconnect(room, player) {
  player.connected = false;
  player.socketId = null;
  announce(room, "player_disconnected", {
    playerId: player.id,
    username: player.username,
  });
  ensureHost(room);

  const g = room.game;
  if (room.phase === "lobby") {
    // Give them a short window to come back, then drop them from the lobby.
    const pid = player.id;
    setTimeout(() => {
      const r = rooms.get(room.code);
      if (!r) return;
      const p = r.players.get(pid);
      if (p && !p.connected && r.phase === "lobby") {
        removePlayer(r, pid);
        announce(r, "player_left", { playerId: pid, username: p.username });
      }
    }, LOBBY_REMOVE_MS);
  } else if (g) {
    if (g.awaiting === "guess" && g.turnOrder[g.turn] === player.id) {
      armTurn(room); // start the auto-skip countdown
    } else if (g.awaiting === "drink_pick" && g.turnOrder[g.turn] === player.id) {
      finishDrinkPick(room, player.id, []); // don't stall everyone else
    }
  }

  const anyoneConnected = [...room.players.values()].some((p) => p.connected);
  if (!anyoneConnected) {
    clearTimer(room, "empty");
    room.timers.empty = setTimeout(() => deleteRoom(room), EMPTY_ROOM_TTL_MS);
  }
  broadcast(room);
}

// ---------------------------------------------------------------------------
// Socket wiring
// ---------------------------------------------------------------------------
function findPlayerRoom(playerId) {
  for (const room of rooms.values()) {
    if (room.players.has(playerId)) return room;
  }
  return null;
}

io.on("connection", (socket) => {
  const { playerId } = socket.handshake.auth || {};
  socket.data.playerId = playerId || null;
  socket.data.roomCode = null;

  function currentRoom() {
    return socket.data.roomCode ? rooms.get(socket.data.roomCode) : null;
  }

  function attach(room, player) {
    player.socketId = socket.id;
    player.connected = true;
    player.left = false;
    socket.data.playerId = player.id;
    socket.data.roomCode = room.code;
    socket.join(room.code);
    clearTimer(room, "empty");
  }

  function joinRoom(room, username, ack) {
    if (!socket.data.playerId) {
      return ack?.({ error: "Missing player id — refresh and try again." });
    }
    const existing = room.players.get(socket.data.playerId);
    if (existing) {
      // Same person coming back (e.g. refreshed browser). Allow a rename,
      // but never onto a name another player already holds.
      const newName = String(username || "").trim().slice(0, 14);
      if (newName) {
        const clash = [...room.players.values()].some(
          (p) =>
            p.id !== existing.id &&
            p.username.toLowerCase() === newName.toLowerCase()
        );
        if (clash) {
          return ack?.({
            error: `"${newName}" is taken in this party — try another name.`,
          });
        }
        existing.username = newName;
      }
      attach(room, existing);
      ensureHost(room);
      announce(room, "player_reconnected", {
        playerId: existing.id,
        username: existing.username,
      });
      const g = room.game;
      if (g && g.awaiting === "guess" && g.turnOrder[g.turn] === existing.id) {
        armTurn(room);
      }
      ack?.({ ok: true, playerId: existing.id, code: room.code });
      broadcast(room);
      return;
    }

    const name = String(username || "").trim().slice(0, 14);
    if (!name) return ack?.({ error: "Pick a name first." });

    const sameName = [...room.players.values()].find(
      (p) => p.username.toLowerCase() === name.toLowerCase()
    );
    if (sameName) {
      if (sameName.connected) {
        return ack?.({ error: `"${name}" is taken in this party — try another name.` });
      }
      // Their browser died and they came back with a fresh identity —
      // hand them their old seat (cards, drinks, host status and all).
      transferSeat(room, sameName.id, socket.data.playerId);
      const player = room.players.get(socket.data.playerId);
      attach(room, player);
      announce(room, "player_reconnected", {
        playerId: player.id,
        username: player.username,
      });
      const g = room.game;
      if (g && g.awaiting === "guess" && g.turnOrder[g.turn] === player.id) {
        armTurn(room);
      }
      ack?.({ ok: true, playerId: player.id, code: room.code });
      broadcast(room);
      return;
    }
    if (room.phase !== "lobby") {
      return ack?.({ error: "That game already started — wait for the next round." });
    }
    if (room.players.size >= MAX_PLAYERS) {
      return ack?.({ error: "This party is full (10 players max)." });
    }

    const player = {
      id: socket.data.playerId,
      username: name,
      avatar: room.order.length % 10,
      connected: true,
      left: false,
      socketId: socket.id,
      drinks: 0,
      totalDrinks: 0,
    };
    room.players.set(player.id, player);
    room.order.push(player.id);
    if (!room.hostId) room.hostId = player.id;
    attach(room, player);

    announce(room, "player_joined", {
      playerId: player.id,
      username: player.username,
    });
    ack?.({ ok: true, playerId: player.id, code: room.code });
    broadcast(room);
  }

  socket.on("create_room", ({ username } = {}, ack) => {
    const room = createRoom();
    joinRoom(room, username, ack);
    if (room.players.size === 0) deleteRoom(room); // join failed validation
  });

  socket.on("join_room", ({ code, username } = {}, ack) => {
    const room = rooms.get(String(code || "").trim().toUpperCase());
    if (!room) {
      return ack?.({ error: "No party found with that code. Double-check it!" });
    }
    joinRoom(room, username, ack);
  });

  // Automatic rejoin after refresh/reconnect: the client remembers its
  // room code + playerId and asks to be put back.
  socket.on("rejoin_room", ({ code } = {}, ack) => {
    const room =
      rooms.get(String(code || "").trim().toUpperCase()) ||
      (socket.data.playerId ? findPlayerRoom(socket.data.playerId) : null);
    if (!room || !socket.data.playerId || !room.players.has(socket.data.playerId)) {
      return ack?.({ error: "session_expired" });
    }
    joinRoom(room, null, ack);
  });

  socket.on("leave_room", () => {
    const room = currentRoom();
    if (!room) return;
    const player = room.players.get(socket.data.playerId);
    socket.leave(room.code);
    socket.data.roomCode = null;
    if (player) {
      announce(room, "player_left", {
        playerId: player.id,
        username: player.username,
      });
      removePlayer(room, player.id);
    }
  });

  socket.on("start_game", () => {
    const room = currentRoom();
    if (!room || room.hostId !== socket.data.playerId) return;
    if (room.phase === "playing") return;
    startGame(room);
  });

  socket.on("make_guess", ({ option } = {}) => {
    const room = currentRoom();
    if (!room || room.phase !== "playing") return;
    resolveGuess(room, socket.data.playerId, option);
  });

  socket.on("pick_drinkers", ({ playerIds } = {}) => {
    const room = currentRoom();
    if (!room || room.phase !== "playing") return;
    finishDrinkPick(room, socket.data.playerId, playerIds);
  });

  // Host can immediately skip a disconnected/left player's turn.
  socket.on("skip_turn", () => {
    const room = currentRoom();
    if (!room || room.hostId !== socket.data.playerId) return;
    const g = room.game;
    if (!g || g.awaiting !== "guess") return;
    const current = room.players.get(g.turnOrder[g.turn]);
    if (current && (current.left || !current.connected)) {
      skipTurn(room, "host");
    }
  });

  socket.on("play_again", () => {
    const room = currentRoom();
    if (!room || room.hostId !== socket.data.playerId) return;
    if (room.phase !== "results") return;
    startGame(room);
  });

  socket.on("back_to_lobby", () => {
    const room = currentRoom();
    if (!room || room.hostId !== socket.data.playerId) return;
    clearAllTimers(room);
    room.phase = "lobby";
    room.game = null;
    // Drop players who left mid-game.
    for (const id of [...room.players.keys()]) {
      const p = room.players.get(id);
      if (p.left || !p.connected) {
        room.players.delete(id);
        room.order = room.order.filter((x) => x !== id);
      }
    }
    ensureHost(room);
    broadcast(room);
  });

  const ALLOWED_EMOTES = ["🍻", "😂", "💀", "🔥", "👏", "🍀"];
  socket.on("send_emote", ({ emoji } = {}) => {
    const room = currentRoom();
    const player = room?.players.get(socket.data.playerId);
    if (!room || !player) return;
    if (!ALLOWED_EMOTES.includes(emoji)) return;
    // Light rate limit so nobody can flood the table.
    const now = Date.now();
    if (socket.data.lastEmoteAt && now - socket.data.lastEmoteAt < 400) return;
    socket.data.lastEmoteAt = now;
    io.to(room.code).emit("emote", {
      id: `${now}-${player.id.slice(0, 6)}`,
      playerId: player.id,
      username: player.username,
      emoji,
    });
  });

  socket.on("chat_send", ({ text } = {}) => {
    const room = currentRoom();
    const player = room?.players.get(socket.data.playerId);
    if (!room || !player) return;
    const clean = String(text || "").trim().slice(0, 280);
    if (!clean) return;
    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      playerId: player.id,
      username: player.username,
      text: clean,
      at: Date.now(),
    };
    room.chat.push(msg);
    if (room.chat.length > MAX_CHAT) room.chat.shift();
    io.to(room.code).emit("chat_msg", msg);
  });

  socket.on("disconnect", () => {
    const room = currentRoom();
    if (!room) return;
    const player = room.players.get(socket.data.playerId);
    // Only mark disconnected if this socket is still the player's active one
    // (they may have already reconnected on a fresh socket).
    if (player && player.socketId === socket.id) {
      handleDisconnect(room, player);
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Irish Poker game server running on port ${PORT}`);
});
