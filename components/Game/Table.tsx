import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme, mq } from "@/styles/theme";
import type { RoomState, GameEvent } from "@lib/types";
import { ROUND_INFO } from "@lib/types";
import Seat from "./Seat";
import GuessBar from "./GuessBar";
import ResultOverlay from "./ResultOverlay";
import GameOverOverlay from "./GameOverOverlay";
import Confetti from "./Confetti";
import { EmoteBar, EmoteFloaters } from "./Emotes";
import type { FloatingEmote } from "../App/Index";
import { useCountdown } from "./useCountdown";
import { GhostButton } from "../ui/shared";
import AdBanner from "../Ads/AdBanner";
import { AD_SLOTS } from "@lib/ads";

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

const sheen = keyframes`
  0%, 100% { opacity: 0.05; transform: translateX(-12%) rotate(-8deg); }
  50% { opacity: 0.14; transform: translateX(12%) rotate(-8deg); }
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
  overflow: hidden;
  /* Card size scales with viewport and shrinks as the table gets crowded */
  --card-w: clamp(26px, calc((5.2vw + 4.5vh) / var(--crowd, 1.4)), 58px);

  /* compact grid: two seats share each row, so size cards to half the width */
  &[data-compact="true"] {
    --card-w: clamp(19px, 9.4vw, 42px);
    border-radius: 34px;
  }

  /* gold pinstripe just inside the rail */
  &::before {
    content: "";
    position: absolute;
    inset: 6px;
    border-radius: inherit;
    border: 1.5px solid rgba(233, 184, 76, 0.28);
    pointer-events: none;
    z-index: 1;
  }

  /* slow light sweep across the felt */
  &::after {
    content: "";
    position: absolute;
    inset: -20%;
    background: linear-gradient(
      100deg,
      transparent 42%,
      rgba(255, 255, 255, 0.35) 50%,
      transparent 58%
    );
    animation: ${sheen} 9s ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
  }
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

/* ---- compact (phone) layout: nothing absolute, nothing can clip ---- */

const CompactScroll = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* flex-start (not space-between) so an overflowing player list scrolls
     instead of clipping the top row */
  justify-content: flex-start;
  gap: 12px;
  /* extra bottom room so the floating emote bar never covers my cards */
  padding: 16px 8px 72px;
`;

const OthersGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  justify-items: center;
  row-gap: 12px;
  column-gap: 4px;

  /* center a lone seat on an odd row */
  > *:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
`;

const CompactHub = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  text-align: center;
  padding: 4px 0;
  /* soak up leftover vertical space so hub floats between rows and my seat */
  margin: auto 0;
`;

const MeRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
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

/* Thin anchor ad pinned under the guess bar; the fixed height keeps it out
   of the flex math mid-game and the gap keeps it clear of the guess buttons */
const AnchorAd = styled(AdBanner)`
  margin-top: 6px;
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
  emotes: FloatingEmote[];
  beerBurst: number;
  onEmote: (emoji: string) => void;
  onGuess: (option: string) => void;
  onPickDrinkers: (playerIds: string[]) => void;
  onSkipTurn: () => void;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

// Below this width the ellipse can't physically fit wide seats, so the
// table switches to a stacked grid where nothing can overlap or clip.
function useIsCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 760px)");
    const update = () => setCompact(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return compact;
}

export default function GameTable({
  room,
  meId,
  clockOffsetRef,
  emotes,
  beerBurst,
  onEmote,
  onGuess,
  onPickDrinkers,
  onSkipTurn,
  onPlayAgain,
  onBackToLobby,
}: Props) {
  const game = room.game;
  const skipSeconds = useCountdown(game?.skipDeadline, clockOffsetRef);
  const compact = useIsCompact();
  const compactScrollRef = useRef<HTMLDivElement>(null);
  const currentTurnId = game?.currentPlayerId ?? null;

  // On phones the player list can overflow — keep the view pinned to the
  // bottom (my cards + the round hub) on entry and whenever my turn starts.
  useEffect(() => {
    const el = compactScrollRef.current;
    if (!el) return;
    if (currentTurnId === meId || currentTurnId === null) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [compact, currentTurnId, meId]);

  useEffect(() => {
    const el = compactScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [compact]);

  // Everyone in turn order, rotated so I'm last (bottom of the table).
  const seatOrder = useMemo(() => {
    if (!game) return [];
    const order = game.turnOrder.filter((id) =>
      room.players.some((p) => p.id === id)
    );
    const myIdx = order.indexOf(meId);
    if (myIdx === -1) return order;
    return order.map((_, i) => order[(myIdx + 1 + i) % order.length]);
  }, [game, room.players, meId]);

  // Ellipse positions for the wide layout, with side seats clamped so a
  // full hand of cards never pokes past the felt.
  const seats = useMemo(() => {
    const n = seatOrder.length;
    return seatOrder.map((id, i) => {
      // i = 0..n-1 with me last; angle walks the ellipse from the bottom
      const rel = (i + 1) % n;
      const angle = Math.PI / 2 + (2 * Math.PI * rel) / n;
      return {
        id,
        x: Math.min(86, Math.max(14, 50 + 40 * Math.cos(angle))),
        y: Math.min(84, Math.max(13, 50 + 33 * Math.sin(angle))),
      };
    });
  }, [seatOrder]);

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
  const seatPos: Record<string, { x: number; y: number }> = {};
  for (const s of seats) seatPos[s.id] = { x: s.x, y: s.y };
  const myHand = game.hands[meId] ?? [];
  const refCards =
    game.round === 1
      ? myHand.slice(0, 1)
      : game.round === 2
      ? myHand.slice(0, 2)
      : [];

  const hubContent = (
    <>
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
    </>
  );

  const renderSeat = (id: string, pos?: { x: number; y: number }) => {
    const player = room.players.find((p) => p.id === id);
    if (!player) return null;
    return (
      <Seat
        key={id}
        player={player}
        hand={game.hands[id] ?? []}
        x={pos?.x}
        y={pos?.y}
        isMe={id === meId}
        isTurn={id === currentId && game.awaiting !== "interlude"}
      />
    );
  };

  const othersIds = seatOrder.filter((id) => id !== meId);
  const meSeated = seatOrder.includes(meId);
  const showAnchor = room.phase !== "results";

  return (
    <Wrap
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      // Height the bottom ad banner occupies (50px + 6px gap) — the fixed
      // emote bar reads this to stay clear of the guess bar.
      style={{ ["--anchor-h" as any]: showAnchor ? "56px" : "0px" }}
    >
      <TableFelt
        data-compact={compact ? "true" : "false"}
        style={{ ["--crowd" as any]: crowd }}
      >
        {compact ? (
          <CompactScroll ref={compactScrollRef}>
            <OthersGrid>{othersIds.map((id) => renderSeat(id))}</OthersGrid>
            <CompactHub>{hubContent}</CompactHub>
            {meSeated && <MeRow>{renderSeat(meId)}</MeRow>}
          </CompactScroll>
        ) : (
          <>
            <CenterHub>{hubContent}</CenterHub>
            {seats.map(({ id, x, y }) => renderSeat(id, { x, y }))}
          </>
        )}

        <EmoteFloaters emotes={emotes} seatPos={compact ? {} : seatPos} />
      </TableFelt>

      <EmoteBar onEmote={onEmote} />

      <GuessBar
        isMyTurn={isMyTurn}
        round={game.round}
        refCards={refCards}
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

      {showAnchor && <AnchorAd slot={AD_SLOTS.gameAnchor} height={50} />}

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
      <Confetti fireKey={beerBurst} emoji="🍺" />
    </Wrap>
  );
}
