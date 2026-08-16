import Link from "next/link";
import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";
import {
  PageShell,
  MarketingNav,
  MarketingFooter,
  Section,
  Kicker,
  SectionTitle,
  Lead,
  Center,
  CtaBand,
  fadeUp,
  stagger,
} from "../../../components/Marketing/shared";
import Seo, { SITE_ORIGIN } from "../../../components/Marketing/Seo";
import { GUIDES } from "@lib/guides";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 18px;
  margin-top: 36px;
`;

const GuideCard = styled(motion.article)`
  background: ${theme.panel};
  border: 1px solid ${theme.panelBorder};
  border-radius: 20px;
  backdrop-filter: blur(12px);
  box-shadow: ${theme.shadowMd};
  transition: transform 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${theme.goldSoft};
  }

  a {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 26px 24px;
    height: 100%;
  }

  h2 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: 1.35rem;
    line-height: 1.25;
    color: ${theme.gold};
  }

  p {
    font-size: 0.97rem;
    line-height: 1.6;
    color: ${theme.creamDim};
    flex: 1;
  }
`;

const CardMeta = styled.span`
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(244, 239, 225, 0.5);
`;

const CardEmojiBig = styled.span`
  font-size: 2rem;
`;

export default function GuidesIndex() {
  return (
    <>
      <Seo
        title="Party & Drinking Game Guides | Irish Poker"
        description="Real guides for people who take game night seriously: Irish Poker odds and house rules, the best drinking card games, alcohol-free play, long-distance game nights, and more."
        path="/guides"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Irish Poker Guides",
            url: `${SITE_ORIGIN}/guides`,
            hasPart: GUIDES.map((g) => ({
              "@type": "Article",
              headline: g.title,
              url: `${SITE_ORIGIN}/guides/${g.slug}`,
            })),
          },
        ]}
      />

      <PageShell>
        <MarketingNav />

        <Section as="header">
          <Center>
            <motion.div {...fadeUp}>
              <Kicker>The library</Kicker>
              <SectionTitle as="h1">Game Night Guides</SectionTitle>
              <Lead>
                Everything we&apos;ve learned from an unreasonable number of
                game nights, written down properly: the math behind the guesses,
                the house rules that actually work, and how to run a great
                night whether your friends are in the same kitchen or three
                time zones away. Start with the{" "}
                <Link href="/how-to-play">complete rulebook</Link> if
                you&apos;re brand new.
              </Lead>
            </motion.div>
          </Center>

          <Grid>
            {GUIDES.map((g, i) => (
              <GuideCard key={g.slug} {...stagger(i % 3)}>
                <Link href={`/guides/${g.slug}`}>
                  <CardEmojiBig aria-hidden>{g.emoji}</CardEmojiBig>
                  <h2>{g.title}</h2>
                  <p>{g.description}</p>
                  <CardMeta>{g.readMinutes} min read</CardMeta>
                </Link>
              </GuideCard>
            ))}
          </Grid>
        </Section>

        <Section>
          <CtaBand
            title="Done reading? Deal the cards."
            text="Start a free Irish Poker party in your browser — no app, no sign-up, 2-10 players."
          />
        </Section>

        <MarketingFooter />
      </PageShell>
    </>
  );
}
