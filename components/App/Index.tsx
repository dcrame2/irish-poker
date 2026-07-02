import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import {
  getSocket,
  getPlayerId,
  saveSession,
  loadSession,
  clearSession,
} from "@lib/socket";
import type { RoomState, GameEvent, ChatMsg } from "@lib/types";
import { sound, haptic } from "@lib/sound";
import Landing from "../Landing/Index";
import Lobby from "../Lobby/Index";
import GameTable from "../Game/Table";
import Toasts, { Toast } from "../Toasts/Index";
import ConnectionBanner from "../ConnectionBanner/Index";
import ChatDrawer from "../Chat/Index";
import Menu from "../Menu/Index";
import FloatingSuits from "../FloatingSuits/Index";
import { IconButton, Badge } from "../ui/shared";

const Shell = styled.div`
  min-height: 100dvh;
  position: relative;
  overflow: hidden;
`;

const TopControls = styled.div`
  position: fixed;
  top: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 60;

  > * {
    pointer-events: auto;
  }
`;

const RightControls = styled.div`
  display: flex;
  gap: 10px;

  > * {
    pointer-events: auto;
  }
`;

let toastSeq = 0;

export interface FloatingEmote {
  id: string;
  playerId: string;
  username: string;
  emoji: string;
}

export default function App() {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [unread, setUnread] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [connected, setConnected] = useState(false);
  const [everConnected, setEverConnected] = useState(false);
  const [rejoining, setRejoining] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastEvent, setLastEvent] = useState<GameEvent | null>(null);
  const [emotes, setEmotes] = useState<FloatingEmote[]>([]);
  const [muted, setMutedState] = useState(false);
  // Bumping these counters fires a confetti/beer burst.
  const [beerBurst, setBeerBurst] = useState(0);

  const meId = useMemo(() => getPlayerId(), []);
  const roomRef = useRef<RoomState | null>(null);
  roomRef.current = room;
  const showChatRef = useRef(false);
  showChatRef.current = showChat;
  // Server/client clock offset so countdowns match the server's timers.
  const clockOffsetRef = useRef(0);

  const pushToast = useCallback((text: string, tone: Toast["tone"] = "info") => {
    const id = ++toastSeq;
    setToasts((t) => [...t.slice(-4), { id, text, tone }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4200);
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const tryRejoin = () => {
      const session = loadSession();
      if (!session) return;
      setRejoining(true);
      socket.emit("rejoin_room", { code: session.code }, (res: any) => {
        setRejoining(false);
        if (res?.error) {
          clearSession();
          setRoom(null);
        }
      });
    };

    const onConnect = () => {
      setConnected(true);
      setEverConnected(true);
      // Whether this is a page load or a mid-game reconnect, ask to be
      // put back into our room.
      tryRejoin();
    };
    const onDisconnect = () => setConnected(false);

    const onRoomState = (state: RoomState) => {
      clockOffsetRef.current = state.serverNow - Date.now();
      setRoom(state);
      setChat(state.chat);
    };

    const onChat = (msg: ChatMsg) => {
      setChat((c) => [...c.slice(-99), msg]);
      if (!showChatRef.current && msg.playerId !== meId) {
        setUnread((u) => u + 1);
      }
    };

    const onEvent = (ev: GameEvent) => {
      setLastEvent(ev);
      switch (ev.type) {
        case "game_started":
          sound.deal();
          break;
        case "guess_made":
          sound.flip();
          if (ev.correct) {
            setTimeout(() => sound.lucky(), 350);
          } else {
            setTimeout(() => sound.unlucky(), 350);
            if (ev.playerId === meId) {
              haptic([120, 60, 120]);
              setBeerBurst((b) => b + 1);
            }
          }
          break;
        case "player_joined":
          if (ev.playerId !== meId) pushToast(`${ev.username} joined the party`, "success");
          sound.pop();
          break;
        case "player_left":
          if (ev.playerId !== meId) pushToast(`${ev.username} left the party`, "info");
          break;
        case "player_disconnected":
          if (ev.playerId !== meId)
            pushToast(`${ev.username} lost connection — the game keeps going`, "warn");
          break;
        case "player_reconnected":
          if (ev.playerId !== meId) pushToast(`${ev.username} is back!`, "success");
          break;
        case "new_host":
          pushToast(
            ev.playerId === meId
              ? "You are the new host 👑"
              : `${ev.username} is the new host 👑`,
            "info"
          );
          break;
        case "turn_skipped":
          pushToast(`${ev.username}'s turn was skipped`, "warn");
          break;
        case "drinks_assigned":
          if (ev.drinkers?.length) {
            pushToast(`🍺 ${ev.pickerName} sent drinks to ${ev.drinkers.join(", ")}`, "gold");
            sound.clink();
            if (ev.drinkerIds?.includes(meId)) {
              haptic([120, 60, 120]);
              setBeerBurst((b) => b + 1);
            }
          } else {
            pushToast(`${ev.pickerName} was merciful — nobody drinks`, "info");
          }
          break;
        case "game_over":
          pushToast("Game over! Check the damage 🍻", "gold");
          sound.fanfare();
          break;
      }
    };

    const onEmote = (em: FloatingEmote) => {
      sound.pop();
      setEmotes((list) => [...list.slice(-11), em]);
      setTimeout(() => {
        setEmotes((list) => list.filter((e) => e.id !== em.id));
      }, 2600);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("room_state", onRoomState);
    socket.on("chat_msg", onChat);
    socket.on("game_event", onEvent);
    socket.on("emote", onEmote);

    if (socket.connected) onConnect();

    // Browsers only allow audio after a user gesture — arm it on first tap.
    const unlockAudio = () => sound.unlock();
    window.addEventListener("pointerdown", unlockAudio, { once: true });
    setMutedState(sound.isMuted());

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room_state", onRoomState);
      socket.off("chat_msg", onChat);
      socket.off("game_event", onEvent);
      socket.off("emote", onEmote);
      window.removeEventListener("pointerdown", unlockAudio);
    };
  }, [meId, pushToast]);

  // Chime + buzz the moment it becomes your turn.
  const wasMyTurnRef = useRef(false);
  useEffect(() => {
    const myTurn =
      room?.phase === "playing" &&
      room.game?.awaiting === "guess" &&
      room.game.currentPlayerId === meId;
    if (myTurn && !wasMyTurnRef.current) {
      sound.yourTurn();
      haptic([80, 50, 80]);
    }
    wasMyTurnRef.current = !!myTurn;
  }, [room, meId]);

  // ---- actions -------------------------------------------------------------
  const createRoom = useCallback(
    (username: string) =>
      new Promise<string | null>((resolve) => {
        getSocket().emit("create_room", { username }, (res: any) => {
          if (res?.error) return resolve(res.error);
          saveSession({ code: res.code, username });
          resolve(null);
        });
      }),
    []
  );

  const joinRoom = useCallback(
    (code: string, username: string) =>
      new Promise<string | null>((resolve) => {
        getSocket().emit("join_room", { code, username }, (res: any) => {
          if (res?.error) return resolve(res.error);
          saveSession({ code: res.code, username });
          resolve(null);
        });
      }),
    []
  );

  const leaveRoom = useCallback(() => {
    getSocket().emit("leave_room");
    clearSession();
    setRoom(null);
    setChat([]);
    setUnread(0);
    setShowChat(false);
    setShowMenu(false);
  }, []);

  const send = useCallback((event: string, payload?: any) => {
    getSocket().emit(event, payload);
  }, []);

  const openChat = useCallback(() => {
    setShowChat(true);
    setUnread(0);
  }, []);

  const me = room?.players.find((p) => p.id === meId) ?? null;
  const inGame = room && (room.phase === "playing" || room.phase === "results");

  return (
    <Shell>
      <FloatingSuits />
      <ConnectionBanner
        connected={connected}
        everConnected={everConnected}
        rejoining={rejoining}
      />
      <TopControls>
        <IconButton
          aria-label="Menu"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowMenu(true)}
        >
          ☰
        </IconButton>
        <RightControls>
          <IconButton
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              const next = !muted;
              sound.setMuted(next);
              setMutedState(next);
              if (!next) sound.click();
            }}
          >
            {muted ? "🔇" : "🔊"}
          </IconButton>
          {room && (
            <IconButton
              aria-label="Chat"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={openChat}
            >
              💬
              {unread > 0 && <Badge>{unread}</Badge>}
            </IconButton>
          )}
        </RightControls>
      </TopControls>

      <AnimatePresence mode="wait">
        {!room && (
          <Landing key="landing" onCreate={createRoom} onJoin={joinRoom} />
        )}
        {room && room.phase === "lobby" && (
          <Lobby
            key="lobby"
            room={room}
            meId={meId}
            onStart={() => send("start_game")}
            onLeave={leaveRoom}
          />
        )}
        {inGame && (
          <GameTable
            key="game"
            room={room!}
            meId={meId}
            clockOffsetRef={clockOffsetRef}
            lastEvent={lastEvent}
            emotes={emotes}
            beerBurst={beerBurst}
            onEmote={(emoji) => send("send_emote", { emoji })}
            onGuess={(option) => send("make_guess", { option })}
            onPickDrinkers={(playerIds) => send("pick_drinkers", { playerIds })}
            onSkipTurn={() => send("skip_turn")}
            onPlayAgain={() => send("play_again")}
            onBackToLobby={() => send("back_to_lobby")}
          />
        )}
      </AnimatePresence>

      {room && (
        <ChatDrawer
          open={showChat}
          onClose={() => setShowChat(false)}
          chat={chat}
          meId={meId}
          onSend={(text) => send("chat_send", { text })}
        />
      )}
      <Menu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        inRoom={!!room}
        onLeave={leaveRoom}
      />
      <Toasts toasts={toasts} />
    </Shell>
  );
}
