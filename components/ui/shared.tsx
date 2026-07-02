import styled, { css, keyframes } from "styled-components";
import { motion } from "framer-motion";
import { theme, mq } from "@/styles/theme";

export const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export const pulseGold = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(233, 184, 76, 0.55); }
  50% { box-shadow: 0 0 0 12px rgba(233, 184, 76, 0); }
`;

export const DisplayTitle = styled.h1`
  font-family: ${theme.fontDisplay};
  font-weight: 400;
  color: ${theme.cream};
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.4), 0 0 40px rgba(233, 184, 76, 0.25);
  letter-spacing: 0.02em;
`;

const buttonBase = css`
  font-family: ${theme.fontBody};
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: 0.03em;
  border: none;
  border-radius: 14px;
  padding: 14px 26px;
  color: ${theme.feltDark};
  background: linear-gradient(180deg, #f5cf7d 0%, ${theme.gold} 55%, #c9962f 100%);
  box-shadow: 0 4px 0 #8a6519, 0 10px 24px rgba(0, 0, 0, 0.35);
  transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.2s ease;
  user-select: none;

  &:hover:not(:disabled) {
    filter: brightness(1.06);
    transform: translateY(-1px);
    box-shadow: 0 5px 0 #8a6519, 0 14px 28px rgba(0, 0, 0, 0.4);
  }
  &:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #8a6519, 0 6px 14px rgba(0, 0, 0, 0.35);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const GoldButton = styled.button`
  ${buttonBase}
`;

export const GhostButton = styled.button`
  font-family: ${theme.fontBody};
  font-weight: 500;
  font-size: 1rem;
  border-radius: 14px;
  padding: 13px 24px;
  color: ${theme.cream};
  background: ${theme.glass};
  border: 1px solid ${theme.panelBorder};
  transition: background 0.15s ease, transform 0.12s ease, border-color 0.15s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
    border-color: ${theme.gold};
  }
  &:active:not(:disabled) {
    transform: translateY(2px);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled(GhostButton)`
  color: #ffb3b5;
  border-color: rgba(230, 72, 77, 0.5);
  &:hover:not(:disabled) {
    background: rgba(230, 72, 77, 0.18);
    border-color: ${theme.red};
  }
`;

export const TextInput = styled.input`
  width: 100%;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${theme.cream};
  background: rgba(0, 0, 0, 0.35);
  border: 1.5px solid ${theme.panelBorder};
  border-radius: 14px;
  padding: 14px 18px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: rgba(244, 239, 225, 0.4);
    font-weight: 400;
  }
  &:focus {
    border-color: ${theme.gold};
    box-shadow: 0 0 0 4px rgba(233, 184, 76, 0.15);
  }
  &:disabled {
    opacity: 0.5;
  }
`;

export const GlassPanel = styled(motion.div)`
  background: ${theme.panel};
  border: 1px solid ${theme.panelBorder};
  border-radius: 24px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: ${theme.shadowLg};
`;

export const Avatar = styled.div<{ $color: string; $size?: number }>`
  width: ${({ $size }) => $size ?? 38}px;
  height: ${({ $size }) => $size ?? 38}px;
  min-width: ${({ $size }) => $size ?? 38}px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: ${({ $size }) => ($size ?? 38) * 0.42}px;
  color: ${theme.feltDark};
  background: ${({ $color }) => $color};
  border: 2px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
`;

export const IconButton = styled(motion.button)`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid ${theme.panelBorder};
  background: ${theme.panel};
  color: ${theme.cream};
  display: grid;
  place-items: center;
  font-size: 1.25rem;
  backdrop-filter: blur(10px);
  box-shadow: ${theme.shadowMd};
  position: relative;

  @media ${mq.mobile} {
    width: 42px;
    height: 42px;
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: ${theme.red};
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  border: 2px solid ${theme.feltDark};
`;
