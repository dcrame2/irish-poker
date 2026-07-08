// Single, app-wide socket connection.
//
// The old app created a brand new socket on every React render, which is why
// connections constantly dropped. This module creates exactly one socket,
// authenticates it with a persistent playerId, and lets socket.io's built-in
// reconnection do its job.

import { io, Socket } from "socket.io-client";

const { socketServerUrl } = require("../utils/pathUrl");

const PLAYER_ID_KEY = "irish-poker:playerId";
const SESSION_KEY = "irish-poker:session";

let socket: Socket | null = null;

// sessionStorage (not localStorage) so every browser tab is its own player;
// you can test multiplayer with two tabs. It survives refreshes and network
// drops; if the whole browser dies, the server lets you reclaim your seat by
// rejoining with the same name.
export function getPlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `p-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function getSocket(): Socket {
  if (!socket) {
    socket = io(socketServerUrl(), {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 400,
      reconnectionDelayMax: 4000,
      timeout: 10000,
      auth: { playerId: getPlayerId() },
    });
  }
  return socket;
}

// Remember which room we're in so a refresh / dropped connection can rejoin.
export type SavedSession = { code: string; username: string };

export function saveSession(session: SavedSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): SavedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
