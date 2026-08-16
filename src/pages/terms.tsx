import Link from "next/link";
import { DisplayTitle } from "../../components/ui/shared";
import {
  PageShell,
  MarketingNav,
  MarketingFooter,
} from "../../components/Marketing/shared";
import {
  ProseMain,
  ProseArticle,
  Updated,
  BackLink,
} from "../../components/Marketing/prose";
import Seo from "../../components/Marketing/Seo";

const LAST_UPDATED = "August 16, 2026";
const CONTACT_EMAIL = "dcrame2@gmail.com";

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms of Use | Irish Poker"
        description="The terms of use for irish-poker.com: who can play, acceptable use, disclaimers, and the ground rules for using the free online Irish Poker drinking card game."
        path="/terms"
      />

      <PageShell>
        <MarketingNav />
        <ProseMain>
          <ProseArticle>
            <DisplayTitle as="h1">Terms of Use</DisplayTitle>
            <Updated>Last updated: {LAST_UPDATED}</Updated>

            <p>
              Welcome to Irish Poker, a free multiplayer online card game hosted
              at <a href="https://irish-poker.com">irish-poker.com</a>{" "}
              (&ldquo;the site,&rdquo; &ldquo;the game,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us&rdquo;). These terms are the ground rules for using the
              site. By visiting the site or playing the game, you agree to them.
              If you do not agree, please do not use the site.
            </p>

            <h2>1. Who may play</h2>
            <p>
              Irish Poker is themed as a drinking game and is intended only for
              people who are of legal drinking age in their country or region.
              If you are under the legal drinking age where you live, you may
              not use the site. No one is ever required to consume alcohol to
              play; the game works exactly the same with water, soda, or points.
            </p>

            <h2>2. Play responsibly</h2>
            <p>
              The game exists for entertainment among friends. You are always
              responsible for your own decisions, including whether and how much
              you drink. Never pressure anyone to drink, never play in a
              situation where impairment could put anyone at risk, and never
              drink and drive. If you choose to drink, know your limits and
              follow the laws that apply to you. We are not responsible for
              anything that happens at your table.
            </p>

            <h2>3. Free to play, no accounts</h2>
            <p>
              The game is free and requires no account, registration, or
              payment. You choose a display name when you join a party; pick
              something that won&rsquo;t upset your grandmother, or at least
              won&rsquo;t upset the other players. We support the site by
              displaying advertising through Google AdSense, as described in our{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>

            <h2>4. Acceptable use</h2>
            <p>When using the site, you agree not to:</p>
            <ul>
              <li>
                use display names, chat messages, or feedback submissions that
                are hateful, harassing, obscene, or impersonate someone else;
              </li>
              <li>
                attempt to disrupt games, the game server, or other
                players&rsquo; connections, or to access parts of the service
                you are not meant to access;
              </li>
              <li>
                scrape, copy, or republish the site&rsquo;s content or use
                automated tools to interact with the game;
              </li>
              <li>use the site for any unlawful purpose.</li>
            </ul>
            <p>
              We may block access or end a party at our discretion if these
              rules are broken.
            </p>

            <h2>5. Your content</h2>
            <p>
              Chat messages, display names, and emotes you send are shared live
              with the other players in your party and are discarded when the
              party ends. You are responsible for what you send. Feedback you
              submit through the site may be used to improve the game.
            </p>

            <h2>6. Our content</h2>
            <p>
              The site&rsquo;s design, code, artwork, and written guides belong
              to us. You are welcome to link to any page, and to use short
              quotations with attribution. The underlying drinking game
              &ldquo;Irish Poker&rdquo; itself is a folk game that belongs to
              everyone; our particular implementation and writing do not.
            </p>

            <h2>7. No warranties</h2>
            <p>
              The site is provided &ldquo;as is&rdquo; and &ldquo;as
              available.&rdquo; We work hard to keep it fast and online, but we
              make no promises that it will be uninterrupted, error-free, or
              that your connection will survive your Wi-Fi. Parties and their
              state may be lost when the server restarts.
            </p>

            <h2>8. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, we are not liable for any
              indirect, incidental, or consequential damages arising from your
              use of the site. Our total liability for any claim related to the
              site is limited to the amount you paid us to use it, which is
              zero.
            </p>

            <h2>9. Changes</h2>
            <p>
              We may update these terms from time to time. When we do, we will
              revise the &ldquo;Last updated&rdquo; date at the top of this
              page. Continuing to use the site after a change means you accept
              the new terms.
            </p>

            <h2>10. Contact</h2>
            <p>
              Questions about these terms? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use the{" "}
              <Link href="/contact">contact page</Link>.
            </p>

            <BackLink href="/">← Back to the homepage</BackLink>
          </ProseArticle>
        </ProseMain>
        <MarketingFooter />
      </PageShell>
    </>
  );
}
