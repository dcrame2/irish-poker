import React from "react";
import styled, { css, keyframes } from "styled-components";
import { theme, avatarColor } from "@/styles/theme";
import type { PlayerView, MaskedCard } from "@lib/types";
import PlayingCard from "./PlayingCard";
import { Avatar } from "../ui/shared";

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 2px rgba(233, 184, 76, 0.9), 0 0 26px rgba(233, 184, 76, 0.55); }
  50% { box-shadow: 0 0 0 2px rgba(233, 184, 76, 0.45), 0 0 10px rgba(233, 184, 76, 0.25); }
`;

// Positioned absolutely around the ellipse on wide screens ($x/$y given),
// or laid out statically by the compact grid on phones ($x/$y undefined).
const SeatWrap = styled.div<{ $x?: number; $y?: number; $me: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: ${({ $me }) => ($me ? 5 : 3)};
  max-width: 100%;

  ${({ $x, $y, $me }) =>
    $x !== undefined && $y !== undefined
      ? css`
          position: absolute;
          left: ${$x}%;
          top: ${$y}%;
          transform: translate(-50%, -50%) scale(${$me ? 1.15 : 1});
          transition: left 0.6s ease, top 0.6s ease;
        `
      : css`
          position: relative;
          ${$me &&
          css`
            --card-w: clamp(26px, 12vw, 52px);
          `}
        `}
`;

const CardRow = styled.div<{ $turn: boolean }>`
  display: flex;
  gap: calc(var(--card-w, 52px) * 0.12);
  padding: 6px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.22);
  ${({ $turn }) =>
    $turn &&
    css`
      animation: ${glowPulse} 1.6s ease-in-out infinite;
      background: rgba(233, 184, 76, 0.12);
    `}
`;

const NamePlate = styled.div<{ $dim: boolean }>`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 12px 4px 5px;
  border-radius: 999px;
  background: rgba(5, 22, 13, 0.85);
  border: 1px solid ${theme.panelBorder};
  opacity: ${({ $dim }) => ($dim ? 0.55 : 1)};
  max-width: calc(var(--card-w, 52px) * 5);
`;

const Name = styled.span`
  font-size: 0.88rem;
  font-weight: 600;
  color: ${theme.cream};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Drinks = styled.span`
  font-size: 0.82rem;
  color: ${theme.gold};
  font-weight: 700;
  white-space: nowrap;
`;

const OfflineTag = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #ffb3b5;
  background: rgba(230, 72, 77, 0.2);
  border: 1px solid rgba(230, 72, 77, 0.45);
  padding: 2px 8px;
  border-radius: 999px;
  text-transform: uppercase;
`;

interface Props {
  player: PlayerView;
  hand: MaskedCard[];
  x?: number;
  y?: number;
  isMe: boolean;
  isTurn: boolean;
}

function Seat({ player, hand, x, y, isMe, isTurn }: Props) {
  // Cards animate in from the center of the table toward this seat.
  const dealVars = (
    x !== undefined && y !== undefined
      ? {
          "--deal-dx": `${((50 - x) * 0.8).toFixed(1)}vw`,
          "--deal-dy": `${((50 - y) * 0.7).toFixed(1)}vh`,
        }
      : { "--deal-dy": "-24px" }
  ) as unknown as React.CSSProperties;

  return (
    <SeatWrap $x={x} $y={y} $me={isMe} style={dealVars}>
      <NamePlate $dim={!player.connected}>
        <Avatar $color={avatarColor(player.avatar)} $size={26}>
          {player.username.charAt(0)}
        </Avatar>
        <Name>
          {player.isHost && "👑 "}
          {player.username}
          {isMe && " (you)"}
        </Name>
        <Drinks>🍺 {player.drinks}</Drinks>
      </NamePlate>
      {(player.left || !player.connected) && (
        <OfflineTag>{player.left ? "Left" : "Offline"}</OfflineTag>
      )}
      <CardRow $turn={isTurn}>
        {hand?.map((card, i) => (
          <PlayingCard key={i} card={card} index={i} />
        ))}
      </CardRow>
    </SeatWrap>
  );
}

export default React.memo(Seat);
