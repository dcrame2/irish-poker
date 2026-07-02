import React from "react";
import styled, { css, keyframes } from "styled-components";
import { theme } from "@/styles/theme";
import type { MaskedCard, Suit } from "@lib/types";

// Cards are drawn entirely with CSS/text — crisp at any size, zero network
// requests. Size is controlled by the --card-w CSS variable on any ancestor.

const SUIT_GLYPH: Record<Suit, string> = {
  HEARTS: "♥",
  DIAMONDS: "♦",
  SPADES: "♠",
  CLUBS: "♣",
};

const SHORT_RANK: Record<string, string> = {
  JACK: "J",
  QUEEN: "Q",
  KING: "K",
  ACE: "A",
};

function isRed(suit: Suit) {
  return suit === "HEARTS" || suit === "DIAMONDS";
}

const dealIn = keyframes`
  from {
    transform: translateY(-30px) scale(0.6);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const CardScene = styled.div<{ $index?: number }>`
  width: var(--card-w, 52px);
  aspect-ratio: 5 / 7;
  perspective: 600px;
  animation: ${dealIn} 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: ${({ $index }) => ($index ?? 0) * 0.08}s;
`;

const CardInner = styled.div<{ $flipped: boolean; $glow: string | null }>`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform: rotateY(${({ $flipped }) => ($flipped ? "180deg" : "0deg")});
  border-radius: calc(var(--card-w, 52px) * 0.12);
  ${({ $glow }) =>
    $glow &&
    css`
      box-shadow: 0 0 0 2px ${$glow}, 0 0 18px ${$glow};
    `}
`;

const face = css`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: calc(var(--card-w, 52px) * 0.12);
  overflow: hidden;
`;

const CardBack = styled.div`
  ${face}
  background:
    radial-gradient(circle at 50% 40%, #1c6e40 0%, #0e4527 70%, #0a331d 100%);
  border: 1px solid rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;

  &::before {
    content: "";
    position: absolute;
    inset: calc(var(--card-w, 52px) * 0.07);
    border: 1.5px solid rgba(233, 184, 76, 0.55);
    border-radius: calc(var(--card-w, 52px) * 0.08);
  }

  &::after {
    content: "☘";
    font-size: calc(var(--card-w, 52px) * 0.42);
    color: rgba(233, 184, 76, 0.85);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
`;

const CardFace = styled.div<{ $red: boolean }>`
  ${face}
  background: linear-gradient(160deg, #ffffff 0%, #f2efe6 100%);
  border: 1px solid rgba(0, 0, 0, 0.25);
  color: ${({ $red }) => ($red ? "#d22730" : "#1b1f26")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform: rotateY(180deg);
`;

const Corner = styled.div<{ $bottom?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  padding: calc(var(--card-w, 52px) * 0.06);
  font-weight: 700;
  font-size: calc(var(--card-w, 52px) * 0.22);
  align-self: ${({ $bottom }) => ($bottom ? "flex-end" : "flex-start")};
  transform: ${({ $bottom }) => ($bottom ? "rotate(180deg)" : "none")};

  span:last-child {
    font-size: calc(var(--card-w, 52px) * 0.2);
  }
`;

const CenterSuit = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: calc(var(--card-w, 52px) * 0.52);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
`;

interface Props {
  card: MaskedCard;
  index?: number;
}

function PlayingCard({ card, index }: Props) {
  const flipped = !card.hidden;
  let glow: string | null = null;
  if (!card.hidden && card.correct === true) glow = "rgba(79, 200, 120, 0.8)";
  if (!card.hidden && card.correct === false) glow = "rgba(230, 72, 77, 0.75)";

  return (
    <CardScene $index={index}>
      <CardInner $flipped={flipped} $glow={glow}>
        <CardBack />
        {!card.hidden ? (
          <CardFace $red={isRed(card.suit)}>
            <Corner>
              <span>{SHORT_RANK[card.label] ?? card.label}</span>
              <span>{SUIT_GLYPH[card.suit]}</span>
            </Corner>
            <CenterSuit>{SUIT_GLYPH[card.suit]}</CenterSuit>
            <Corner $bottom>
              <span>{SHORT_RANK[card.label] ?? card.label}</span>
              <span>{SUIT_GLYPH[card.suit]}</span>
            </Corner>
          </CardFace>
        ) : (
          <CardFace $red={false} />
        )}
      </CardInner>
    </CardScene>
  );
}

export default React.memo(PlayingCard);
