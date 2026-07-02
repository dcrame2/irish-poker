import React from "react";
import styled, { css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme, mq } from "@/styles/theme";
import { ROUND_INFO } from "@lib/types";
import type { MaskedCard } from "@lib/types";
import PlayingCard from "./PlayingCard";

// Always-present action bar below the table. On your turn it holds the
// guess buttons; otherwise it shows whose turn it is. Being in normal
// flow (not a fixed overlay) means it never covers anyone's cards.

const Bar = styled.div`
  min-height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 8px calc(10px + env(safe-area-inset-bottom));

  @media ${mq.mobile} {
    min-height: 80px;
    gap: 8px;
  }
`;

const toneStyles = {
  red: css`
    background: linear-gradient(180deg, #f0666b 0%, ${theme.red} 55%, ${theme.redDark} 100%);
    color: white;
    box-shadow: 0 4px 0 #7c1d20, 0 10px 24px rgba(0, 0, 0, 0.4);
  `,
  black: css`
    background: linear-gradient(180deg, #3a4150 0%, ${theme.black} 60%, #05070a 100%);
    color: white;
    box-shadow: 0 4px 0 #000, 0 10px 24px rgba(0, 0, 0, 0.4);
  `,
  gold: css`
    background: linear-gradient(180deg, #f5cf7d 0%, ${theme.gold} 55%, #c9962f 100%);
    color: ${theme.feltDark};
    box-shadow: 0 4px 0 #8a6519, 0 10px 24px rgba(0, 0, 0, 0.4);
  `,
};

const OptionButton = styled(motion.button)<{ $tone: "red" | "black" | "gold" }>`
  border: none;
  border-radius: 16px;
  font-family: ${theme.fontBody};
  font-size: clamp(1rem, 3vw, 1.25rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 15px 32px;
  min-width: 120px;
  ${({ $tone }) => toneStyles[$tone]}

  @media ${mq.mobile} {
    padding: 13px 8px;
    min-width: 0;
    flex: 1;
    max-width: 150px;
  }
`;

const RefCards = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid ${theme.panelBorder};
  --card-w: 44px;

  @media ${mq.mobile} {
    --card-w: 38px;
    padding: 4px 8px;
  }
`;

const RefLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.creamDim};
  max-width: 64px;
  line-height: 1.2;

  @media ${mq.mobile} {
    display: none;
  }
`;

const StatusPill = styled(motion.p)`
  font-size: 1.05rem;
  color: ${theme.creamDim};
  background: ${theme.glass};
  border: 1px solid ${theme.panelBorder};
  padding: 10px 22px;
  border-radius: 999px;
  text-align: center;

  strong {
    color: ${theme.cream};
  }
`;

interface Props {
  isMyTurn: boolean;
  round: number;
  refCards?: MaskedCard[];
  statusText: React.ReactNode;
  onGuess: (option: string) => void;
}

export default function GuessBar({
  isMyTurn,
  round,
  refCards = [],
  statusText,
  onGuess,
}: Props) {
  const options = ROUND_INFO[Math.min(round, 3)].options;
  const revealedRefs = refCards.filter((c) => !c.hidden);

  return (
    <Bar>
      <AnimatePresence mode="wait">
        {isMyTurn ? (
          <React.Fragment key={`opts-${round}`}>
            {revealedRefs.length > 0 && (
              <RefCards
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <RefLabel>{round === 1 ? "vs your card" : "your range"}</RefLabel>
                {revealedRefs.map((c, i) => (
                  <PlayingCard key={i} card={c} />
                ))}
              </RefCards>
            )}
            {options.map((opt, i) => (
              <OptionButton
                key={opt.key}
                $tone={opt.tone as "red" | "black" | "gold"}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                  delay: i * 0.05,
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => onGuess(opt.key)}
              >
                {opt.label}
              </OptionButton>
            ))}
          </React.Fragment>
        ) : (
          <StatusPill
            key="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {statusText}
          </StatusPill>
        )}
      </AnimatePresence>
    </Bar>
  );
}
