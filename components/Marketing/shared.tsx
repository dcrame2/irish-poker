import React, { useState } from "react";
import Link from "next/link";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme, mq } from "@/styles/theme";
import FloatingSuits from "../FloatingSuits/Index";

/* ---------------------------------------------------------------------------
   Shared chrome + primitives for the marketing/content pages (/, /how-to-play,
   /faq). These pages are statically rendered so every word is crawlable;
   they exist both for players and for search engines / AdSense review.
--------------------------------------------------------------------------- */

export const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" },
} as const;

export const stagger = (i: number) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut", delay: 0.08 * i },
});

/* ------------------------------- page shell ------------------------------ */

const Shell = styled.div`
  min-height: 100dvh;
  position: relative;
  overflow-x: hidden;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
`;

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <FloatingSuits />
      <Content>{children}</Content>
    </Shell>
  );
}

/* ---------------------------------- nav ---------------------------------- */

/* sticky glass bar so Play Free is always one tap away */
const NavOuter = styled.header`
  position: sticky;
  top: 0;
  z-index: 80;
  background: rgba(7, 26, 16, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(233, 184, 76, 0.16);
`;

const NavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px clamp(16px, 4vw, 44px);
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const NavLogo = styled(Link)`
  font-family: ${theme.fontDisplay};
  font-size: 1.55rem;
  color: ${theme.cream};
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.4), 0 0 30px rgba(233, 184, 76, 0.25);
  white-space: nowrap;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: clamp(10px, 2.4vw, 26px);
`;

const NavLink = styled(Link)`
  color: ${theme.creamDim};
  font-weight: 500;
  font-size: 0.98rem;
  transition: color 0.15s;

  &:hover {
    color: ${theme.gold};
  }

  @media ${mq.mobile} {
    display: none;
  }
`;

export const PlayCta = styled(Link)`
  font-weight: 700;
  font-size: 0.98rem;
  letter-spacing: 0.02em;
  color: ${theme.feltDark};
  background: linear-gradient(180deg, #f5cf7d 0%, ${theme.gold} 55%, #c9962f 100%);
  border-radius: 999px;
  padding: 10px 22px;
  box-shadow: 0 3px 0 #8a6519, 0 8px 20px rgba(0, 0, 0, 0.35);
  transition: transform 0.12s ease, filter 0.15s ease;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }
`;

const Burger = styled.button`
  display: none;
  background: ${theme.glass};
  border: 1px solid ${theme.panelBorder};
  border-radius: 12px;
  color: ${theme.cream};
  font-size: 1.25rem;
  width: 42px;
  height: 42px;
  place-items: center;

  @media ${mq.mobile} {
    display: grid;
  }
`;

const MobileMenu = styled(motion.nav)`
  position: absolute;
  top: calc(100% + 6px);
  left: 14px;
  right: 14px;
  background: rgba(5, 20, 12, 0.97);
  border: 1px solid ${theme.panelBorder};
  border-radius: 18px;
  backdrop-filter: blur(16px);
  box-shadow: ${theme.shadowLg};
  padding: 10px;
  display: none;
  flex-direction: column;

  a {
    padding: 14px 16px;
    border-radius: 12px;
    color: ${theme.cream};
    font-weight: 500;
    font-size: 1.02rem;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: ${theme.gold};
    }
  }

  @media ${mq.mobile} {
    display: flex;
  }
`;

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <NavOuter>
      <NavBar>
      <NavLogo href="/" onClick={close}>
        Irish Poker ☘
      </NavLogo>
      <NavLinks>
        <NavLink href="/how-to-play">How to Play</NavLink>
        <NavLink href="/#faq">FAQ</NavLink>
        <PlayCta href="/play">Play Free 🍀</PlayCta>
        <Burger
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </Burger>
      </NavLinks>
      <AnimatePresence>
        {open && (
          <MobileMenu
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            <Link href="/play" onClick={close}>
              🍀 Play Free
            </Link>
            <Link href="/how-to-play" onClick={close}>
              How to Play
            </Link>
            <Link href="/#faq" onClick={close}>
              FAQ
            </Link>
            <Link href="/privacy" onClick={close}>
              Privacy Policy
            </Link>
          </MobileMenu>
        )}
      </AnimatePresence>
      </NavBar>
    </NavOuter>
  );
}

