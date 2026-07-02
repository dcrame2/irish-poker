import React, { MutableRefObject, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme, mq } from "@/styles/theme";
import type { RoomState, GameEvent } from "@lib/types";
import { ROUND_INFO } from "@lib/types";
import Seat from "./Seat";
import GuessBar from "./GuessBar";
import ResultOverlay from "./ResultOverlay";
import GameOverOverlay from "./GameOverOverlay";
import Confetti from "./Confetti";
import { useCountdown } from "./useCountdown";
import { GhostButton } from "../ui/shared";

const Wrap = styled(motion.main)`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 70px 12px 12px;
  position: relative;
  z-index: 1;

  @media ${mq.mobile} {
    padding: 64px 6px 6px;
  }
`;

const TableFelt = styled.div`
  position: relative;
  flex: 1;
  border-radius: clamp(60px, 14vw, 180px);
  background:
    radial-gradient(ellipse at 50% 35%, #1a7042 0%, #115231 45%, #0b3b22 100%);
  border: clamp(8px, 1.6vw, 16px) solid ${theme.rail};
  box-shadow:
    inset 0 0 60px rgba(0, 0, 0, 0.5),
    inset 0 0 6px rgba(255, 255, 255, 0.12),
    0 30px 80px rgba(0, 0, 0, 0.5);
  /* Card size scales with viewport and shrinks as the table gets crowded */
  --card-w: clamp(26px, calc((5.2vw + 4.5vh) / var(--crowd, 1.4)), 58px);
`;

const CenterHub = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  pointer-events: none;
  z-index: 2;
  max-width: min(46vw, 380px);

  > * {
    pointer-events: auto;
  }
`;

const RoundBadge = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${theme.gold};
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid ${theme.goldSoft};
  padding: 5px 14px;
  border-radius: 999px;
`;

const RoundTitle = styled.h2`
  font-family: ${theme.fontDisplay};
  font-weight: 400;
  font-size: clamp(1.3rem, 3.4vw, 2.1rem);
  color: ${theme.cream};
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
`;

const TurnBanner = styled(motion.p)`
  font-size: clamp(0.9rem, 2.4vw, 1.1rem);
  color: ${theme.creamDim};

  strong {
    color: ${theme.cream};
  }
`;

const SkipRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const SkipNote = styled.p`
  font-size: 0.85rem;
  color: #ffcf8a;
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 12px;
  border-radius: 999px;
`;

const RoundDots = styled.div`
  display: flex;
  gap: 8px;
`;

const Dot = styled.span<{ $state: "done" | "now" | "todo" }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $state }) =>
    $state === "done"
      ? theme.success
      : $state === "now"
      ? theme.gold
      : "rgba(255,255,255,0.25)"};
  box-shadow: ${({ $state }) =>
    $state === "now" ? `0 0 10px ${theme.gold}` : "none"};
`;

interface Props {
  room: RoomState;
  meId: string;
  clockOffsetRef: MutableRefObject<number>;
  lastEvent: GameEvent | null;
  onGuess: (option: string) => void;
  onPickDrinkers: (playerIds: string[]) => void;
  onSkipTurn: () => void;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

export default function GameTable({
  room,
  meId,
  clockOffsetRef,
  onGuess,
  onPickDrinkers,
  onSkipTurn,
  onPlayAgain,
  onBackToLobby,
}: Props) {
  const game = room.game;
  const skipSeconds = useCountdown(game?.skipDeadline, clockOffsetRef);

  // Seat everyone around the table with "me" pinned to the bottom.
  const seats = useMemo(() => {
    if (!game) return [];
    const order = game.turnOrder.filter((id) =>
      room.players.some((p) => p.id === id)
    );
    const myIdx = Math.max(0, order.indexOf(meId));
    const n = order.length;
    return order.map((id, i) => {
      const rel = (i - myIdx + n) % n;
      const angle = (Math.PI / 2) + (2 * Math.PI * rel) / n;
      return {
        id,
        x: 50 + 40 * Math.cos(angle),
        y: 50 + 33 * Math.sin(angle),
      };
    });
  }, [game, room.players, meId]);

  if (!game) return null;

  const currentId = game.currentPlayerId;
  const currentPlayer = room.players.find((p) => p.id === currentId);
  const isMyTurn = currentId === meId && game.awaiting === "guess";
  const iAmHost = room.hostId === meId;
  const roundInfo = ROUND_INFO[Math.min(game.round, 3)];
  const showSkip =
    game.awaiting === "guess" &&
    currentPlayer &&
    (!currentPlayer.connected || currentPlayer.left);
  const celebrating =
    game.lastResult?.type === "guess" && game.lastResult.correct === true;
  const crowd = Math.max(1.2, Math.sqrt(seats.length) * 0.72);

  return (
    <Wrap
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TableFelt style={{ ["--crowd" as any]: crowd }}>
        <CenterHub>
          <RoundBadge>Round {game.round + 1} of 4</RoundBadge>
          <RoundTitle>{roundInfo.title}</RoundTitle>
          <RoundDots>
            {[0, 1, 2, 3].map((r) => (
              <Dot
                key={r}
                $state={r < game.round ? "done" : r === game.round ? "now" : "todo"}
              />
            ))}
          </RoundDots>
          {room.phase === "playing" && (
            <AnimatePresence mode="wait">
              <TurnBanner
                key={`${currentId}-${game.round}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {isMyTurn ? (
                  <strong>Your turn — {roundInfo.question}</strong>
                ) : (
                  <>
                    Waiting on <strong>{currentPlayer?.username ?? "…"}</strong>
                  </>
                )}
              </TurnBanner>
            </AnimatePresence>
          )}
          {showSkip && (
            <SkipRow>
              <SkipNote>
                {currentPlayer?.username} is offline — skipping in {skipSeconds ?? "…"}s
              </SkipNote>
              {iAmHost && (
                <GhostButton onClick={onSkipTurn} style={{ padding: "6px 16px" }}>
                  Skip now
                </GhostButton>
              )}
            </SkipRow>
          )}
        </CenterHub>

        {seats.map(({ id, x, y }) => {
          const player = room.players.find((p) => p.id === id);
          if (!player) return null;
          return (
            <Seat
              key={id}
              player={player}
              hand={game.hands[id] ?? []}
              x={x}
              y={y}
              isMe={id === meId}
              isTurn={id === currentId && game.awaiting !== "interlude"}
            />
          );
        })}
      </TableFelt>

      <GuessBar
        isMyTurn={isMyTurn}
        round={game.round}
        statusText={
          room.phase === "results" ? (
            <>That&apos;s the game! 🍻</>
          ) : game.awaiting === "drink_pick" ? (
            <>
              <strong>{currentPlayer?.username}</strong> is choosing who drinks…
            </>
          ) : (
            <>
              Waiting on <strong>{currentPlayer?.username ?? "…"}</strong>
            </>
          )
        }
        onGuess={onGuess}
      />

      <ResultOverlay
        room={room}
        meId={meId}
        clockOffsetRef={clockOffsetRef}
        onPickDrinkers={onPickDrinkers}
      />

      {room.phase === "results" && (
        <GameOverOverlay
          room={room}
          meId={meId}
          onPlayAgain={onPlayAgain}
          onBackToLobby={onBackToLobby}
        />
      )}

      <Confetti active={!!celebrating} />
    </Wrap>
  );
}
