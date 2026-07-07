import React, { useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme, mq } from "@/styles/theme";
import type { FloatingEmote } from "../App/Index";

export const EMOTES = ["🍻", "😂", "💀", "🔥", "👏", "🍀"];

const Bar = styled.div`
  position: fixed;
  left: 12px;
  /* --anchor-h is the height of the bottom ad banner (set on the table
     Wrap) so the bar keeps floating just above the guess bar */
  bottom: calc(104px + var(--anchor-h, 0px) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 45;
  background: rgba(5, 20, 12, 0.75);
  border: 1px solid ${theme.panelBorder};
  border-radius: 999px;
  padding: 8px 6px;
  backdrop-filter: blur(10px);

  @media ${mq.mobile} {
    flex-direction: row;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(88px + var(--anchor-h, 0px) + env(safe-area-inset-bottom));
    padding: 5px 10px;
  }
`;

const EmoteButton = styled(motion.button)`
  border: none;
  background: transparent;
  font-size: 1.35rem;
  line-height: 1;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.15s;

  &:hover {
    background: rgba(233, 184, 76, 0.18);
  }

  @media ${mq.mobile} {
    font-size: 1.2rem;
  }
`;

const Floater = styled(motion.div)<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  font-size: 2.1rem;
  pointer-events: none;
  z-index: 20;
  text-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FloaterName = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  color: ${theme.cream};
  background: rgba(0, 0, 0, 0.5);
  padding: 1px 8px;
  border-radius: 999px;
`;

export function EmoteBar({ onEmote }: { onEmote: (emoji: string) => void }) {
  const lastSent = useRef(0);
  const send = (emoji: string) => {
    const now = Date.now();
    if (now - lastSent.current < 450) return;
    lastSent.current = now;
    onEmote(emoji);
  };

  return (
    <Bar>
      {EMOTES.map((e) => (
        <EmoteButton
          key={e}
          whileHover={{ scale: 1.25, rotate: -8 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => send(e)}
          aria-label={`React ${e}`}
        >
          {e}
        </EmoteButton>
      ))}
    </Bar>
  );
}

interface FloatersProps {
  emotes: FloatingEmote[];
  // seat lookup: playerId -> {x, y} in % of the felt
  seatPos: Record<string, { x: number; y: number }>;
}

export function EmoteFloaters({ emotes, seatPos }: FloatersProps) {
  return (
    <AnimatePresence>
      {emotes.map((em) => {
        const pos = seatPos[em.playerId] ?? { x: 50, y: 62 };
        return (
          <Floater
            key={em.id}
            $x={pos.x}
            $y={pos.y}
            initial={{ opacity: 0, y: 10, scale: 0.4 }}
            animate={{ opacity: 1, y: -70, scale: 1.15 }}
            exit={{ opacity: 0, y: -110, scale: 0.8 }}
            transition={{ duration: 1.9, ease: "easeOut" }}
          >
            <span>{em.emoji}</span>
            <FloaterName>{em.username}</FloaterName>
          </Floater>
        );
      })}
    </AnimatePresence>
  );
}
