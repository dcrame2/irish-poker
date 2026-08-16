import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import Seo from "../../components/Marketing/Seo";
import {
  MarketingFooter,
  Section,
  Kicker,
  SectionTitle,
  Lead,
  CardGrid,
  GlassCard,
} from "../../components/Marketing/shared";

// The game is fully client-side (it talks to the socket server and reads
// localStorage for the persistent player id), so skip SSR for the app shell.
const App = dynamic(() => import("../../components/App/Index"), {
  ssr: false,
});

/* The game fills the first viewport; the guide below is statically rendered
   so the page has real, crawlable publisher content. It hides once you're in
   a party so nothing distracts from the table. */
const BelowFold = styled.div<{ $hidden: boolean }>`
  display: ${({ $hidden }) => ($hidden ? "none" : "block")};
  position: relative;
  z-index: 1;
  border-top: 1px solid ${theme.panelBorder};
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.25), transparent 120px);
`;

const RoundList = styled.ol`
  margin: 18px 0 0 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    color: ${theme.creamDim};
    font-size: 1.02rem;
    line-height: 1.65;
  }

  li strong {
    color: ${theme.cream};
  }
`;

const GuideLinks = styled.p`
  margin-top: 18px;
  color: ${theme.creamDim};
  line-height: 1.7;

  a {
    color: ${theme.gold};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export default function Play() {
  const [inRoom, setInRoom] = useState(false);

  return (
    <>
      <Seo
        title="Play Irish Poker Online | Free Multiplayer Drinking Game"
        description="Start an Irish Poker party in seconds: create a room, share the 4-letter code, and play the classic drinking card game live with 2-10 friends."
        path="/play"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Irish Poker",
            url: "https://irish-poker.com/play",
            applicationCategory: "GameApplication",
            operatingSystem: "Any (web browser)",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free online multiplayer version of Irish Poker, the classic four-round drinking card game. Create a party, share a 4-letter code, and play live with 2-10 friends.",
          },
        ]}
      />
      <main>
        <App onRoomChange={setInRoom} />

        <BelowFold $hidden={inRoom}>
          <Section as="section">
            <Kicker>New here?</Kicker>
            <SectionTitle as="h1">
              Play Irish Poker online — the 60-second version
            </SectionTitle>
            <Lead>
              Irish Poker is the classic four-round guessing game: every player
              gets four face-down cards and predicts each one before it flips.
              Wrong guess, you drink. Right guess, you hand a drink to anyone at
              the table. This site is the full game running live in your
              browser — it deals, enforces every rule, and counts every drink,
              so nobody has to sit out as dealer.
            </Lead>
            <Lead>
              <strong>To start:</strong> tap <strong>Create Party</strong>{" "}
              above, pick a nickname, and share the 4-letter room code with your
              group — text it, or send the invite link. Everyone joins from
              their own phone or laptop, in the same kitchen or across the
              world. 2 to 10 players, no app, no sign-up, completely free.
            </Lead>

            <RoundList>
              <li>
                <strong>Round 1 — Red or Black:</strong> call the color of your
                first card. A clean 50/50 to warm the table up.
              </li>
              <li>
                <strong>Round 2 — Higher or Lower:</strong> is your second card
                higher or lower than your first? Ties lose, and the deck knows
                it.
              </li>
              <li>
                <strong>Round 3 — Inside or Outside:</strong> does your third
                card land between your first two, or outside them? Landing
                exactly on either card loses.
              </li>
              <li>
                <strong>Round 4 — Name the Suit:</strong> call the exact suit of
                your last card. A 25% shot, and the reason this game produces
                legends.
              </li>
            </RoundList>

            <CardGrid $min={240} style={{ marginTop: 30 }}>
              <GlassCard>
                <h3>Learn the full rules</h3>
                <p>
                  Setup, every round in detail, who drinks when, strategy, and
                  the odds behind each call — the{" "}
                  <Link href="/how-to-play" style={{ color: theme.gold, textDecoration: "underline" }}>
                    complete how-to-play guide
                  </Link>{" "}
                  covers it all in about five minutes.
                </p>
              </GlassCard>
              <GlassCard>
                <h3>Playing smarter</h3>
                <p>
                  Round two is won before you guess and round four rewards
                  counting. The{" "}
                  <Link href="/guides/irish-poker-odds" style={{ color: theme.gold, textDecoration: "underline" }}>
                    odds guide
                  </Link>{" "}
                  breaks down the real math behind all four rounds.
                </p>
              </GlassCard>
              <GlassCard>
                <h3>Not drinking tonight?</h3>
                <p>
                  The game plays exactly the same with water, soda, or points.
                  See{" "}
                  <Link href="/guides/drinking-games-without-alcohol" style={{ color: theme.gold, textDecoration: "underline" }}>
                    how to run it alcohol-free
                  </Link>{" "}
                  without losing any of the tension.
                </p>
              </GlassCard>
            </CardGrid>

            <GuideLinks>
              Want more? Browse all our <Link href="/guides">party game
              guides</Link>, compare Irish Poker with{" "}
              <Link href="/guides/irish-poker-vs-ride-the-bus">Ride the
              Bus</Link>, or steal a few{" "}
              <Link href="/guides/irish-poker-house-rules">house rules</Link>{" "}
              for your next game night. Irish Poker is for adults of legal
              drinking age — a &ldquo;drink&rdquo; means a sip, keep water in
              the rotation, and never drink and drive.
            </GuideLinks>
          </Section>
          <MarketingFooter />
        </BelowFold>
      </main>
    </>
  );
}
