import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme, mq } from "@/styles/theme";
import type { ChatMsg } from "@lib/types";
import { GoldButton, TextInput } from "../ui/shared";

const Drawer = styled(motion.aside)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(380px, 100vw);
  background: rgba(5, 20, 12, 0.96);
  border-left: 1px solid ${theme.panelBorder};
  backdrop-filter: blur(16px);
  z-index: 90;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid ${theme.panelBorder};
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${theme.cream};
  font-size: 1.5rem;
  line-height: 1;
  padding: 4px 8px;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Bubble = styled.div<{ $mine: boolean }>`
  max-width: 82%;
  align-self: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  background: ${({ $mine }) =>
    $mine ? "rgba(233, 184, 76, 0.2)" : theme.glass};
  border: 1px solid
    ${({ $mine }) => ($mine ? "rgba(233, 184, 76, 0.45)" : theme.panelBorder)};
  border-radius: ${({ $mine }) =>
    $mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px"};
  padding: 8px 12px;
`;

const Sender = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${theme.gold};
  margin-bottom: 2px;
`;

const Text = styled.p`
  font-size: 0.98rem;
  color: ${theme.cream};
  word-break: break-word;
`;

const Time = styled.span`
  display: block;
  font-size: 0.68rem;
  color: ${theme.creamDim};
  text-align: right;
  margin-top: 2px;
`;

const Empty = styled.p`
  color: ${theme.creamDim};
  text-align: center;
  margin-top: 40px;
  font-style: italic;
`;

const Composer = styled.form`
  display: flex;
  gap: 8px;
  padding: 14px;
  border-top: 1px solid ${theme.panelBorder};
  padding-bottom: calc(14px + env(safe-area-inset-bottom));

  input {
    padding: 11px 14px;
    font-size: 1rem;
  }

  button {
    padding: 11px 18px;
    min-width: 0;
  }

  @media ${mq.mobile} {
    padding: 10px;
  }
`;

interface Props {
  open: boolean;
  onClose: () => void;
  chat: ChatMsg[];
  meId: string;
  onSend: (text: string) => void;
}

export default function ChatDrawer({ open, onClose, chat, meId, onSend }: Props) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat.length, open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <AnimatePresence>
      {open && (
        <Drawer
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
        >
          <Header>
            <Title>💬 Table Talk</Title>
            <CloseBtn onClick={onClose} aria-label="Close chat">
              ×
            </CloseBtn>
          </Header>
          <Messages>
            {chat.length === 0 && <Empty>No messages yet — say sláinte!</Empty>}
            {chat.map((m) => (
              <Bubble key={m.id} $mine={m.playerId === meId}>
                {m.playerId !== meId && <Sender>{m.username}</Sender>}
                <Text>{m.text}</Text>
                <Time>
                  {new Date(m.at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Time>
              </Bubble>
            ))}
            <div ref={bottomRef} />
          </Messages>
          <Composer onSubmit={submit}>
            <TextInput
              value={draft}
              maxLength={280}
              placeholder="Type a message…"
              onChange={(e) => setDraft(e.target.value)}
            />
            <GoldButton type="submit" disabled={!draft.trim()}>
              Send
            </GoldButton>
          </Composer>
        </Drawer>
      )}
    </AnimatePresence>
  );
}