/* -------------------------------- sections ------------------------------- */

export const Section = styled.section`
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(44px, 7vw, 90px) clamp(18px, 4vw, 44px);
`;

export const Kicker = styled.p`
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: ${theme.gold};
  margin-bottom: 12px;
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.fontDisplay};
  font-weight: 400;
  font-size: clamp(1.9rem, 4.6vw, 2.9rem);
  color: ${theme.cream};
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.4), 0 0 40px rgba(233, 184, 76, 0.2);
  margin-bottom: 18px;
  line-height: 1.15;
`;

export const Lead = styled.p`
  font-size: clamp(1.02rem, 1.6vw, 1.15rem);
  line-height: 1.65;
  color: ${theme.creamDim};
  max-width: 720px;

  strong {
    color: ${theme.cream};
  }

  a {
    color: ${theme.gold};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  & + & {
    margin-top: 14px;
  }
`;

export const Center = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${Lead} {
    margin-left: auto;
    margin-right: auto;
  }
`;

/* ------------------------------ glass cards ------------------------------ */

export const CardGrid = styled.div<{ $min?: number }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(${({ $min }) => $min ?? 250}px, 100%), 1fr)
  );
  gap: 18px;
  margin-top: 34px;
`;

export const GlassCard = styled(motion.div)`
  background: ${theme.panel};
  border: 1px solid ${theme.panelBorder};
  border-radius: 20px;
  padding: 26px 24px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: ${theme.shadowMd};
  transition: transform 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${theme.goldSoft};
  }

  h3 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: 1.35rem;
    color: ${theme.gold};
    margin-bottom: 10px;
  }

  p {
    font-size: 0.98rem;
    line-height: 1.6;
    color: ${theme.creamDim};
  }

  p strong {
    color: ${theme.cream};
  }
`;

export const CardEmoji = styled.span`
  display: inline-block;
  font-size: 1.9rem;
  margin-bottom: 12px;
`;

/* ------------------------------- CTA band -------------------------------- */

const pulseGoldSoft = keyframes`
  0%, 100% { box-shadow: 0 4px 0 #8a6519, 0 0 0 0 rgba(233, 184, 76, 0.45); }
  50% { box-shadow: 0 4px 0 #8a6519, 0 0 0 16px rgba(233, 184, 76, 0); }
`;

export const BigPlayButton = styled(Link)`
  display: inline-block;
  font-weight: 700;
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  letter-spacing: 0.02em;
  color: ${theme.feltDark};
  background: linear-gradient(180deg, #f5cf7d 0%, ${theme.gold} 55%, #c9962f 100%);
  border-radius: 18px;
  padding: 17px 44px;
  box-shadow: 0 4px 0 #8a6519, 0 12px 30px rgba(0, 0, 0, 0.4);
  animation: ${pulseGoldSoft} 2.6s infinite;
  transition: transform 0.12s ease, filter 0.15s ease;

  &:hover {
    filter: brightness(1.06);
    transform: translateY(-2px);
  }
`;

export const GhostLinkButton = styled(Link)`
  display: inline-block;
  font-weight: 500;
  font-size: 1.02rem;
  border-radius: 16px;
  padding: 15px 30px;
  color: ${theme.cream};
  background: ${theme.glass};
  border: 1px solid ${theme.panelBorder};
  transition: background 0.15s ease, border-color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: ${theme.gold};
  }
`;

const bandSheen = keyframes`
  0%, 100% { transform: translateX(-70%) rotate(-10deg); opacity: 0.04; }
  50% { transform: translateX(70%) rotate(-10deg); opacity: 0.12; }
`;

