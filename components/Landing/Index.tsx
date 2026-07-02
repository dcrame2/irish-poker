import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { theme, mq } from "@/styles/theme";
import {
  DisplayTitle,
  GoldButton,
  GhostButton,
  TextInput,
  GlassPanel,
} from "../ui/shared";

const Wrap = styled(motion.main)`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 26px;
  padding: 80px 20px 40px;
  position: relative;
  z-index: 1;
`;

const Tagline = styled.p`
  font-size: 1.05rem;
  color: ${theme.creamDim};
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const Logo = styled(DisplayTitle)`
  font-size: clamp(3.2rem, 9vw, 5.2rem);
  line-height: 1;
  text-align: center;
`;

const SuitRow = styled.div`
  display: flex;
  gap: 14px;
  font-size: 1.5rem;

  span:nth-child(odd) {
    color: ${theme.red};
  }
  span:nth-child(even) {
    color: ${theme.cream};
  }
`;

const Card = styled(GlassPanel)`
  width: min(430px, 100%);
  padding: 30px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media ${mq.mobile} {
    padding: 24px 20px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${theme.creamDim};
  font-size: 0.85rem;
  letter-spacing: 0.2em;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${theme.panelBorder};
  }
`;

const JoinRow = styled.div`
  display: flex;
  gap: 10px;

  input {
    text-transform: uppercase;
    letter-spacing: 0.35em;
    font-weight: 700;
    text-align: center;
  }
`;

const ErrorMsg = styled(motion.p)`
  color: ${theme.danger};
  font-size: 0.95rem;
  text-align: center;
`;

const Footer = styled.p`
  position: absolute;
  bottom: 14px;
  font-size: 0.85rem;
  color: ${theme.creamDim};
`;

const NAME_KEY = "irish-poker:name";

interface Props {
  onCreate: (username: string) => Promise<string | null>;
  onJoin: (code: string, username: string) => Promise<string | null>;
}

export default function Landing({ onCreate, onJoin }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"create" | "join" | null>(null);

  useEffect(() => {
    setName(localStorage.getItem(NAME_KEY) || "");
  }, []);

  const validateName = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Pick a name first!");
      return null;
    }
    localStorage.setItem(NAME_KEY, trimmed);
    return trimmed;
  };

  const handleCreate = async () => {
    const n = validateName();
    if (!n) return;
    setBusy("create");
    setError(null);
    const err = await onCreate(n);
    setBusy(null);
    if (err) setError(err);
  };

  const handleJoin = async () => {
    const n = validateName();
    if (!n) return;
    if (code.trim().length < 4) {
      setError("Enter the 4-letter party code.");
      return;
    }
    setBusy("join");
    setError(null);
    const err = await onJoin(code.trim().toUpperCase(), n);
    setBusy(null);
    if (err) setError(err);
  };

  return (
    <Wrap
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
    >
      <div style={{ textAlign: "center", display: "grid", gap: 10, justifyItems: "center" }}>
        <Tagline>The classic drinking game</Tagline>
        <Logo>Irish Poker</Logo>
        <SuitRow aria-hidden>
          <span>♥</span>
          <span>♠</span>
          <span>♦</span>
          <span>♣</span>
        </SuitRow>
      </div>

      <Card
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <TextInput
          placeholder="Your name"
          value={name}
          maxLength={14}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <GoldButton onClick={handleCreate} disabled={busy !== null}>
          {busy === "create" ? "Dealing you in…" : "🍀 Create a Party"}
        </GoldButton>
        <Divider>OR JOIN ONE</Divider>
        <JoinRow>
          <TextInput
            placeholder="CODE"
            value={code}
            maxLength={4}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
          <GhostButton
            onClick={handleJoin}
            disabled={busy !== null}
            style={{ minWidth: 110 }}
          >
            {busy === "join" ? "Joining…" : "Join"}
          </GhostButton>
        </JoinRow>
        {error && (
          <ErrorMsg
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </ErrorMsg>
        )}
      </Card>

      <Footer>Made with ☘ by Dylan Cramer</Footer>
    </Wrap>
  );
}
