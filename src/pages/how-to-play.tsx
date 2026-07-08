import Head from "next/head";
import styled from "styled-components";
import { motion } from "framer-motion";
import { theme, mq } from "@/styles/theme";
import {
  PageShell,
  MarketingNav,
  MarketingFooter,
  Section,
  Kicker,
  SectionTitle,
  Lead,
  Center,
  GlassCard,
  CardGrid,
  CardEmoji,
  CtaBand,
  fadeUp,
  stagger,
} from "../../components/Marketing/shared";
import AdBanner from "../../components/Ads/AdBanner";
import { AD_SLOTS } from "@lib/ads";

/* ------------------------------ article bits ----------------------------- */

const PageTitle = styled.h1`
  font-family: ${theme.fontDisplay};
  font-weight: 400;
  font-size: clamp(2.4rem, 6.5vw, 4rem);
  line-height: 1.08;
  color: ${theme.cream};
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.4), 0 0 40px rgba(233, 184, 76, 0.25);
  margin-bottom: 14px;
`;

const Article = styled.div`
  max-width: 780px;
  margin: 0 auto;

  h3 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: 1.45rem;
    color: ${theme.gold};
    margin: 30px 0 10px;
  }

  p {
    font-size: 1.03rem;
    line-height: 1.7;
    color: ${theme.creamDim};
    margin: 12px 0;
  }

  p strong,
  li strong {
    color: ${theme.cream};
  }

  ul,
  ol {
    margin: 12px 0 12px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    font-size: 1.01rem;
    line-height: 1.65;
    color: ${theme.creamDim};
  }
`;

const RoundBlock = styled(motion.div)`
  background: ${theme.panel};
  border: 1px solid ${theme.panelBorder};
  border-radius: 22px;
  padding: 28px 26px;
  margin: 26px 0;
  backdrop-filter: blur(12px);
  box-shadow: ${theme.shadowMd};
  position: relative;
  overflow: hidden;

  &::before {
    content: attr(data-num);
    position: absolute;
    top: -26px;
    right: 6px;
    font-family: ${theme.fontDisplay};
    font-size: 7rem;
    color: rgba(233, 184, 76, 0.09);
    pointer-events: none;
  }

  h3 {
    margin-top: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const RoundQuestion = styled.p`
  font-size: 0.9rem !important;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${theme.gold} !important;
  margin-top: 0 !important;
`;

const Example = styled.div`
  border-left: 3px solid ${theme.goldSoft};
  background: rgba(0, 0, 0, 0.25);
  border-radius: 0 14px 14px 0;
  padding: 14px 18px;
  margin: 14px 0;

  p {
    margin: 4px 0;
    font-size: 0.97rem;
  }

  em {
    color: ${theme.gold};
    font-style: normal;
    font-weight: 600;
  }
`;

const TipRow = styled.p`
  background: rgba(79, 200, 120, 0.08);
  border: 1px solid rgba(79, 200, 120, 0.28);
  border-radius: 12px;
  padding: 12px 16px !important;
  font-size: 0.95rem !important;

  strong {
    color: ${theme.clover} !important;
  }
`;

const SuitDivider = styled.div`
  text-align: center;
  font-size: 1.3rem;
  letter-spacing: 18px;
  color: ${theme.goldSoft};
  padding: 8px 0;
`;

const AdSlot = styled.div`
  display: flex;
  justify-content: center;
  max-width: 780px;
  margin: 30px auto;
