import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";
import { fadeUp, stagger } from "./shared";

/* The full FAQ, rendered as accordions on the homepage (#faq). Kept in its
   own module so the copy and the FAQPage JSON-LD stay in one place. */

const Group = styled(motion.div)`
  max-width: 780px;
  margin: 0 auto;
  width: 100%;
  text-align: left;

  & + & {
    margin-top: 36px;
  }

  h3 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: 1.5rem;
    color: ${theme.gold};
    margin-bottom: 16px;
  }
`;

const QA = styled(motion.details)`
  background: ${theme.panel};
  border: 1px solid ${theme.panelBorder};
  border-radius: 16px;
  padding: 0;
  margin-bottom: 12px;
  overflow: hidden;
  transition: border-color 0.15s;

  &[open] {
    border-color: ${theme.goldSoft};
  }

  summary {
    list-style: none;
    cursor: pointer;
    padding: 18px 52px 18px 22px;
    font-size: 1.05rem;
    font-weight: 600;
    color: ${theme.cream};
    position: relative;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }

    &::after {
      content: "+";
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.5rem;
      font-weight: 400;
      color: ${theme.gold};
      transition: transform 0.2s ease;
    }
  }

  &[open] summary::after {
    transform: translateY(-50%) rotate(45deg);
  }

  div {
    padding: 0 22px 20px;

    p {
      font-size: 0.99rem;
      line-height: 1.65;
      color: ${theme.creamDim};
      margin: 0 0 10px;
    }

    p:last-child {
      margin-bottom: 0;
    }

    strong {
      color: ${theme.cream};
    }

    a {
      color: ${theme.gold};
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
`;

type Faq = { q: string; a: React.ReactNode; aText: string };

