import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme, mq } from "@/styles/theme";

export interface Toast {
  id: number;
  text: string;
  tone: "info" | "success" | "warn" | "gold";
}

const Stack = styled.div`
  position: fixed;
  top: 72px;
  right: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 80;
  pointer-events: none;
  max-width: min(340px, calc(100vw - 28px));

  @media ${mq.mobile} {
    left: 14px;
    align-items: stretch;
  }
`;

const TONE_BORDER: Record<Toast["tone"], string> = {
  info: theme.panelBorder,
  success: "rgba(79, 200, 120, 0.6)",
  warn: "rgba(255, 178, 90, 0.6)",
  gold: theme.gold,
};

const ToastBubble = styled(motion.div)<{ $tone: Toast["tone"] }>`
  background: ${theme.panel};
  border: 1px solid ${({ $tone }) => TONE_BORDER[$tone]};
  border-radius: 14px;
  padding: 11px 16px;
  font-size: 0.95rem;
  color: ${theme.cream};
  box-shadow: ${theme.shadowMd};
  backdrop-filter: blur(12px);
`;

export default function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <Stack>
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastBubble
            key={t.id}
            $tone={t.tone}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            {t.text}
          </ToastBubble>
        ))}
      </AnimatePresence>
    </Stack>
  );
}
