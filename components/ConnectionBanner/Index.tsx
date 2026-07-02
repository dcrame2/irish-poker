import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "@/styles/theme";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Banner = styled(motion.div)<{ $good: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ $good }) => ($good ? theme.feltDark : theme.cream)};
  background: ${({ $good }) =>
    $good
      ? `linear-gradient(90deg, ${theme.success}, #6fdd96)`
      : "linear-gradient(90deg, #7a2225, #a4272b)"};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
`;

const Spinner = styled.span`
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

interface Props {
  connected: boolean;
  everConnected: boolean;
  rejoining: boolean;
}

export default function ConnectionBanner({
  connected,
  everConnected,
  rejoining,
}: Props) {
  const [showRestored, setShowRestored] = useState(false);
  const [wasDown, setWasDown] = useState(false);

  useEffect(() => {
    if (!connected && everConnected) {
      setWasDown(true);
    }
    if (connected && wasDown) {
      setShowRestored(true);
      setWasDown(false);
      const t = setTimeout(() => setShowRestored(false), 2500);
      return () => clearTimeout(t);
    }
  }, [connected, everConnected, wasDown]);

  const showTrouble = everConnected && !connected;

  return (
    <AnimatePresence>
      {showTrouble && (
        <Banner
          key="down"
          $good={false}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          exit={{ y: -50 }}
        >
          <Spinner />
          Connection lost — reconnecting… your seat is safe
        </Banner>
      )}
      {!showTrouble && (showRestored || rejoining) && (
        <Banner
          key="up"
          $good
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          exit={{ y: -50 }}
        >
          {rejoining ? "Reconnecting to your game…" : "Reconnected ✓"}
        </Banner>
      )}
    </AnimatePresence>
  );
}