const GROUPS: { title: string; faqs: Faq[] }[] = [
  {
    title: "The game",
    faqs: [
      {
        q: "What is Irish Poker?",
        aText:
          "Irish Poker is a classic four-round drinking card game. Each player gets four face-down cards and makes one guess per round about their own next card: its color, whether it's higher or lower than their first, whether it lands inside or outside their first two, and finally its exact suit. Wrong guesses drink; right guesses hand a drink to someone else.",
        a: (
          <p>
            Irish Poker is a classic four-round drinking card game. Each player
            gets <strong>four face-down cards</strong> and makes one guess per
            round about their own next card: its color, whether it&apos;s
            higher or lower than their first, whether it lands inside or
            outside their first two, and finally its exact suit. Wrong guesses
            drink; right guesses hand a drink to someone else. Full rules,
            odds, and strategy live in our{" "}
            <Link href="/how-to-play">How to Play guide</Link>.
          </p>
        ),
      },
      {
        q: "Is Irish Poker the same as Ride the Bus?",
        aText:
          "They're cousins. The four guessing rounds are nearly identical, but Ride the Bus adds a pyramid phase and a final 'ride the bus' punishment round for the loser. Irish Poker is the faster, cleaner version: four rounds and done.",
        a: (
          <p>
            They&apos;re cousins. The four guessing rounds are nearly
            identical, but Ride the Bus adds a pyramid phase and a final
            &quot;ride the bus&quot; punishment round for the loser. Irish
            Poker is the faster, cleaner version: four rounds and done, which
            is exactly why it&apos;s the pregame favorite.
          </p>
        ),
      },
      {
        q: "Is it actually poker?",
        aText:
          "Not at all. No betting, no bluffing, no hand rankings. The name is a joke that stuck. If you can guess a coin flip, you're fully qualified.",
        a: (
          <p>
            Not at all. No betting, no bluffing, no hand rankings. The name is
            a joke that stuck. If you can guess a coin flip, you&apos;re fully
            qualified.
          </p>
        ),
      },
      {
        q: "How long does a game take?",
        aText:
          "About 10-20 minutes depending on group size. Four rounds with 4-8 players usually lands around 15 minutes, a perfect pregame length. Rematches are one tap.",
        a: (
          <p>
            About 10-20 minutes depending on group size. Four rounds with 4-8
            players usually lands around 15 minutes, a perfect pregame length.
            Rematches are one tap, and drink totals carry across the night so
            the &quot;tonight&quot; leaderboard keeps score for you.
          </p>
        ),
      },
      {
        q: "Can we play without alcohol?",
        aText:
          "Absolutely. The game mechanics don't care what's in your cup: water, soda, or points work exactly the same. Plenty of groups play it dry as a pure party game.",
        a: (
          <p>
            Absolutely. The game mechanics don&apos;t care what&apos;s in your
            cup: water, soda, or &quot;points&quot; work exactly the same.
            Plenty of groups play it dry as a pure party game. If you do play
            with alcohol, you must be of legal drinking age, and a
            &quot;drink&quot; should always mean a sip.
          </p>
        ),
      },
    ],
  },
  {
    title: "Playing on this site",
    faqs: [
      {
        q: "Is it really free? What's the catch?",
        aText:
          "Completely free: no account, no paywall, no premium version. The site is supported by a small number of ads on our content pages.",
        a: (
          <p>
            Completely free: no account, no paywall, no premium version. The
            site is supported by a small number of ads on our content pages.
            That&apos;s the whole business model: you play, the ads keep the
            lights on.
          </p>
        ),
      },
      {
        q: "Do I need to download an app or make an account?",
        aText:
          "No. Irish Poker runs entirely in your web browser. Type a nickname, create or join a party, and you're playing. No email, no password, no app store.",
        a: (
          <p>
            No. Irish Poker runs entirely in your web browser. Type a nickname,
            create or join a party, and you&apos;re playing. No email, no
            password, no app store. It works on iPhone, Android, tablets, and
            laptops, anything with a modern browser.
          </p>
        ),
      },
      {
        q: "How do my friends join my game?",
        aText:
          "When you create a party you get a 4-letter code and a shareable invite link. Friends either tap the link or go to irish-poker.com, hit Join, and type the code. Parties hold up to 10 players.",
        a: (
          <p>
            When you create a party you get a <strong>4-letter code</strong>{" "}
            and a shareable invite link. Friends either tap the link or go to
            the site, hit <strong>Join</strong>, and type the code. Parties
            hold up to 10 players.
          </p>
        ),
      },
      {
        q: "Can we play remotely / over video call?",
        aText:
          "Yes, that is half the point. Everyone sees the same live table from their own device, wherever they are. Fire up a video call alongside it and it plays exactly like being in the same room.",
        a: (
          <p>
            Yes, that&apos;s half the point. Everyone sees the same live table
            from their own device, wherever they are. Fire up a video call
            alongside it and it plays exactly like being in the same room,
            groans and all. There&apos;s also built-in party chat and emotes if
            you&apos;d rather trash-talk in-game.
          </p>
        ),
      },
      {
        q: "What happens if someone's phone dies or they lose connection?",
        aText:
          "The game keeps going. Their seat and cards are saved, their turns auto-skip after a grace period, and the moment they reopen the site they're dropped right back into the party.",
        a: (
          <p>
            The game keeps going. Their seat and cards are saved, their turns
            auto-skip after a short grace period so nobody waits forever, and
            the moment they reopen the site they&apos;re dropped right back
            into the party with everything intact.
          </p>
        ),
      },
      {
        q: "Is the deck fair?",
        aText:
          "Yes. Every game deals from a freshly shuffled standard 52-card deck on our server. Unrevealed cards are never sent to anyone's device, so peeking is technically impossible, even for the tech-savvy.",
        a: (
          <p>
            Yes. Every game deals from a freshly shuffled standard 52-card deck
            on our server. Unrevealed cards are never sent to anyone&apos;s
            device until they flip, so peeking is technically impossible, even
            for your one friend who &quot;knows computers.&quot;
          </p>
        ),
      },
      {
        q: "Who is the host, and what can they do?",
        aText:
          "Whoever creates the party is the host. They start the game, launch rematches, and can skip a disconnected player's turn. If the host leaves, hosting passes automatically to another player.",
        a: (
          <p>
            Whoever creates the party is the host 👑. They start the game,
            launch rematches, and can skip a disconnected player&apos;s turn.
            If the host leaves, hosting passes automatically to another player
            so the party never gets stranded.
          </p>
        ),
      },
    ],
  },
  {
    title: "The fine print",
    faqs: [
      {
        q: "How old do I need to be?",
        aText:
          "Irish Poker is a drinking game intended for adults of legal drinking age in their country or region. Play the points variation if you're hosting a mixed crowd.",
        a: (
          <p>
            Irish Poker is a drinking game intended for{" "}
            <strong>adults of legal drinking age</strong> in their country or
            region. Play the points variation if you&apos;re hosting a mixed
            crowd.
          </p>
        ),
      },
      {
        q: "What data do you collect about me?",
        aText:
          "Almost none. No accounts exist; you play under a nickname. Game data lives in memory only for the duration of a party. See the privacy policy for full details on cookies, analytics, and ads.",
        a: (
          <p>
            Almost none. No accounts exist; you play under a nickname, and game
            data lives in memory only for the duration of a party. The{" "}
            <Link href="/privacy">privacy policy</Link> covers the full details
            on cookies, analytics, and advertising.
          </p>
        ),
      },
      {
        q: "I found a bug / I have an idea. Where do I send it?",
        aText:
          "Use the feedback form in the in-game menu (the ☰ button), or email dcrame2@gmail.com. Bug reports, feature requests, and stories about legendary round-four calls are all welcome.",
        a: (
          <p>
            Use the feedback form in the in-game menu (the ☰ button), or email{" "}
            <a href="mailto:dcrame2@gmail.com">dcrame2@gmail.com</a>. Bug
            reports, feature requests, and stories about legendary round-four
            calls are all welcome.
          </p>
        ),
      },
    ],
  },
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GROUPS.flatMap((g) =>
    g.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.aText },
    }))
  ),
};

export default function FaqSection() {
  return (
    <>
      {GROUPS.map((group) => (
        <Group key={group.title} {...fadeUp}>
          <h3>{group.title}</h3>
          {group.faqs.map((f, i) => (
            <QA key={f.q} {...stagger(Math.min(i, 4))}>
              <summary>{f.q}</summary>
              <div>{f.a}</div>
            </QA>
          ))}
        </Group>
      ))}
    </>
  );
}
