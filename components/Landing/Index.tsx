import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { theme, mq } from "@/styles/theme";
import {
  DisplayTitle,
  GoldButton,
  GhostButton,
  TextInput,
  GlassPanel,
} from "../ui/shared";
import AdBanner from "../Ads/AdBanner";
import { AD_SLOTS } from "@lib/ads";

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

const logoShimmer = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

const Logo = styled(DisplayTitle)`
  font-size: clamp(3.2rem, 9vw, 5.2rem);
  line-height: 1;
  text-align: center;
  background: linear-gradient(
    100deg,
    ${theme.cream} 38%,
    #ffe9b0 48%,
    ${theme.gold} 50%,
    #ffe9b0 52%,
    ${theme.cream} 62%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${logoShimmer} 5s linear infinite;
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

const FanWrap = styled.div`
  position: relative;
  height: 74px;
  width: 130px;
  margin-bottom: -6px;
`;

const FanCard = styled(motion.div)<{ $suit: string; $red: boolean }>`
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 52px;
  aspect-ratio: 5 / 7;
  border-radius: 7px;
  background: linear-gradient(160deg, #ffffff 0%, #f2efe6 100%);
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  color: ${({ $red }) => ($red ? "#d22730" : "#1b1f26")};
  transform-origin: 50% 120%;

  &::after {
    content: "${({ $suit }) => $suit}";
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

const Footer = styled.div`
  position: absolute;
  bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: ${theme.creamDim};
`;

const FootLink = styled(Link)`
  color: ${theme.creamDim};
  text-decoration: none;
  text-underline-offset: 3px;

  &:hover {
    color: ${theme.gold};
    text-decoration: underline;
  }
`;

const FootDot = styled.span`
  opacity: 0.5;
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
    // Invite links: irish-poker.com?join=ABCD prefills the party code.
    const params = new URLSearchParams(window.location.search);
    const invite = params.get("join");
    if (invite) setCode(invite.toUpperCase().slice(0, 4));
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
    else window.history.replaceState({}, "", window.location.pathname);
  };

  return (
    <Wrap
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
    >
      <div style={{ textAlign: "center", display: "grid", gap: 10, justifyItems: "center" }}>
        <FanWrap aria-hidden>
          {[
            { suit: "♥", red: true, rot: -22, dx: -34 },
            { suit: "☘", red: false, rot: 0, dx: 0 },
            { suit: "♠", red: false, rot: 22, dx: 34 },
          ].map((c, i) => (
            <FanCard
              key={c.suit}
              $suit={c.suit}
              $red={c.red}
              style={c.suit === "☘" ? { color: theme.clover } : undefined}
              initial={{ rotate: 0, x: "-50%", y: 30, opacity: 0 }}
              animate={{ rotate: c.rot, x: `calc(-50% + ${c.dx}px)`, y: 0, opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.12, type: "spring", stiffness: 200, damping: 16 }}
            />
          ))}
        </FanWrap>
        <Tagline>The classic drinking game</Tagline>
        <Logo>Irish Poker</Logo>
        <SuitRow aria-hidden>
          {["♥", "♠", "♦", "♣"].map((s, i) => (
            <motion.span
              key={s}
              initial={{ y: 14, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.09, type: "spring", stiffness: 300, damping: 14 }}
            >
              {s}
            </motion.span>
          ))}
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

      <AdBanner slot={AD_SLOTS.landing} height={90} maxWidth={430} />

      <Footer>
        <span>Made with ☘ by Dylan Cramer</span>
        <FootDot>·</FootDot>
        <FootLink href="/privacy">Privacy</FootLink>
      </Footer>
    </Wrap>
  );
}
