import Link from "next/link";
import ArticleLayout, {
  Callout,
  Example,
} from "../../../components/Guides/ArticleLayout";
import { getGuide } from "@lib/guides";

const guide = getGuide("st-patricks-day-party-games");

export default function StPatricksDayPartyGames() {
  return (
    <ArticleLayout
      guide={guide}
      lead="The best St. Patrick's Day parties aren't the ones packed shoulder-to-shoulder at a bar with a two-hour wait for a green beer. They're the ones in somebody's kitchen, built around a table, a deck of cards, and a plan. Here's the plan."
    >
      <h2>Why games beat standing around</h2>
      <p>
        Every host knows the failure mode: people arrive, cluster with the two
        friends they came with, orbit the snack table, and leave early. A party
        needs a <em>center of gravity</em> — something that mixes groups,
        creates shared moments, and gives latecomers an instant way in. On St.
        Patrick&rsquo;s Day, a card table is that center, and it has a
        seasonal bonus: the holiday&rsquo;s namesake game already exists.{" "}
        <Link href="/how-to-play">Irish Poker</Link> on St. Paddy&rsquo;s is
        thematically obligatory, like carving pumpkins in October.
      </p>

      <h2>The schedule that works</h2>
      <p>
        You don&rsquo;t need an itinerary taped to the wall — just a shape in
        your head:
      </p>
      <ul>
        <li>
          <strong>Arrival hour — something joinable in 10 seconds.</strong>{" "}
          People trickle in on Paddy&rsquo;s Day, so start with games that
          absorb newcomers instantly: a Horse Race (bet on a suit, scream at an
          ace), or open Irish Poker hands where anyone who walks in is dealt
          into the next one. No teaching, no waiting for &ldquo;everyone to get
          here.&rdquo;
        </li>
        <li>
          <strong>Peak hours — the main event.</strong> Once the room is full,
          run Irish Poker properly: everyone at one table (or one{" "}
          <Link href="/play">party code</Link>, if the party has spilled across
          rooms — or includes friends who moved away; the{" "}
          <Link href="/guides/virtual-drinking-games">remote setup guide</Link>{" "}
          covers pulling them in). Ten-minute hands mean nobody&rsquo;s locked
          in; a season-long tally means everybody cares. Crown a champion at
          the end of the night — the site&rsquo;s drink standings make the
          coronation indisputable.
        </li>
        <li>
          <strong>The landing — something silly.</strong> As energy dips,
          finish with a no-skill spectacle: card-blowing off a bottle, a final
          all-in Horse Race, one theatrical blind hand. End on a loud moment
          and people go home telling the story.
        </li>
      </ul>

      <Example>
        <p>
          <em>The championship move:</em> declare a St. Paddy&rsquo;s Cup.
          Every hand of the night counts toward one leaderboard, the winner
          takes home an absurd trophy — a gold-sprayed shamrock, a novelty hat
          that must be worn until next year. Cheap trophy, permanent
          tradition.
        </p>
      </Example>

      <h2>Food and drink that survive a card table</h2>
      <p>
        Menu rule number one: <strong>one-hand food only.</strong> Players hold
        cards, phones, or cups all night, so anything requiring cutlery dies
        untouched. Soda bread cut small, sausage rolls, crisps, boxty bites,
        anything on a toothpick. Save the corned-beef-and-cabbage sit-down for
        the family dinner; a game party grazes.
      </p>
      <p>
        Drink rule number one: <strong>pace is the host&rsquo;s job.</strong>{" "}
        St. Patrick&rsquo;s Day has a reputation problem precisely because
        nobody paces it. Hosting with games actually helps — a &ldquo;drink&rdquo;
        in Irish Poker is a sip, and a structured game meters consumption far
        better than open-ended bar standing. Set the tone explicitly: sips not
        chugs, pitchers of water <em>on</em> the card table (not sadly across
        the room), and food out before the first deal.
      </p>
      <Callout>
        <strong>The non-negotiables:</strong> know how everyone&rsquo;s getting
        home before the night starts, keep zero-proof options as visible as the
        beer — plenty of guests are driving, dry, or pacing, and the{" "}
        <Link href="/guides/drinking-games-without-alcohol">
          points version
        </Link>{" "}
        plays identically — and nobody who says &ldquo;I&rsquo;m good&rdquo;
        hears a second word about it. Sláinte means health; play like you mean
        it.
      </Callout>

      <h2>Actually-good green touches</h2>
      <p>
        Skip the leprechaun-costume aisle. The details that land: green cups
        with a marker for names (functional <em>and</em> festive), one strand
        of green lights over the game table to make it the room&rsquo;s obvious
        center, a playlist that starts trad-adjacent and drifts wherever the
        night goes, and lime, mint, or matcha desserts for the green quota.
        One genuinely great decoration beats forty paper shamrocks — put the
        effort into the table everyone will sit at for three hours.
      </p>

      <h2>A note on the &ldquo;Irish&rdquo; in Irish Poker</h2>
      <p>
        Like a lot of folk drinking games, Irish Poker&rsquo;s actual origins
        are murky — it&rsquo;s played under different names in different
        countries, and nobody can prove where the four questions were first
        asked. What&rsquo;s certain is that it belongs to every kitchen
        it&rsquo;s played in, and on March 17th it gets its annual moment as
        the house game of the holiday. Treat the theme as a celebration, keep
        the leprechaun accents to a minimum, and let the game do the work.
      </p>

      <h2>Your prep checklist</h2>
      <ul>
        <li>Cards or a charged phone per guest — the game runs{" "}
          <Link href="/play">free in any browser</Link>, no app, no sign-up;</li>
        <li>the <Link href="/how-to-play">rules</Link> skimmed once, so you can
          teach round one in a sentence;</li>
        <li>one-hand food, visible water, real zero-proof options;</li>
        <li>a trophy for the Cup, the more ridiculous the better;</li>
        <li>rides home sorted before the first deal.</li>
      </ul>
      <p>
        That&rsquo;s the whole formula: a center of gravity, a shape to the
        night, and a host who paces the room. The hats are optional. The suit
        call in round four is not.
      </p>
    </ArticleLayout>
  );
}