const Band = styled(motion.div)`
  text-align: center;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(26, 112, 66, 0.5) 0%, transparent 65%),
    ${theme.panel};
  border: 1px solid ${theme.goldSoft};
  border-radius: 28px;
  padding: clamp(36px, 6vw, 64px) 24px;
  backdrop-filter: blur(12px);
  box-shadow: ${theme.shadowLg}, inset 0 1px 0 rgba(233, 184, 76, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: "☘";
    position: absolute;
    right: -30px;
    bottom: -46px;
    font-size: 13rem;
    color: rgba(233, 184, 76, 0.06);
    transform: rotate(-14deg);
    pointer-events: none;
  }

  /* slow pub-light sweep across the sign */
  &::after {
    content: "";
    position: absolute;
    inset: -30%;
    background: linear-gradient(
      100deg,
      transparent 44%,
      rgba(255, 255, 255, 0.5) 50%,
      transparent 56%
    );
    animation: ${bandSheen} 7s ease-in-out infinite;
    pointer-events: none;
  }
`;

const BandTitle = styled.h2`
  font-family: ${theme.fontDisplay};
  font-weight: 400;
  font-size: clamp(1.8rem, 4.4vw, 2.7rem);
  color: ${theme.cream};
  margin-bottom: 10px;
`;

const BandText = styled.p`
  color: ${theme.creamDim};
  font-size: 1.05rem;
  margin-bottom: 26px;
`;

export function CtaBand({
  title = "Ready to deal the cards?",
  text = "Grab your drink of choice, rally the group chat, and start a party. It takes about ten seconds.",
  button = "Play Irish Poker Free 🍀",
}: {
  title?: string;
  text?: string;
  button?: string;
}) {
  return (
    <Band {...fadeUp}>
      <BandTitle>{title}</BandTitle>
      <BandText>{text}</BandText>
      <BigPlayButton href="/play">{button}</BigPlayButton>
    </Band>
  );
}

/* --------------------------------- footer -------------------------------- */

const Foot = styled.footer`
  border-top: 1px solid ${theme.panelBorder};
  margin-top: clamp(30px, 5vw, 60px);
`;

const FootInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px clamp(18px, 4vw, 44px) 34px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const FootTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
`;

const FootBrand = styled.div`
  max-width: 340px;

  p {
    margin-top: 8px;
    font-size: 0.92rem;
    line-height: 1.55;
    color: ${theme.creamDim};
  }
`;

const FootCols = styled.div`
  display: flex;
  gap: clamp(28px, 6vw, 70px);
  flex-wrap: wrap;
`;

const FootCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;

  h4 {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${theme.gold};
    margin-bottom: 4px;
  }

  a {
    color: ${theme.creamDim};
    font-size: 0.95rem;

    &:hover {
      color: ${theme.gold};
    }
  }
`;

const FootNote = styled.p`
  font-size: 0.85rem;
  color: rgba(244, 239, 225, 0.45);
  line-height: 1.55;
  border-top: 1px solid rgba(233, 184, 76, 0.12);
  padding-top: 18px;
`;

export function MarketingFooter() {
  return (
    <Foot>
      <FootInner>
        <FootTop>
          <FootBrand>
            <NavLogo href="/">Irish Poker ☘</NavLogo>
            <p>
              The classic four-round drinking card game, rebuilt for the
              browser. Play free with 2-10 friends in the same room or across
              the world. No app, no sign-up.
            </p>
          </FootBrand>
          <FootCols>
            <FootCol>
              <h4>Play</h4>
              <Link href="/play">Start a party</Link>
              <Link href="/how-to-play">How to play</Link>
              <Link href="/#faq">FAQ</Link>
            </FootCol>
            <FootCol>
              <h4>Site</h4>
              <Link href="/privacy">Privacy policy</Link>
              <a href="mailto:dcrame2@gmail.com">Contact</a>
            </FootCol>
          </FootCols>
        </FootTop>
        <FootNote>
          Made with ☘ by Dylan Cramer. Irish Poker is intended for adults of
          legal drinking age. Please drink responsibly, know your limits, and
          never drink and drive. Prefer to keep it dry? The game is just as fun
          with water, soda, or points.
        </FootNote>
      </FootInner>
    </Foot>
  );
}
