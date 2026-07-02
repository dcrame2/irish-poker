import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme, mq, avatarColor } from "@/styles/theme";
import type { RoomState } from "@lib/types";
import {
  DisplayTitle,
  GoldButton,
  DangerButton,
  GlassPanel,
  Avatar,
  pulseGold,
} from "../ui/shared";
import RulesContent from "../Menu/RulesContent";

const Wrap = styled(motion.main)`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 86px 20px 40px;
  position: relative;
  z-index: 1;
`;

const Title = styled(DisplayTitle)`
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  text-align: center;
`;

const CodePanel = styled(GlassPanel)`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 14px 22px;
  border-radius: 18px;
`;

const CodeLabel = styled.span`
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${theme.creamDim};
`;

const Code = styled.span`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.4em;
  color: ${theme.gold};
  text-shadow: 0 0 24px rgba(233, 184, 76, 0.4);
`;

const CopyBtn = styled.button`
  background: ${theme.glass};
  border: 1px solid ${theme.panelBorder};
  color: ${theme.cream};
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 0.9rem;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
`;

const PlayersPanel = styled(GlassPanel)`
  width: min(560px, 100%);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const PanelHeading = styled.h2`
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${theme.creamDim};
  font-weight: 600;
`;

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
`;

const PlayerChip = styled(motion.div)<{ $dim: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: ${theme.glass};
  border: 1px solid ${theme.panelBorder};
  opacity: ${({ $dim }) => ($dim ? 0.45 : 1)};
`;

const PlayerName = styled.span`
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HostTag = styled.span`
  font-size: 0.85rem;
`;

const StatusDot = styled.span<{ $on: boolean }>`
  width: 8px;
  height: 8px;
  min-width: 8px;
  border-radius: 50%;
  margin-left: auto;
  background: ${({ $on }) => ($on ? theme.success : theme.danger)};
  box-shadow: 0 0 8px ${({ $on }) => ($on ? theme.success : theme.danger)};
`;

const StartButton = styled(GoldButton)`
  animation: ${pulseGold} 2s infinite;
  font-size: 1.15rem;
  padding: 16px 42px;
`;

const WaitingNote = styled.p`
  color: ${theme.creamDim};
  font-size: 1rem;
  text-align: center;
`;

const RulesToggle = styled.button`
  background: none;
  border: none;
  color: ${theme.gold};
  font-size: 0.95rem;
  text-decoration: underline;
  text-underline-offset: 4px;
`;

const RulesBox = styled(motion.div)`
  width: min(560px, 100%);
  overflow: hidden;
`;

const RulesInner = styled(GlassPanel)`
  padding: 20px 22px;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  @media ${mq.mobile} {
    width: 100%;
  }
`;

interface Props {
  room: RoomState;
  meId: string;
  onStart: () => void;
  onLeave: () => void;
}

export default function Lobby({ room, meId, onStart, onLeave }: Props) {
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const isHost = room.hostId === meId;
  const host = room.players.find((p) => p.isHost);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — code is on screen anyway */
    }
  };

  return (
    <Wrap
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <Title>The Lobby</Title>

      <CodePanel>
        <div style={{ display: "grid", gap: 2 }}>
          <CodeLabel>Party code</CodeLabel>
          <Code>{room.code}</Code>
        </div>
        <CopyBtn onClick={copyCode}>{copied ? "Copied ✓" : "Copy"}</CopyBtn>
      </CodePanel>

      <PlayersPanel>
        <PanelHeading>
          Players — {room.players.length}/10
        </PanelHeading>
        <PlayerGrid>
          <AnimatePresence>
            {room.players.map((p) => (
              <PlayerChip
                key={p.id}
                $dim={!p.connected}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Avatar $color={avatarColor(p.avatar)} $size={34}>
                  {p.username.charAt(0)}
                </Avatar>
                <PlayerName>
                  {p.username}
                  {p.id === meId && " (you)"}
                </PlayerName>
                {p.isHost && <HostTag title="Host">👑</HostTag>}
                <StatusDot $on={p.connected} />
              </PlayerChip>
            ))}
          </AnimatePresence>
        </PlayerGrid>
      </PlayersPanel>

      {isHost ? (
        <StartButton onClick={onStart}>Deal the Cards 🃏</StartButton>
      ) : (
        <WaitingNote>
          Waiting for {host?.username ?? "the host"} to deal the cards…
        </WaitingNote>
      )}

      <Row>
        <RulesToggle onClick={() => setShowRules((s) => !s)}>
          {showRules ? "Hide the rules" : "How do you play?"}
        </RulesToggle>
        <DangerButton onClick={onLeave} style={{ padding: "8px 18px" }}>
          Leave party
        </DangerButton>
      </Row>

      <AnimatePresence>
        {showRules && (
          <RulesBox
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <RulesInner>
              <RulesContent />
            </RulesInner>
          </RulesBox>
        )}
      </AnimatePresence>
    </Wrap>
  );
}
