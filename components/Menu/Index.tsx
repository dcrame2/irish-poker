import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "@/styles/theme";
import RulesContent from "./RulesContent";
import {
  GoldButton,
  DangerButton,
  TextInput,
  DisplayTitle,
} from "../ui/shared";

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 90;
`;

const Drawer = styled(motion.aside)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(400px, 100vw);
  background: rgba(5, 20, 12, 0.97);
  border-right: 1px solid ${theme.panelBorder};
  backdrop-filter: blur(16px);
  z-index: 95;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px;
  gap: 18px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(DisplayTitle)`
  font-size: 1.9rem;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${theme.cream};
  font-size: 1.7rem;
  line-height: 1;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? theme.feltDark : theme.cream)};
  background: ${({ $active }) => ($active ? theme.gold : theme.glass)};
  border: 1px solid
    ${({ $active }) => ($active ? theme.gold : theme.panelBorder)};
  transition: all 0.15s;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  font-size: 1rem;
  color: ${theme.cream};
  background: rgba(0, 0, 0, 0.35);
  border: 1.5px solid ${theme.panelBorder};
  border-radius: 14px;
  padding: 12px 16px;
  outline: none;
  resize: vertical;

  &::placeholder {
    color: rgba(244, 239, 225, 0.4);
  }
  &:focus {
    border-color: ${theme.gold};
  }
`;

const Note = styled.p<{ $error?: boolean }>`
  font-size: 0.92rem;
  color: ${({ $error }) => ($error ? theme.danger : theme.success)};
`;

const Spacer = styled.div`
  flex: 1;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
`;

const PrivacyLink = styled(Link)`
  color: ${theme.creamDim};
  font-size: 0.85rem;
  text-align: center;
  text-decoration: none;

  &:hover {
    color: ${theme.gold};
    text-decoration: underline;
  }
`;

interface Props {
  open: boolean;
  onClose: () => void;
  inRoom: boolean;
  onLeave: () => void;
}

export default function Menu({ open, onClose, inRoom, onLeave }: Props) {
  const [tab, setTab] = useState<"rules" | "feedback">("rules");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const sendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/form-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <Drawer
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <Header>
              <Logo>Irish Poker ☘</Logo>
              <CloseBtn onClick={onClose} aria-label="Close menu">
                ×
              </CloseBtn>
            </Header>

            <Tabs>
              <Tab $active={tab === "rules"} onClick={() => setTab("rules")}>
                How to Play
              </Tab>
              <Tab
                $active={tab === "feedback"}
                onClick={() => setTab("feedback")}
              >
                Feedback
              </Tab>
            </Tabs>

            {tab === "rules" && <RulesContent />}

            {tab === "feedback" && (
              <Section as="form" onSubmit={sendFeedback}>
                <TextInput
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextInput
                  placeholder="Email (optional)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextArea
                  placeholder="Tell me what's broken, what's fun, or what you want next…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <GoldButton
                  type="submit"
                  disabled={status === "sending" || !message.trim()}
                >
                  {status === "sending" ? "Sending…" : "Send Feedback"}
                </GoldButton>
                {status === "sent" && <Note>Thanks, got it! 🍀</Note>}
                {status === "error" && (
                  <Note $error>Couldn&apos;t send right now, try again later.</Note>
                )}
              </Section>
            )}

            <Spacer />

            {inRoom && (
              <DangerButton
                onClick={() => {
                  onLeave();
                  onClose();
                }}
              >
                Leave party
              </DangerButton>
            )}

            <FooterLinks>
              <PrivacyLink href="/" onClick={onClose}>
                🏠 About Irish Poker
              </PrivacyLink>
              <PrivacyLink href="/privacy" onClick={onClose}>
                Privacy Policy
              </PrivacyLink>
            </FooterLinks>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  );
}
