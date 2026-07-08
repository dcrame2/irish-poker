import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled, { css, keyframes } from "styled-components";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { theme, mq } from "@/styles/theme";
import { sound } from "@lib/sound";
import {
  PageShell,
  MarketingNav,
  MarketingFooter,
  Section,
  Kicker,
  SectionTitle,
  Lead,
  Center,
  CardGrid,
  GlassCard,
  CardEmoji,
  BigPlayButton,
  CtaBand,
  fadeUp,
  stagger,
} from "../../components/Marketing/shared";
import AdBanner from "../../components/Ads/AdBanner";
import FaqSection, { faqJsonLd } from "../../components/Marketing/FaqSection";
import { AD_SLOTS } from "@lib/ads";

/* ------------------------------- hero bits ------------------------------- */

const Hero = styled.section`
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(30px, 6vw, 70px) clamp(18px, 4vw, 44px) clamp(44px, 7vw, 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const logoShimmer = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fontDisplay};
  font-weight: 400;
  font-size: clamp(3rem, 9vw, 5.6rem);
  line-height: 1.02;
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
  margin: 10px 0 6px;
`;

const HeroTagline = styled.p`
  font-size: clamp(0.9rem, 1.8vw, 1.05rem);
  color: ${theme.creamDim};
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const HeroLead = styled.p`
  max-width: 640px;
  margin: 18px auto 30px;
  font-size: clamp(1.05rem, 1.9vw, 1.2rem);
  line-height: 1.65;
  color: ${theme.creamDim};

  strong {
    color: ${theme.cream};
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
`;

const TrustLine = styled.p`
  margin-top: 22px;
  font-size: 0.92rem;
  color: rgba(244, 239, 225, 0.55);
  letter-spacing: 0.04em;
`;

/* animated hero card fan */

const cardFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
`;

const FanWrap = styled.div`
  position: relative;
  height: clamp(120px, 20vw, 170px);
  width: clamp(240px, 44vw, 360px);
  margin-bottom: 26px;
`;

const FanCardOuter = styled(motion.div)`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform-origin: 50% 130%;
`;

/* the float loop lives on the inner face so it can't fight framer-motion's
   x/rotate transform on the outer wrapper */
const FanCardFace = styled.div<{ $red: boolean; $i: number }>`
  animation: ${cardFloat} ${({ $i }) => 3.4 + $i * 0.35}s ease-in-out infinite;
  animation-delay: ${({ $i }) => $i * 0.25}s;
  width: clamp(64px, 11vw, 92px);
  aspect-ratio: 5 / 7;
  border-radius: 10px;
  background: linear-gradient(160deg, #ffffff 0%, #f2efe6 100%);
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  font-size: clamp(1.7rem, 3.6vw, 2.5rem);
  color: ${({ $red }) => ($red ? "#d22730" : "#1b1f26")};
`;

const HERO_CARDS = [
  { suit: "♥", red: true, rot: -30, dx: -104 },
  { suit: "♦", red: true, rot: -15, dx: -52 },
  { suit: "☘", red: false, rot: 0, dx: 0 },
  { suit: "♠", red: false, rot: 15, dx: 52 },
  { suit: "♣", red: false, rot: 30, dx: 104 },
];

/* the fan leans toward the cursor like it's being fanned in your hand */
const FanPerspective = styled.div`
  perspective: 900px;
`;

const FanTilt = styled(motion.div)`
  transform-style: preserve-3d;
`;

/* ------------------------- casino ticker marquee -------------------------- */

const tickerMove = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const Ticker = styled.div`
  overflow: hidden;
  border-top: 1px solid rgba(233, 184, 76, 0.18);
  border-bottom: 1px solid rgba(233, 184, 76, 0.18);
  background: rgba(0, 0, 0, 0.3);
  padding: 13px 0;
`;

const TickerTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${tickerMove} 32s linear infinite;
`;

const TickerItem = styled.span<{ $red?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 30px;
  font-family: ${theme.fontDisplay};
  font-size: 1rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  white-space: nowrap;
  color: rgba(244, 239, 225, 0.62);

  b {
    font-weight: 400;
    font-size: 1.25rem;
    color: ${({ $red }) => ($red ? theme.red : theme.gold)};
  }
`;

const TICKER_ITEMS: { icon: string; text: string; red?: boolean }[] = [
  { icon: "♥", text: "Red or Black", red: true },
  { icon: "♦", text: "Higher or Lower", red: true },
  { icon: "♠", text: "Inside or Outside" },
  { icon: "♣", text: "Name the Suit" },
  { icon: "🍺", text: "Guess wrong? Drink" },
  { icon: "😈", text: "Guess right? You choose" },
  { icon: "☘", text: "Sláinte" },
];

/* --------------------- round zero: the playable teaser -------------------- */

const TryWrap = styled(motion.div)`
  display: flex;
  gap: clamp(28px, 5vw, 54px);
  align-items: center;
  justify-content: center;
  margin-top: 38px;

  @media ${mq.mobile} {
    flex-direction: column;
    gap: 24px;
  }
`;

const TryStage = styled.div`
  width: clamp(132px, 15vw, 164px);
  perspective: 900px;
`;

const TryCard = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 5 / 7;
  transform-style: preserve-3d;
`;

const tryFace = css`
  position: absolute;
  inset: 0;
  border-radius: 14px;
  display: grid;
  place-items: center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
`;

const TryBack = styled.div`
  ${tryFace}
  background:
    radial-gradient(ellipse at 50% 30%, #1a7042 0%, #115231 55%, #0b3b22 100%);
  border: 2px solid rgba(233, 184, 76, 0.45);
  color: rgba(233, 184, 76, 0.75);
  font-size: 2.4rem;

  &::before {
    content: "";
    position: absolute;
    inset: 7px;
    border-radius: 9px;
    border: 1px solid rgba(233, 184, 76, 0.3);
  }
`;

const TryFront = styled.div<{ $red: boolean }>`
  ${tryFace}
  background: linear-gradient(160deg, #fffef9 0%, #f1ede0 100%);
  border: 1px solid rgba(0, 0, 0, 0.28);
  transform: rotateY(180deg);
  color: ${({ $red }) => ($red ? "#d22730" : "#1b1f26")};
  font-size: 3rem;
  line-height: 1;

  span {
    display: block;
    text-align: center;
    font-weight: 800;
    font-size: 0.52em;
    margin-bottom: 4px;
  }
`;

const TryControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  min-width: min(300px, 100%);
`;

const GuessBtns = styled.div`
  display: flex;
  gap: 12px;
`;

const guessTone = {
  red: css`
    background: linear-gradient(180deg, #f0666b 0%, ${theme.red} 55%, ${theme.redDark} 100%);
    box-shadow: 0 4px 0 #7c1d20, 0 10px 24px rgba(0, 0, 0, 0.4);
  `,
  black: css`
    background: linear-gradient(180deg, #3a4150 0%, ${theme.black} 60%, #05070a 100%);
    box-shadow: 0 4px 0 #000, 0 10px 24px rgba(0, 0, 0, 0.4);
  `,
};

const GuessBtn = styled.button<{ $tone: "red" | "black" }>`
  border: none;
  border-radius: 16px;
  color: white;
  font-family: ${theme.fontBody};
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 15px 34px;
  transition: transform 0.12s ease, filter 0.15s ease;
  ${({ $tone }) => guessTone[$tone]}

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(3px);
  }
`;

const TryResult = styled.p`
  min-height: 30px;
  font-size: 1.08rem;
  color: ${theme.creamDim};
  text-align: center;

  strong {
    color: ${theme.gold};
  }
`;

const StreakRow = styled.div`
  display: flex;
  gap: 10px;
`;

const StreakChip = styled.span`
  background: ${theme.glass};
  border: 1px solid ${theme.panelBorder};
  border-radius: 999px;
  padding: 7px 16px;
  font-size: 0.88rem;
  color: ${theme.creamDim};

  b {
    color: ${theme.gold};
  }
`;

const TryFooter = styled.p`
  margin-top: 26px;
  font-size: 0.98rem;
  color: ${theme.creamDim};

  a {
    color: ${theme.gold};
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const SUITS = [
  { glyph: "♥", red: true },
  { glyph: "♦", red: true },
  { glyph: "♠", red: false },
  { glyph: "♣", red: false },
];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function TryYourLuck() {
  const dealSeq = useRef(0);
  const [deal, setDeal] = useState<{
    id: number;
    rank: string;
    suit: string;
    red: boolean;
  } | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const guess = (color: "red" | "black") => {
    const s = SUITS[Math.floor(Math.random() * SUITS.length)];
    const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
    const correct = (color === "red") === s.red;
    setDeal({ id: ++dealSeq.current, rank, suit: s.glyph, red: s.red });
    setWon(correct);
    setStreak((st) => {
      const next = correct ? st + 1 : 0;
      setBest((b) => Math.max(b, correct ? next : b));
      return next;
    });
    sound.flip();
    setTimeout(() => (correct ? sound.lucky() : sound.unlucky()), 320);
  };

  const resultLine =
    won === null ? (
      <>Tap a color. The card doesn&apos;t care about your feelings.</>
    ) : won ? (
      streak >= 3 ? (
        <>
          <strong>{streak} in a row.</strong> The luck of the Irish is real. 🔥
        </>
      ) : (
        <>
          <strong>Called it.</strong> In the real game, someone else sips. 😈
        </>
      )
    ) : (
      <>
        <strong>That&apos;s a drink.</strong> The deck shows no mercy. 🍺
      </>
    );

  return (
    <>
      <TryWrap {...fadeUp}>
        <TryStage>
          <TryCard
            key={deal?.id ?? "facedown"}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: deal ? 180 : 0 }}
            transition={{ duration: 0.55, ease: [0.3, 0.6, 0.3, 1] }}
          >
            <TryBack>☘</TryBack>
            {deal && (
              <TryFront $red={deal.red}>
                <div>
                  <span>{deal.rank}</span>
                  {deal.suit}
                </div>
              </TryFront>
            )}
          </TryCard>
        </TryStage>
        <TryControls>
          <GuessBtns>
            <GuessBtn $tone="red" onClick={() => guess("red")}>
              Red
            </GuessBtn>
            <GuessBtn $tone="black" onClick={() => guess("black")}>
              Black
            </GuessBtn>
          </GuessBtns>
          <TryResult>{resultLine}</TryResult>
          <StreakRow>
            <StreakChip>
              Streak <b>{streak}</b>
            </StreakChip>
            <StreakChip>
              Best <b>{best}</b>
            </StreakChip>
          </StreakRow>
        </TryControls>
      </TryWrap>
      <TryFooter>
        That was round one of four. <Link href="/play">Take it to the table →</Link>
      </TryFooter>
    </>
  );
}

/* ------------------------------ stats strip ------------------------------ */

const Stats = styled(motion.div)`
  display: flex;
  gap: clamp(14px, 4vw, 44px);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 44px;
`;

const Stat = styled.div`
  text-align: center;
  min-width: 118px;

  strong {
    display: block;
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: clamp(1.6rem, 3.4vw, 2.2rem);
    color: ${theme.gold};
    text-shadow: 0 0 24px rgba(233, 184, 76, 0.35);
  }

  span {
    font-size: 0.85rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${theme.creamDim};
  }
`;

/* ------------------------------ round cards ------------------------------ */

/* the four rounds always sit in one row on desktop, 2×2 on tablets */
const RoundsGrid = styled(CardGrid)`
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 1020px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${mq.mobile} {
    grid-template-columns: 1fr;
  }
`;

/* each round is a giant playing card that flips face-up as you scroll to it */
const FlipSpot = styled.div<{ $tilt: number }>`
  perspective: 1100px;
  transform: rotate(${({ $tilt }) => $tilt}deg);
  transition: transform 0.22s ease;

  &:hover {
    transform: rotate(0deg) translateY(-8px);
  }
`;

const FlipInner = styled(motion.div)`
  position: relative;
  transform-style: preserve-3d;
  height: 100%;
`;

const PlayCard = styled.div`
  background: linear-gradient(160deg, #fffef9 0%, #f1ede0 100%);
  border: 1px solid rgba(0, 0, 0, 0.22);
  border-radius: 16px;
  padding: 44px 20px 24px;
  position: relative;
  height: 100%;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  h3 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: 1.35rem;
    color: #0d3320;
    margin-bottom: 10px;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #4c5149;
  }
`;

const RoundBackFace = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background:
    radial-gradient(ellipse at 50% 30%, #1a7042 0%, #115231 55%, #0b3b22 100%);
  border: 2px solid rgba(233, 184, 76, 0.45);
  display: grid;
  place-items: center;
  font-size: 2.6rem;
  color: rgba(233, 184, 76, 0.75);
  transform: rotateY(180deg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);

  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border-radius: 10px;
    border: 1px solid rgba(233, 184, 76, 0.3);
  }
`;

const CardCorner = styled.span<{ $red: boolean; $flip?: boolean }>`
  position: absolute;
  ${({ $flip }) =>
    $flip
      ? "bottom: 10px; right: 14px; transform: rotate(180deg);"
      : "top: 10px; left: 14px;"}
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.05;
  font-weight: 800;
  font-size: 1.05rem;
  color: ${({ $red }) => ($red ? "#d22730" : "#1b1f26")};
`;

const Odds = styled.p`
  margin-top: 12px;
  font-size: 0.8rem !important;
  font-weight: 700;
  color: #8a6519 !important;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

/* ------------------------- steps: a dashed timeline ----------------------- */

const StepsPath = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
  margin-top: 48px;
  position: relative;

  /* the path the party travels */
  &::before {
    content: "";
    position: absolute;
    top: 27px;
    left: 14%;
    right: 14%;
    border-top: 2px dashed rgba(233, 184, 76, 0.4);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 34px;

    &::before {
      top: 6%;
      bottom: 8%;
      left: 27px;
      right: auto;
      border-top: none;
      border-left: 2px dashed rgba(233, 184, 76, 0.4);
    }
  }
`;

const StepItem = styled(motion.div)`
  position: relative;
  text-align: center;
  padding: 0 8px;

  h3 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: 1.35rem;
    color: ${theme.cream};
    margin: 16px 0 8px;
  }

  p {
    font-size: 0.97rem;
    line-height: 1.6;
    color: ${theme.creamDim};
    max-width: 300px;
    margin: 0 auto;
  }

  p strong {
    color: ${theme.cream};
  }

  @media (max-width: 760px) {
    text-align: left;
    padding-left: 76px;

    h3 {
      margin-top: 4px;
    }

    p {
      margin: 0;
    }
  }
`;

const StepCoin = styled.span`
  display: inline-grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  font-family: ${theme.fontDisplay};
  font-size: 1.5rem;
  color: ${theme.feltDark};
  background: linear-gradient(180deg, #f5cf7d 0%, ${theme.gold} 60%, #c9962f 100%);
  box-shadow: 0 4px 0 #8a6519, 0 10px 24px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 1;

  @media (max-width: 760px) {
    position: absolute;
    left: 0;
    top: 0;
  }
`;

/* -------------------- features: a pub-menu style ledger ------------------- */

const FeatureLedger = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: clamp(34px, 6vw, 80px);
  margin-top: 26px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureRow = styled(motion.div)`
  display: flex;
  gap: 18px;
  align-items: flex-start;
  padding: 24px 6px;
  border-bottom: 1px solid rgba(233, 184, 76, 0.16);
  transition: background 0.15s ease;
  border-radius: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  h3 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: 1.25rem;
    color: ${theme.gold};
    margin-bottom: 6px;
  }

  p {
    font-size: 0.96rem;
    line-height: 1.6;
    color: ${theme.creamDim};
  }
`;

const FeatureBadge = styled.span`
  display: grid;
  place-items: center;
  min-width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.4rem;
  background: ${theme.glass};
  border: 1px solid ${theme.panelBorder};
`;

/* --------------------------- what-is-it visual ---------------------------- */

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: clamp(30px, 5vw, 70px);
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SnapWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  padding-top: 20px;
`;

const HandRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const snapCardBase = `
  width: clamp(78px, 9vw, 112px);
  aspect-ratio: 5 / 7;
  border-radius: 12px;
  margin: 0 -9px;
  transform-origin: 50% 100%;
  display: grid;
  place-items: center;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
`;

const SnapCardBack = styled(motion.div)`
  ${snapCardBase}
  background:
    radial-gradient(ellipse at 50% 30%, #1a7042 0%, #115231 55%, #0b3b22 100%);
  border: 2px solid rgba(233, 184, 76, 0.45);
  color: rgba(233, 184, 76, 0.75);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 6px;
    border-radius: 8px;
    border: 1px solid rgba(233, 184, 76, 0.3);
  }
`;

const SnapCardFace = styled(motion.div)`
  ${snapCardBase}
  background: linear-gradient(160deg, #ffffff 0%, #f2efe6 100%);
  border: 1px solid rgba(0, 0, 0, 0.3);
  color: #1b1f26;
  font-size: clamp(2rem, 4vw, 2.9rem);
  line-height: 1;
  flex-direction: column;
  z-index: 2;

  span {
    display: block;
    font-weight: 800;
    font-size: 0.55em;
    letter-spacing: 0.02em;
  }
`;

const SnapChip = styled(motion.p)`
  background: ${theme.panel};
  border: 1px solid ${theme.goldSoft};
  border-radius: 999px;
  padding: 11px 22px;
  font-size: 0.98rem;
  color: ${theme.creamDim};
  backdrop-filter: blur(10px);
  box-shadow: ${theme.shadowMd};
  text-align: center;

  strong {
    color: ${theme.gold};
  }
`;

/* ----------------------------- responsibility ---------------------------- */

const SoberNote = styled(motion.div)`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: rgba(79, 200, 120, 0.08);
  border: 1px solid rgba(79, 200, 120, 0.3);
  border-radius: 18px;
  padding: 22px 24px;
  max-width: 760px;
  margin: 40px auto 0;

  span {
    font-size: 1.6rem;
    line-height: 1;
  }

  p {
    font-size: 0.96rem;
    line-height: 1.6;
    color: ${theme.creamDim};
  }

  p strong {
    color: ${theme.cream};
  }
`;

const AdSlot = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 clamp(18px, 4vw, 44px);
  display: flex;
  justify-content: center;
`;

/* -------------------------------- the page ------------------------------- */

export default function Home() {
  const router = useRouter();

  // hero card fan leans toward the cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const fanRotX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 140,
    damping: 18,
  });
  const fanRotY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), {
    stiffness: 140,
    damping: 18,
  });

  // Old invite links point at the root (irish-poker.com?join=CODE);
  // forward them to the game.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const join = params.get("join");
    if (join) {
      router.replace(`/play?join=${encodeURIComponent(join)}`);
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Irish Poker | Play the Classic Drinking Card Game Online Free</title>
        <meta
          name="description"
          content="Play Irish Poker online with friends: the classic 4-round drinking card game (Red or Black, Higher or Lower, Inside or Outside, Name the Suit). Free, no sign-up, works on any phone or laptop."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#071a10" />
        <link rel="canonical" href="https://irish-poker.com/" />
        <link rel="icon" href="favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Irish Poker | Play the Classic Drinking Card Game Online Free" />
        <meta
          property="og:description"
          content="The classic 4-round drinking card game, rebuilt for the browser. Create a party, share a 4-letter code, and play with 2-10 friends anywhere."
        />
        <meta property="og:url" content="https://irish-poker.com/" />
        <meta property="og:image" content="https://irish-poker.com/irish_poker_logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Irish Poker",
              url: "https://irish-poker.com/",
              description:
                "Free online multiplayer version of Irish Poker, the classic four-round drinking card game.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </Head>

      <PageShell>
        <MarketingNav />

        {/* ------------------------------ hero ----------------------------- */}
        <Hero
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onMouseLeave={() => {
            mx.set(0);
            my.set(0);
          }}
        >
          <FanPerspective>
          <FanTilt style={{ rotateX: fanRotX, rotateY: fanRotY }}>
          <FanWrap aria-hidden>
            {HERO_CARDS.map((c, i) => (
              <FanCardOuter
                key={c.suit}
                initial={{ rotate: 0, x: "-50%", y: 60, opacity: 0 }}
                animate={{
                  rotate: c.rot,
                  x: `calc(-50% + ${c.dx}px)`,
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.15 + i * 0.1,
                  type: "spring",
                  stiffness: 190,
                  damping: 15,
                }}
              >
                <FanCardFace
                  $red={c.red}
                  $i={i}
                  style={c.suit === "☘" ? { color: theme.clover } : undefined}
                >
                  {c.suit}
                </FanCardFace>
              </FanCardOuter>
            ))}
          </FanWrap>
          </FanTilt>
          </FanPerspective>

          <HeroTagline>The classic drinking card game, now online</HeroTagline>
          <HeroTitle>Irish Poker</HeroTitle>
          <HeroLead>
            Four cards. Four rounds. One question at a time:{" "}
            <strong>can you call what flips next?</strong> Guess right and you
            hand out drinks. Guess wrong and you take one. Play free in your
            browser with 2-10 friends, whether you share a couch or live on
            separate continents.
          </HeroLead>

          <HeroButtons>
            <BigPlayButton href="/play">Play Free, No Sign-Up 🍀</BigPlayButton>
          </HeroButtons>
          <TrustLine>
            Free forever · No app to download · No account needed · Works on any
            phone, tablet, or laptop
          </TrustLine>

          <Stats {...fadeUp}>
            <Stat>
              <strong>2-10</strong>
              <span>players</span>
            </Stat>
            <Stat>
              <strong>4</strong>
              <span>rounds</span>
            </Stat>
            <Stat>
              <strong>~15 min</strong>
              <span>per game</span>
            </Stat>
            <Stat>
              <strong>$0</strong>
              <span>forever</span>
            </Stat>
          </Stats>
        </Hero>

        {/* --------------------------- suit ticker -------------------------- */}
        <Ticker aria-hidden>
          <TickerTrack>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <TickerItem key={i} $red={t.red}>
                <b>{t.icon}</b> {t.text}
              </TickerItem>
            ))}
          </TickerTrack>
        </Ticker>

        {/* ------------------------ playable round zero ---------------------- */}
        <Section>
          <Center>
            <motion.div {...fadeUp}>
              <Kicker>Round zero · a free sample</Kicker>
              <SectionTitle>Think you can call it?</SectionTitle>
              <Lead>
                Red or black. That&apos;s the whole job. See how long your gut
                holds out before the deck humbles you.
              </Lead>
            </motion.div>
            <TryYourLuck />
          </Center>
        </Section>

        {/* --------------------------- what is it --------------------------- */}
        <Section>
          <TwoCol>
            <motion.div {...fadeUp}>
              <Kicker>The game</Kicker>
              <SectionTitle>What is Irish Poker?</SectionTitle>
              <Lead>
              The classic pub guessing game. No betting, no bluffing: you get{" "}
              <strong>four face-down cards</strong> and make one call per round
              about what flips next. <strong>Guess wrong, you drink.</strong>{" "}
              Guess right, you pick who does.
            </Lead>
            <Lead>
              This site runs the whole game for you: it deals, tracks turns,
              and counts every drink. Start a party, share the{" "}
              <strong>4-letter code</strong>, and everyone plays live from
              their own phone.
            </Lead>
            </motion.div>

            {/* the classic tragedy, illustrated: called red, flipped a spade */}
            <SnapWrap>
              <HandRow>
                <SnapCardFace
                  initial={{ y: 46, opacity: 0, rotate: 0, scale: 0.9 }}
                  whileInView={{ y: -22, opacity: 1, rotate: -12, scale: 1.06 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: 0.55,
                    type: "spring",
                    stiffness: 180,
                    damping: 14,
                  }}
                >
                  <span>A</span>♠
                </SnapCardFace>
                {[
                  { rot: -4, lift: 10 },
                  { rot: 3, lift: 10 },
                  { rot: 10, lift: 0 },
                ].map((c, i) => (
                  <SnapCardBack
                    key={i}
                    initial={{ y: 46, opacity: 0, rotate: 0 }}
                    whileInView={{ y: -c.lift, opacity: 1, rotate: c.rot }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      delay: 0.15 + i * 0.12,
                      type: "spring",
                      stiffness: 200,
                      damping: 17,
                    }}
                  >
                    ☘
                  </SnapCardBack>
                ))}
              </HandRow>
              <SnapChip {...fadeUp} transition={{ delay: 0.8, duration: 0.5 }}>
                <strong>&ldquo;Red.&rdquo;</strong> It was the ace of spades.
                Drink up 🍺
              </SnapChip>
            </SnapWrap>
          </TwoCol>
        </Section>

        {/* --------------------------- four rounds -------------------------- */}
        <Section>
          <Center>
            <motion.div {...fadeUp}>
              <Kicker>How it plays</Kicker>
              <SectionTitle>Four rounds, four fateful guesses</SectionTitle>
              <Lead>
                Each round, every player makes one call about their next
                face-down card. The rounds get harder, and the drinks get
                bigger stakes, as you go.
              </Lead>
            </motion.div>
          </Center>
          <RoundsGrid>
            {[
              {
                suit: "♥",
                red: true,
                tilt: -3,
                title: "Red or Black",
                text: "Call the color of your first card before it flips. The purest 50/50 in card games, and somehow people still get it wrong.",
                odds: "Your odds: 50%",
              },
              {
                suit: "♦",
                red: true,
                tilt: 2,
                title: "Higher or Lower",
                text: "Will your second card beat your first? A 2 or an ace makes this easy money. A 7 or 8 is a leap of faith. Ties lose; the house always wins.",
                odds: "Your odds: it depends…",
              },
              {
                suit: "♠",
                red: false,
                tilt: -2,
                title: "Inside or Outside",
                text: "Does card three land between your first two cards, or outside them? A wide gap begs for inside; a tight pair screams outside. Landing exactly on one of them? That's a drink.",
                odds: "Your odds: read the gap",
              },
              {
                suit: "♣",
                red: false,
                tilt: 3,
                title: "Name the Suit",
                text: "The finale. Call the exact suit of your last card: hearts, diamonds, spades, or clubs. One in four. Fortune favors the bold; the bold favor another sip.",
                odds: "Your odds: 25%",
              },
            ].map((r, i) => (
              <FlipSpot key={r.title} $tilt={r.tilt}>
                <FlipInner
                  initial={{ rotateY: 180 }}
                  whileInView={{ rotateY: 0 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{
                    delay: 0.12 + i * 0.16,
                    duration: 0.7,
                    ease: [0.2, 0.7, 0.3, 1],
                  }}
                >
                  <PlayCard>
                    <CardCorner $red={r.red}>
                      {i + 1}
                      <span>{r.suit}</span>
                    </CardCorner>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                    <Odds>{r.odds}</Odds>
                    <CardCorner $red={r.red} $flip>
                      {i + 1}
                      <span>{r.suit}</span>
                    </CardCorner>
                  </PlayCard>
                  <RoundBackFace aria-hidden>☘</RoundBackFace>
                </FlipInner>
              </FlipSpot>
            ))}
          </RoundsGrid>
        </Section>

        <AdSlot>
          <AdBanner slot={AD_SLOTS.landing} height={90} maxWidth={728} />
        </AdSlot>

        {/* ------------------------- how it works --------------------------- */}
        <Section>
          <Center>
            <motion.div {...fadeUp}>
              <Kicker>Getting started</Kicker>
              <SectionTitle>From group chat to game in 10 seconds</SectionTitle>
            </motion.div>
          </Center>
          <StepsPath>
            {[
              {
                title: "Create a party",
                text: (
                  <>
                    Hit <strong>Play Free</strong>, type a nickname, and
                    you&apos;re the host of a private room. No email, no
                    password, no download.
                  </>
                ),
              },
              {
                title: "Share the code",
                text: (
                  <>
                    Every party gets a <strong>4-letter code</strong> and an
                    invite link. Drop it in the group chat and friends join from
                    any phone or laptop browser.
                  </>
                ),
              },
              {
                title: "Deal the cards",
                text: (
                  <>
                    The host starts the game and the table takes over: it deals,
                    tracks turns, counts drinks, and crowns the night&apos;s
                    biggest loser. You just guess. And sip.
                  </>
                ),
              },
            ].map((s, i) => (
              <StepItem key={s.title} {...stagger(i)}>
                <StepCoin>{i + 1}</StepCoin>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </StepItem>
            ))}
          </StepsPath>
        </Section>

        {/* ---------------------------- features ---------------------------- */}
        <Section>
          <Center>
            <motion.div {...fadeUp}>
              <Kicker>Why players love it</Kicker>
              <SectionTitle>Built for real parties</SectionTitle>
            </motion.div>
          </Center>
          <FeatureLedger>
            {[
              {
                emoji: "📱",
                title: "No app, no sign-up",
                text: "Runs entirely in the browser. Send a link, and even your least tech-savvy friend is in the game before their drink is poured.",
              },
              {
                emoji: "🌍",
                title: "Same room or long distance",
                text: "Everyone sees the same live table. Play shoulder-to-shoulder at a pregame, or reunite the college group chat across three time zones.",
              },
              {
                emoji: "🔌",
                title: "Reconnect-proof",
                text: "Phone died? Walked out of Wi-Fi? Your seat and your cards are saved. Jump back in and the party never skips a beat.",
              },
              {
                emoji: "🍺",
                title: "Automatic drink tracking",
                text: "The table keeps a running tally for every player, per game and for the whole night, and crowns the standings when the cards run out.",
              },
              {
                emoji: "💬",
                title: "Chat, emotes & sounds",
                text: "Talk trash in the party chat, spam 💀 when someone flips a third straight loss, and feel the buzz on your phone when it's your turn.",
              },
              {
                emoji: "🃏",
                title: "A real dealer",
                text: "A fair shuffle every game, dealt from a full 52-card deck. Nobody stacks it, nobody misdeals, and nobody has to be the sober rules referee.",
              },
            ].map((f, i) => (
              <FeatureRow key={f.title} {...stagger(i % 2)}>
                <FeatureBadge>{f.emoji}</FeatureBadge>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </FeatureRow>
            ))}
          </FeatureLedger>
        </Section>

        {/* --------------------------- perfect for --------------------------- */}
        <Section>
          <Center>
            <motion.div {...fadeUp}>
              <Kicker>When to break it out</Kicker>
              <SectionTitle>Perfect for…</SectionTitle>
            </motion.div>
          </Center>
          <CardGrid $min={230}>
            {[
              {
                emoji: "🎉",
                title: "Pregames",
                text: "Fifteen minutes, one deck, whole room warmed up before you head out. The classic use case, perfected.",
              },
              {
                emoji: "💻",
                title: "Virtual hangouts",
                text: "The missing game night for the long-distance crew. Fire up a call, share a code, and it feels like the old apartment again.",
              },
              {
                emoji: "☘️",
                title: "St. Patrick's Day",
                text: "It's called Irish Poker. This is the big leagues. Book March 17th off now.",
              },
              {
                emoji: "🏕️",
                title: "Trips & tailgates",
                text: "Bachelor parties, cabin weekends, tailgates: anywhere phones exist and a deck of cards got left at home.",
              },
            ].map((f, i) => (
              <GlassCard key={f.title} {...stagger(i % 4)}>
                <CardEmoji>{f.emoji}</CardEmoji>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </GlassCard>
            ))}
          </CardGrid>

          <SoberNote {...fadeUp}>
            <span>💚</span>
            <p>
              <strong>Play it your way.</strong> Irish Poker is for adults of
              legal drinking age, but the game itself doesn&apos;t care
              what&apos;s in your cup. Water, soda, or points on a whiteboard
              work exactly the same. Pace yourself, look after your friends, and
              never drink and drive.
            </p>
          </SoberNote>
        </Section>

        {/* ------------------------------ FAQ -------------------------------- */}
        <Section id="faq">
          <Center>
            <motion.div {...fadeUp}>
              <Kicker>Everything answered</Kicker>
              <SectionTitle>Frequently Asked Questions</SectionTitle>
              <Lead style={{ marginBottom: 34 }}>
                Quick answers about the game, playing on this site, and the
                fine print. Can&apos;t find yours? Email{" "}
                <a href="mailto:dcrame2@gmail.com">dcrame2@gmail.com</a> and
                we&apos;ll add it.
              </Lead>
            </motion.div>
          </Center>
          <FaqSection />
          <AdSlot style={{ marginTop: 40 }}>
            <AdBanner slot={AD_SLOTS.gameOver} height={90} maxWidth={728} />
          </AdSlot>
        </Section>

        {/* ------------------------------ CTA -------------------------------- */}
        <Section>
          <CtaBand />
        </Section>

        <MarketingFooter />
      </PageShell>
    </>
  );
}
