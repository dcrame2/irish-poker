import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { theme, avatarColor } from "@/styles/theme";
import type { RoomState } from "@lib/types";
import {
  GoldButton,
  GhostButton,
  GlassPanel,
  Avatar,
  DisplayTitle,
} from "../ui/shared";

const Dim = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(2, 10, 6, 0.78);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 18px;
  z-index: 55;
`;

const Panel = styled(GlassPanel)`
  width: min(460px, 100%);
  max-height: 88dvh;
  overflow-y: auto;
  padding: 30px 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
`;

const Title = styled(DisplayTitle)`
  font-size: clamp(2.4rem, 8vw, 3.2rem);
`;

const Subtitle = styled.p`
  color: ${theme.creamDim};
  font-size: 1.05rem;
  margin-top: -10px;
`;

const Standings = styled.ol`
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled(motion.li)<{ $top: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 14px;
  background: ${({ $top }) =>
    $top ? "rgba(233, 184, 76, 0.16)" : theme.glass};
  border: 1px solid
    ${({ $top }) => ($top ? theme.gold : theme.panelBorder)};
`;

const Medal = styled.span`
  font-size: 1.2rem;
  min-width: 28px;
`;

const Name = styled.span`
  font-weight: 600;
  font-size: 1.05rem;
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DrinkCount = styled.span`
  font-weight: 700;
  color: ${theme.gold};
  white-space: nowrap;
`;

const Buttons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const WaitNote = styled.p`
  color: ${theme.creamDim};
  font-style: italic;
`;

const MEDALS = ["🥇", "🥈", "🥉"];

interface Props {
  room: RoomState;
  meId: string;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

export default function GameOverOverlay({
  room,
  meId,
  onPlayAgain,
  onBackToLobby,
}: Props) {
  const isHost = room.hostId === meId;
  const host = room.players.find((p) => p.isHost);
  const standings = [...room.players]
    .filter((p) => room.game?.turnOrder.includes(p.id))
    .sort((a, b) => b.drinks - a.drinks);

  return (
    <Dim initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Panel
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.2 }}
      >
        <Title>Sláinte! 🍻</Title>
        <Subtitle>That&apos;s the game — here&apos;s the damage</Subtitle>

        <Standings>
          {standings.map((p, i) => (
            <Row
              key={p.id}
              $top={i === 0 && p.drinks > 0}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
            >
              <Medal>{MEDALS[i] ?? `${i + 1}.`}</Medal>
              <Avatar $color={avatarColor(p.avatar)} $size={32}>
                {p.username.charAt(0)}
              </Avatar>
              <Name>
                {p.username}
                {p.id === meId && " (you)"}
              </Name>
              <DrinkCount>
                🍺 {p.drinks} drink{p.drinks === 1 ? "" : "s"}
              </DrinkCount>
            </Row>
          ))}
        </Standings>

        {isHost ? (
          <Buttons>
            <GoldButton onClick={onPlayAgain}>Run it back 🔁</GoldButton>
            <GhostButton onClick={onBackToLobby}>Back to lobby</GhostButton>
          </Buttons>
        ) : (
          <WaitNote>
            {host?.username ?? "The host"} can start the next round
          </WaitNote>
        )}
      </Panel>
    </Dim>
  );
}
