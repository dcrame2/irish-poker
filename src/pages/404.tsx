import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import {
  PageShell,
  MarketingNav,
  MarketingFooter,
  BigPlayButton,
  GhostLinkButton,
} from "../../components/Marketing/shared";

const Wrap = styled.main`
  min-height: 55dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  position: relative;
  z-index: 1;
`;

const BigCard = styled.div`
  font-size: 4rem;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-family: ${theme.fontDisplay};
  font-weight: 400;
  font-size: clamp(2rem, 6vw, 3.2rem);
  color: ${theme.cream};
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.4), 0 0 40px rgba(233, 184, 76, 0.25);
  margin-bottom: 12px;
`;

const Text = styled.p`
  max-width: 480px;
  color: ${theme.creamDim};
  font-size: 1.05rem;
  line-height: 1.65;
  margin-bottom: 28px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
`;

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | Irish Poker</title>
        <meta name="robots" content="noindex" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#071a10" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageShell>
        <MarketingNav />
        <Wrap>
          <BigCard aria-hidden>🃏</BigCard>
          <Title>Wrong guess — this page isn&rsquo;t in the deck.</Title>
          <Text>
            The link you followed doesn&rsquo;t exist (anymore). House rules
            say a dead link means the <em>website</em> drinks. Here&rsquo;s the
            way back to the table.
          </Text>
          <Buttons>
            <BigPlayButton href="/play">Play Irish Poker 🍀</BigPlayButton>
            <GhostLinkButton href="/">Back to the homepage</GhostLinkButton>
          </Buttons>
        </Wrap>
        <MarketingFooter />
      </PageShell>
    </>
  );
}
