import React, { MutableRefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme, mq, avatarColor } from "@/styles/theme";
import type { RoomState } from "@lib/types";
import PlayingCard from "./PlayingCard";
import { useCountdown } from "./useCountdown";
import { GoldButton, GlassPanel, Avatar, DisplayTitle } from "../ui/shared";

const Dim = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(2, 10, 6, 0.66);
  backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
  padding: 18px;
  z-index: 50;
`;

const Panel = styled(GlassPanel)`
  width: min(480px, 100%);
  padding: 28px 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  --card-w: 110px;

  @media ${mq.mobile} {
    padding: 22px 18px;
    --card-w: 92px;
  }
`;

const Verdict = styled(DisplayTitle)<{ $good: boolean | null }>`
  font-size: clamp(2.2rem, 7vw, 3rem);
  color: ${({ $good }) =>
    $good === true ? theme.success : $good === false ? theme.red : theme.gold};
  text-shadow: 0 0 30px
    ${({ $good }) =>
      $good === true
        ? "rgba(79, 200, 120, 0.5)"
        : $good === false
        ? "rgba(230, 72, 77, 0.5)"
        : "rgba(233, 184, 76, 0.4)"};
`;

const Detail = styled.p`
  font-size: 1.1rem;
  color: ${theme.creamDim};

  strong {
    color: ${theme.cream};
    font-weight: 700;
  }
`;

const DrinkCallout = styled(motion.p)`
  font-size: 1.15rem;
  font-weight: 600;
  color: ${theme.cream};
  background: rgba(230, 72, 77, 0.22);
  border: 1px solid rgba(230, 72, 77, 0.5);
  padding: 10px 20px;
  border-radius: 14px;
`;

const PickGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const PickChip = styled.button<{ $picked: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 8px 8px;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.cream};
  background: ${({ $picked }) =>
    $picked ? "rgba(233, 184, 76, 0.28)" : theme.glass};
  border: 1.5px solid
    ${({ $picked }) => ($picked ? theme.gold : theme.panelBorder)};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.gold};
  }
`;

const CountdownText = styled.p`
  font-size: 0.85rem;
  color: ${theme.creamDim};
`;

const WaitNote = styled.p`
  font-size: 1.05rem;
  color: ${theme.creamDim};
  font-style: italic;
`;

interface Props {
  room: RoomState;
  meId: string;
  clockOffsetRef: MutableRefObject<number>;
  onPickDrinkers: (playerIds: string[]) => void;
}

export default function ResultOverlay({
  room,
  meId,
  clockOffsetRef,
  onPickDrinkers,
}: Props) {
  const game = room.game;
  const result = game?.lastResult ?? null;
  const picking = game?.awaiting === "drink_pick";
  const interlude = game?.awaiting === "interlude" && !!result;
  const show = room.phase === "playing" && (picking || interlude);

  const [picked, setPicked] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const pickSeconds = useCountdown(picking ? game?.pickDeadline : null, clockOffsetRef);
  const closeSeconds = useCountdown(interlude ? game?.interludeUntil : null, clockOffsetRef);

  // Reset picker state for each new result.
  const resultKey = result ? `${result.playerId}-${result.round}-${result.type}` : "none";
  useEffect(() => {
    setPicked([]);
    setConfirmed(false);
  }, [resultKey]);

  if (!game || !result) return null;

  const iAmPicker = picking && result.playerId === meId;
  const others = room.players.filter(
    (p) => p.id !== result.playerId && !p.left && p.connected
  );
  const good = result.type === "skip" ? null : result.correct ?? null;
  const verdictText =
    result.type === "skip" ? "SKIPPED" : good ? "LUCKY!" : "UNLUCKY!";

  const cardText =
    result.card && !result.card.hidden
      ? `${result.card.label.toLowerCase()} of ${result.card.suit.toLowerCase()}`
      : "";

  const togglePick = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const confirm = () => {
    setConfirmed(true);
    onPickDrinkers(picked);
  };

  return (
    <AnimatePresence>
      {show && (
        <Dim
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Panel
            key={resultKey}
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            style={{
              borderColor:
                good === true
                  ? "rgba(79, 200, 120, 0.55)"
                  : good === false
                  ? "rgba(230, 72, 77, 0.55)"
                  : undefined,
              boxShadow:
                good === true
                  ? "0 0 60px rgba(79, 200, 120, 0.25), 0 24px 60px rgba(0,0,0,0.55)"
                  : good === false
                  ? "0 0 60px rgba(230, 72, 77, 0.25), 0 24px 60px rgba(0,0,0,0.55)"
                  : undefined,
            }}
          >
            <Verdict
              as={motion.h1}
              $good={good}
              initial={{ scale: 0.2, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 13, delay: 0.1 }}
            >
              {verdictText}
            </Verdict>

            {result.card && <PlayingCard card={result.card} />}

            {result.type === "guess" ? (
              <Detail>
                <strong>{result.username}</strong> called{" "}
                <strong>{result.option}</strong>, but it was the{" "}
                <strong>{cardText}</strong>
              </Detail>
            ) : (
              <Detail>
                <strong>{result.username}</strong> wasn&apos;t around, so the
                card flipped itself{cardText && <>: <strong>{cardText}</strong></>}
              </Detail>
            )}

            {good === false && (
              <DrinkCallout
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 300 }}
              >
                {result.playerId === meId
                  ? "Wrong call. Take a drink! 🍺"
                  : `${result.username} drinks! 🍺`}
              </DrinkCallout>
            )}

            {picking && iAmPicker && !confirmed && (
              <>
                <Detail>
                  <strong>Right call!</strong> Choose who drinks:
                </Detail>
                <PickGrid>
                  {others.map((p) => (
                    <PickChip
                      key={p.id}
                      $picked={picked.includes(p.id)}
                      onClick={() => togglePick(p.id)}
                    >
                      <Avatar $color={avatarColor(p.avatar)} $size={26}>
                        {p.username.charAt(0)}
                      </Avatar>
                      {p.username}
                      {picked.includes(p.id) && " 🍺"}
                    </PickChip>
                  ))}
                </PickGrid>
                <GoldButton onClick={confirm} disabled={picked.length === 0}>
                  {picked.length === 0
                    ? "Pick your victims"
                    : `Send ${picked.length} drink${picked.length > 1 ? "s" : ""} 🍻`}
                </GoldButton>
                {pickSeconds !== null && (
                  <CountdownText>Auto-passes in {pickSeconds}s</CountdownText>
                )}
              </>
            )}

            {picking && !iAmPicker && (
              <>
                <WaitNote>
                  {result.username} is deciding who drinks…
                </WaitNote>
                {pickSeconds !== null && (
                  <CountdownText>({pickSeconds}s)</CountdownText>
                )}
              </>
            )}

            {interlude && result.drinkers && result.drinkers.length > 0 && (
              <DrinkCallout
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                🍺 Drink up:{" "}
                {result.drinkers.map((d) => d.username).join(", ")}
              </DrinkCallout>
            )}

            {interlude && closeSeconds !== null && (
              <CountdownText>Next turn in {closeSeconds}s</CountdownText>
            )}
          </Panel>
        </Dim>
      )}
    </AnimatePresence>
  );
}