`;

/* --------------------------------- page ---------------------------------- */

export default function HowToPlay() {
  return (
    <>
      <Head>
        <title>How to Play Irish Poker: Full Rules, Odds & Strategy Guide</title>
        <meta
          name="description"
          content="The complete guide to Irish Poker: setup, all four rounds (Red or Black, Higher or Lower, Inside or Outside, Name the Suit), drinking rules, odds, strategy tips, and popular house-rule variations."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#071a10" />
        <link rel="canonical" href="https://irish-poker.com/how-to-play" />
        <link rel="icon" href="favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Play Irish Poker",
              description:
                "Learn the rules of Irish Poker, the classic four-round drinking card game: Red or Black, Higher or Lower, Inside or Outside, and Name the Suit.",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Deal",
                  text: "Every player receives four face-down cards they may not look at.",
                },
                {
                  "@type": "HowToStep",
                  name: "Round 1: Red or Black",
                  text: "Each player guesses the color of their first card before flipping it.",
                },
                {
                  "@type": "HowToStep",
                  name: "Round 2: Higher or Lower",
                  text: "Each player guesses whether their second card is higher or lower than their first. Ties lose.",
                },
                {
                  "@type": "HowToStep",
                  name: "Round 3: Inside or Outside",
                  text: "Each player guesses whether their third card falls between their first two cards or outside them. Matching either card loses.",
                },
                {
                  "@type": "HowToStep",
                  name: "Round 4: Name the Suit",
                  text: "Each player guesses the exact suit of their final card.",
                },
                {
                  "@type": "HowToStep",
                  name: "Drink or give",
                  text: "A wrong guess means you drink. A correct guess means you choose another player to drink.",
                },
              ],
            }),
          }}
        />
      </Head>

      <PageShell>
        <MarketingNav />

        <Section as="header">
          <Center>
            <motion.div {...fadeUp}>
              <Kicker>The complete guide</Kicker>
              <PageTitle>How to Play Irish Poker</PageTitle>
              <Lead>
                Everything you need to run a perfect game: the rules of all
                four rounds, who drinks when, the real odds behind every guess,
                and the house rules groups love. Five minutes from now,
                you&apos;ll be the person who teaches everyone else.
              </Lead>
            </motion.div>
          </Center>
        </Section>

        <Section style={{ paddingTop: 0 }}>
          <Article>
            <motion.div {...fadeUp}>
              <SectionTitle as="h2">The basics</SectionTitle>
              <p>
                Irish Poker is a guessing game wearing a poker costume. There
                are no bets, no bluffing, and no hands to rank, just four
                face-down cards in front of every player and four rounds of
                increasingly gutsy predictions. It&apos;s fast, it needs zero
                explanation after the first round, and it produces more
                table-wide eruptions per minute than any card game we know.
              </p>

              <h3>What you need</h3>
              <ul>
                <li>
                  <strong>2-10 players</strong>, and the sweet spot is 4 to 8.
                </li>
                <li>
                  <strong>Drinks</strong>: beer, seltzer, cocktails, water,
                  soda… the rules don&apos;t care what&apos;s in the cup.
                </li>
                <li>
                  <strong>Cards</strong>: a standard 52-card deck if you&apos;re
                  playing physically, or just{" "}
                  <a href="/play" style={{ color: theme.gold, textDecoration: "underline" }}>
                    this website
                  </a>
                  , which deals, shuffles, tracks turns, and counts every drink
                  for you.
                </li>
              </ul>

              <h3>Setup and the deal</h3>
              <p>
                Each player is dealt <strong>four cards face-down</strong>, in a
                row, and, this is sacred, <strong>you may not look at them</strong>.
                The whole game is about guessing what your own cards are, one at
                a time, with the entire table watching. Aces are high, and every
                round moves clockwise: each player takes their turn, resolves
                their drink, and the spotlight moves on.
              </p>
              <p>
                Playing online? The dealer is the website: create a party, share
                your 4-letter code, and everyone&apos;s cards appear face-down on
                a shared live table. When it&apos;s your turn, your options light                up. Tap your guess and the card flips for everyone to see.
              </p>
            </motion.div>

            <SuitDivider aria-hidden>♥ ♠ ♦ ♣</SuitDivider>

            <motion.div {...fadeUp}>
              <SectionTitle as="h2">The four rounds</SectionTitle>
            </motion.div>

            <RoundBlock data-num="1" {...fadeUp}>
              <h3>🟥 Round 1: Red or Black</h3>
              <RoundQuestion>“What color is your first card?”</RoundQuestion>
              <p>
                The opener. Before flipping your first card, call{" "}
                <strong>red</strong> (hearts ♥ or diamonds ♦) or{" "}
                <strong>black</strong> (spades ♠ or clubs ♣). Flip it. That&apos;s
                it. You&apos;re playing Irish Poker.
              </p>
              <Example>
                <p>
                  Sarah calls <em>red</em>. She flips the ace of spades.
                </p>
                <p>The table erupts. Sarah drinks. The game has begun.</p>
              </Example>
              <TipRow>
                <strong>The odds:</strong> a true 50/50 on a fresh deck. Playing
                with a physical deck late in the night? Count the colors already
                showing on the table and lean the other way.
              </TipRow>
            </RoundBlock>

            <RoundBlock data-num="2" {...fadeUp}>
              <h3>⬆️ Round 2: Higher or Lower</h3>
              <RoundQuestion>“Is your second card higher or lower than your first?”</RoundQuestion>
              <p>
                Now your first card is face-up, and you call whether your{" "}
                <strong>second</strong> card beats it or falls under it.
                Critically: <strong>a tie loses</strong>. Match your first
                card&apos;s rank exactly and you drink. The deck shows no mercy.
              </p>
              <Example>
                <p>
                  Mike&apos;s first card is a <em>3 of hearts</em>. He calls{" "}
                  <em>higher</em>. Smart, almost everything beats a 3.
                </p>
                <p>
                  He flips… another 3. The rarest insult in the game. Drink,
                  Mike.
                </p>
              </Example>
              <TipRow>
                <strong>The odds:</strong> entirely set by your first card. Off
                a 2 or an ace, the right call wins roughly 92% of the time. Off
                a 7 or 8, you&apos;re basically flipping a coin with worse odds
                than round one. A 7 wins &quot;higher&quot; only about 55% of
                the time, and the tie is lurking.
              </TipRow>
            </RoundBlock>

            <RoundBlock data-num="3" {...fadeUp}>
              <h3>🎯 Round 3: Inside or Outside</h3>
              <RoundQuestion>“Does your third card land between your first two, or outside them?”</RoundQuestion>
              <p>
                Your first two cards now form a window. Call{" "}
                <strong>inside</strong> if you think your third card&apos;s rank
                falls strictly between them, or <strong>outside</strong> if it
                falls above the higher or below the lower.{" "}
                <strong>Landing exactly on either card loses</strong>. The
                window has electric fences.
              </p>
              <Example>
                <p>
                  Priya is showing a <em>4</em> and a <em>king</em>, a huge
                  window. She calls <em>inside</em>, and her 9 of clubs lands
                  safely in the middle. She grins and hands a drink to Mike,
                  who is having a night.
                </p>
              </Example>
              <TipRow>
                <strong>The odds:</strong> read the gap. With a 4 and a king,
                &quot;inside&quot; wins about two-thirds of the time. With back-to-back
                ranks like a 7 and an 8, &quot;inside&quot; is literally
                impossible, so the only correct call is outside, and people still
                blow it after a few rounds.
              </TipRow>
            </RoundBlock>

            <RoundBlock data-num="4" {...fadeUp}>
              <h3>♠️ Round 4: Name the Suit</h3>
              <RoundQuestion>“What suit is your last card?”</RoundQuestion>
              <p>
                The finale, and the round the whole game builds toward. Call the{" "}
                <strong>exact suit</strong> of your final card: hearts,
                diamonds, spades, or clubs. A raw 25% shot, which is exactly why
                nailing it feels like winning the lottery and earns you the
                most satisfying drink-giving of the night.
              </p>
              <Example>
                <p>
                  Three of Jake&apos;s cards are already showing:{" "}
                  <em>two hearts and a diamond</em>. Not one club has appeared
                  anywhere on the table all game. He calls <em>clubs</em>…
                </p>
                <p>
                  …and flips the 10 of clubs. Pandemonium. Jake points at three
                  different people. Legends are made in round four.
                </p>
              </Example>
              <TipRow>
                <strong>The odds:</strong> 25% blind, but never guess blind.
                Every flipped card on the table is information. Count what&apos;s
                out and call the suit you&apos;ve seen least.
              </TipRow>
            </RoundBlock>

            <AdSlot>
              <AdBanner slot={AD_SLOTS.lobby} height={90} maxWidth={728} />
            </AdSlot>

            <motion.div {...fadeUp}>
              <SectionTitle as="h2">Who drinks?</SectionTitle>
              <p>The drinking economy of Irish Poker is beautifully simple:</p>
              <ul>
                <li>
                  <strong>Guess wrong → you drink.</strong> Immediate, personal,
                  non-negotiable.
                </li>
                <li>
                  <strong>Guess right → you give a drink.</strong> Point at any
                  player and they drink. Some tables allow splitting into
                  multiple sips across multiple victims. Decide before you
                  start.
                </li>
                <li>
                  <strong>Most drinks at the end takes the crown of shame.</strong>{" "}
                  This site tallies everything automatically and shows final
                  standings, per game and across the whole night.
                </li>
              </ul>
              <p>
                That give-a-drink rule is the social engine of the game.
                Alliances form. Betrayals happen in real time. The person who
                keeps nailing round four becomes the most dangerous player at
                the table, and everyone knows it.
              </p>
            </motion.div>

            <SuitDivider aria-hidden>♣ ♦ ♠ ♥</SuitDivider>

            <motion.div {...fadeUp}>
              <SectionTitle as="h2">Strategy corner</SectionTitle>
              <p>
                Yes, it&apos;s a luck game. No, that doesn&apos;t mean you should
                play it badly. A few edges the sharks at your table are already
                using:
              </p>
              <ul>
                <li>
                  <strong>Round 2 is won before you guess.</strong> Extreme
                  first cards (2-4, J-A) are gifts. Take the obvious call.
                  Middle cards (6-9) are where drinks happen; accept the
                  coin-flip with dignity.
                </li>
                <li>
                  <strong>In round 3, count the window.</strong> The gap between
                  your two cards tells you everything. Eight or more ranks
                  apart? Inside is strong. Three or fewer? Outside, always.
                  Adjacent ranks? Inside is impossible. Don&apos;t be the
                  cautionary tale.
                </li>
                <li>
                  <strong>Round 4 rewards the observant.</strong> By the finale,
                  dozens of cards may be face-up across the table. Suit counts
                  are rarely even. The player who&apos;s been quietly counting
                  clubs all game is about to hand somebody a drink.
                </li>
                <li>
                  <strong>Distribute your drinks tactically.</strong> Feeding
                  every drink to one friend is hilarious exactly once. Spreading
                  them keeps everyone in the game, and keeps you off the
                  revenge list for round four.
                </li>
              </ul>
            </motion.div>

            <motion.div {...fadeUp}>
              <SectionTitle as="h2">House rules & variations</SectionTitle>
              <p>
                Every crew seasons Irish Poker differently. Popular variations
                to try once you&apos;ve mastered the classic:
              </p>
              <ul>
                <li>
                  <strong>Double or nothing:</strong> after a correct guess, a
                  player may risk it and guess again on the same round. Right
                  twice, give double the drinks. Wrong, take them all yourself.
                </li>
                <li>
                  <strong>Social ties:</strong> instead of a tie losing in round
                  two, everyone at the table drinks. Chaos, but democratic
                  chaos.
                </li>
                <li>
                  <strong>Suit streaks:</strong> if two players in a row nail
                  round four, everyone else at the table drinks. Rare enough to
                  feel like an eclipse.
                </li>
                <li>
                  <strong>The dry game:</strong> swap drinks for points: fewest
                  points after four rounds wins. Same tension, zero hangover,
                  and honestly still a great party game.
                </li>
              </ul>
              <p>
                Whatever you add, agree on it <strong>before</strong> the deal.
                Mid-game rules committees are how parties die.
              </p>
            </motion.div>

            <motion.div {...fadeUp}>
              <SectionTitle as="h2">Play it safe</SectionTitle>
              <p>
                Irish Poker is for adults of legal drinking age. A
                &quot;drink&quot; means a sip. Never force a finish, never
                pressure anyone to play with alcohol, and keep water in the
                rotation. Look after your table: the best game nights are the
                ones everyone remembers. And obviously, never drink and drive.
              </p>
            </motion.div>
          </Article>
        </Section>

        <Section>
          <CtaBand
            title="You know the rules. Time to prove it."
            text="Start a free party, send the code to your group chat, and see who really trusts their gut."
            button="Deal Me In 🍀"
          />
        </Section>

        <MarketingFooter />
      </PageShell>
    </>
  );
}
