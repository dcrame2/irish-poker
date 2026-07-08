import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { theme, mq } from "@/styles/theme";
import { DisplayTitle } from "../../components/ui/shared";
import {
  PageShell,
  MarketingNav,
  MarketingFooter,
} from "../../components/Marketing/shared";

const LAST_UPDATED = "July 7, 2026";
const CONTACT_EMAIL = "dcrame2@gmail.com";

const Page = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px 60px;
  position: relative;
  z-index: 1;
`;

const Article = styled.article`
  width: min(720px, 100%);
  color: ${theme.cream};
  line-height: 1.6;

  h1 {
    font-size: clamp(2rem, 6vw, 3rem);
    text-align: center;
    margin-bottom: 8px;
  }

  h2 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    color: ${theme.gold};
    font-size: 1.4rem;
    margin: 34px 0 10px;
  }

  p,
  li {
    color: ${theme.creamDim};
    font-size: 1.02rem;
  }

  p {
    margin: 10px 0;
  }

  ul {
    margin: 10px 0 10px 22px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  a {
    color: ${theme.gold};
    text-underline-offset: 3px;
  }

  strong {
    color: ${theme.cream};
  }

  @media ${mq.mobile} {
    h2 {
      font-size: 1.25rem;
    }
  }
`;

const Updated = styled.p`
  text-align: center;
  color: ${theme.creamDim};
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin: 28px 0 8px;
  color: ${theme.gold};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Irish Poker</title>
        <meta
          name="description"
          content="Privacy Policy for Irish Poker, the online multiplayer drinking card game: what data we collect, how cookies and advertising work, and how to contact us."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#071a10" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <PageShell>
        <MarketingNav />
        <Page>
          <Article>
          <DisplayTitle as="h1">Privacy Policy</DisplayTitle>
          <Updated>Last updated: {LAST_UPDATED}</Updated>

          <p>
            Irish Poker (&ldquo;the game,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us&rdquo;) is a free multiplayer online drinking card game
            hosted at{" "}
            <a href="https://irish-poker.com">irish-poker.com</a>. This policy
            explains what information the game handles when you play, how it is
            used, and the choices you have. By using the game you agree to the
            practices described here.
          </p>

          <h2>Who can use Irish Poker</h2>
          <p>
            Irish Poker is a drinking game intended only for adults of legal
            drinking age in their country or region. It is not directed to
            children, and we do not knowingly collect information from anyone
            under the legal drinking age. If you are not of legal drinking age,
            please do not use the game.
          </p>

          <h2>Information we collect</h2>
          <p>
            Irish Poker has no user accounts and does not ask for your real
            name, address, or password. The information involved in playing is
            limited to:
          </p>
          <ul>
            <li>
              <strong>A display name</strong> you type when you create or join a
              party. Use any nickname you like; it is shown to other players in
              your party and is not verified.
            </li>
            <li>
              <strong>Gameplay data</strong> such as your party code, the cards
              dealt to you, your guesses, drink tallies, emotes, and chat
              messages you send. This is exchanged in real time with our game
              server so the game can run, and is held only in memory for the
              duration of a party; it is not written to a long-term database.
            </li>
            <li>
              <strong>Local browser storage.</strong> We store a random player
              ID and your current party code in your browser (via
              localStorage/sessionStorage) so you can reconnect if your
              connection drops or you refresh the page. You can clear this at any
              time through your browser settings.
            </li>
            <li>
              <strong>Optional feedback.</strong> If you use the feedback form,
              any name, email, and message you choose to enter are emailed to us
              so we can read and reply. All fields are optional except the
              message.
            </li>
          </ul>

          <h2>Cookies, analytics, and advertising</h2>
          <p>
            Irish Poker uses Google Analytics to understand how the game is used
            (for example, how many people start a party), which sets cookies to
            measure traffic in aggregate.
          </p>
          <p>
            We also display advertising through <strong>Google AdSense</strong>.
            Third-party vendors, including Google, use cookies to serve ads
            based on your prior visits to this and other websites. Google&rsquo;s
            use of advertising cookies enables it and its partners to serve ads
            to you based on your visit to Irish Poker and/or other sites on the
            internet.
          </p>
          <p>You can control this advertising:</p>
          <ul>
            <li>
              Opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              Opt out of a third-party vendor&rsquo;s use of cookies for
              personalized advertising at{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                aboutads.info/choices
              </a>
              .
            </li>
            <li>
              Learn how Google uses information from sites that use its services
              at{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
                policies.google.com/technologies/partner-sites
              </a>
              .
            </li>
          </ul>

          <h2>How we use information</h2>
          <p>
            We use the information above only to run the game (dealing cards,
            keeping score, syncing players, letting you reconnect), to show and
            measure ads that keep the game free, to understand usage in
            aggregate, and to respond to feedback you send us. We do not sell
            your personal information.
          </p>

          <h2>Data retention</h2>
          <p>
            Live gameplay data exists only while a party is active and is
            discarded when the party ends or everyone leaves. Feedback emails
            remain in our inbox until we no longer need them. Cookies set by
            Google Analytics and AdSense are governed by Google&rsquo;s own
            retention policies.
          </p>

          <h2>Your choices</h2>
          <p>
            You can play with any nickname, decline ad personalization using the
            links above, clear the game&rsquo;s local storage and cookies in your
            browser, or simply stop using the game at any time. To request that
            we delete a feedback email you sent us, contact us at the address
            below.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. When we do, we will
            revise the &ldquo;Last updated&rdquo; date at the top of this page.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

            <BackLink href="/play">← Back to the game</BackLink>
          </Article>
        </Page>
        <MarketingFooter />
      </PageShell>
    </>
  );
}
