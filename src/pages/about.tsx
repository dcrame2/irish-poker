import Link from "next/link";
import { DisplayTitle } from "../../components/ui/shared";
import {
  PageShell,
  MarketingNav,
  MarketingFooter,
  CtaBand,
  Section,
} from "../../components/Marketing/shared";
import { ProseMain, ProseArticle } from "../../components/Marketing/prose";
import Seo from "../../components/Marketing/Seo";

export default function About() {
  return (
    <>
      <Seo
        title="About | Irish Poker"
        description="The story behind irish-poker.com: why one developer rebuilt the classic four-round drinking card game for the browser, and the principles the site runs on."
        path="/about"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Irish Poker",
            url: "https://irish-poker.com/about",
          },
        ]}
      />

      <PageShell>
        <MarketingNav />
        <ProseMain>
          <ProseArticle>
            <DisplayTitle as="h1">About Irish Poker</DisplayTitle>

            <p>
              Irish Poker started the way most good drinking games do: in a
              kitchen, with a deck of cards that was missing the two of
              diamonds. Somebody taught the four rounds — red or black, higher
              or lower, inside or outside, name the suit — and within ten
              minutes the whole room was invested in whether a stranger&rsquo;s
              fourth card was a club.
            </p>
            <p>
              The problem was everything around the game. Someone always had to
              be the dealer instead of playing. Half the table couldn&rsquo;t
              see the cards. Nobody could remember who owed how many drinks, and
              the one friend who moved away could never join. So this site was
              built to fix exactly those things and nothing more: a live, shared
              table in the browser that deals, enforces the rules, tracks every
              drink, and lets anyone join with a four-letter code — from the
              couch next to you or a couch three time zones away.
            </p>

            <h2>Who makes this</h2>
            <p>
              Irish Poker is designed, coded, and maintained by{" "}
              <strong>Dylan Cramer</strong>, a web developer who has spent an
              honestly concerning number of evenings play-testing round-four
              suit calls. It is a one-person labor of love, which is why bug
              reports sent through the{" "}
              <Link href="/contact">contact page</Link> tend to get fixed
              quickly — there is no backlog committee, just a to-do list.
            </p>

            <h2>What the site believes in</h2>
            <ul>
              <li>
                <strong>Free means free.</strong> No account, no sign-up, no
                premium tier, no &ldquo;watch an ad to flip your card.&rdquo;
                The site is supported by a few ordinary display ads on the
                content pages, and that&rsquo;s it.
              </li>
              <li>
                <strong>The game starts in seconds.</strong> Every design
                decision is tested against one scenario: eight people standing
                in a kitchen who want to play <em>right now</em>. If a feature
                slows that down, it doesn&rsquo;t ship.
              </li>
              <li>
                <strong>Drinking is optional; fun is not.</strong> The rules
                never require alcohol. Plenty of tables play with water, soda,
                or points — the tension of naming the suit works exactly the
                same. The <Link href="/guides/drinking-games-without-alcohol">
                alcohol-free guide</Link> exists because those tables deserve
                first-class support.
              </li>
              <li>
                <strong>Look after your table.</strong> The site is for adults
                of legal drinking age, a &ldquo;drink&rdquo; means a sip, and
                nobody should ever be pressured to play or pour. The best game
                nights are the ones everyone remembers.
              </li>
            </ul>

            <h2>What&rsquo;s on the site</h2>
            <p>
              Beyond the <Link href="/play">game itself</Link>, we write real
              guides for people who take their party games seriously: the{" "}
              <Link href="/how-to-play">complete rulebook</Link>, the{" "}
              <Link href="/guides/irish-poker-odds">actual math behind every
              guess</Link>, <Link href="/guides/irish-poker-house-rules">house
              rules worth stealing</Link>, and{" "}
              <Link href="/guides">more in the guides section</Link>. If an
              argument breaks out at your table, chances are one of those pages
              settles it.
            </p>

            <h2>Get in touch</h2>
            <p>
              Found a bug? Have a house rule the world needs? Just nailed four
              perfect calls and need a witness? The{" "}
              <Link href="/contact">contact page</Link> goes straight to a
              human.
            </p>
          </ProseArticle>
        </ProseMain>
        <Section>
          <CtaBand
            title="Enough about us. Deal the cards."
            text="Start a free party, share the code, and find out who at your table actually trusts their gut."
          />
        </Section>
        <MarketingFooter />
      </PageShell>
    </>
  );
}
