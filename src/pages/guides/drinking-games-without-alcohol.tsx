import Link from "next/link";
import ArticleLayout, {
  Callout,
  Example,
} from "../../../components/Guides/ArticleLayout";
import { getGuide } from "@lib/guides";

const guide = getGuide("drinking-games-without-alcohol");

export default function DrinkingGamesWithoutAlcohol() {
  return (
    <ArticleLayout
      guide={guide}
      lead="Here's a secret the name 'drinking game' hides: almost none of the fun comes from the drinking. It comes from the guessing, the table talk, and watching your best friend confidently call 'inside' on two adjacent cards. Which means every good drinking game works completely dry — if you swap the stakes correctly."
    >
      <h2>Why anyone plays dry (and why it&rsquo;s more people than you think)</h2>
      <p>
        Every table has them: the designated driver, the friend on a dry month,
        the one with an early flight, the pregnant friend, the person who just
        doesn&rsquo;t drink. The worst thing you can do is make them
        &ldquo;play along&rdquo; with nothing at stake — a game where your
        wrong guesses cost nothing isn&rsquo;t a game, it&rsquo;s a slideshow.
        The goal isn&rsquo;t removing the stakes; it&rsquo;s{" "}
        <strong>replacing them with something that still stings a
        little</strong>.
      </p>
      <p>
        The good news: guess-based games like{" "}
        <Link href="/how-to-play">Irish Poker</Link> convert perfectly, because
        the tension lives in the moment before the card flips, not in the cup.
        Nobody&rsquo;s heart rate cares what the forfeit is when they&rsquo;re
        naming the suit of their last card.
      </p>

      <h2>The four best alcohol swaps</h2>

      <h3>1. Points — the competitive swap</h3>
      <p>
        Every &ldquo;drink&rdquo; becomes a point, and{" "}
        <strong>the lowest score wins the night</strong>. This is the cleanest
        conversion because it actually sharpens the game: suddenly the{" "}
        <Link href="/guides/irish-poker-odds">odds</Link> matter, people argue
        about optimal round-three calls, and a leaderboard grudge carries over
        to next week. Give the winner something real — loser buys the pizza,
        winner picks the movie. Playing Irish Poker online helps here: the
        site&rsquo;s drink tally <em>is</em> the scoreboard, tracked
        automatically per game and across the whole night.
      </p>

      <h3>2. Non-alcoholic drinks — the ritual swap</h3>
      <p>
        Keep the sipping, change the liquid: water, soda, juice, alcohol-free
        beer, or a round of ridiculous mocktails. This preserves the physical
        ritual — raising a glass in defeat is half the comedy — and it&rsquo;s
        the best option for mixed tables where some people are drinking and
        some aren&rsquo;t, because everyone follows identical rules with
        different cups. Hydration as a punishment mechanic is also, honestly,
        a wellness hack.
      </p>
      <Callout>
        <strong>Mixed-table rule:</strong> never single out who&rsquo;s
        drinking what. The rules say &ldquo;take a sip&rdquo;; what&rsquo;s in
        anyone&rsquo;s cup is nobody&rsquo;s business. This one norm makes
        every party instantly friendlier to non-drinkers.
      </Callout>

      <h3>3. Dares and forfeits — the chaos swap</h3>
      <p>
        Wrong guess, draw a forfeit: talk in an accent until your next turn,
        text your mom a compliment, let the table pick your profile photo for a
        week, do your best impression of the host. Write 20 on slips before the
        night starts and keep them light — the test for a good forfeit is that
        the <em>victim</em> ends up laughing hardest. This swap makes the game
        louder than alcohol ever did, and it&rsquo;s the right pick for groups
        who play games for the stories.
      </p>

      <h3>4. Snack stakes — the low-effort swap</h3>
      <p>
        A bowl of pretzels, popcorn, or candy in the middle: wrong guess means
        you eat one (or forfeit one from your stash, if you&rsquo;d rather
        hoard). Zero setup, works instantly with kids-table-adjacent family
        games, and the person &ldquo;losing&rdquo; is eating snacks, which is
        its own kind of winning.
      </p>

      <h2>Converting Irish Poker, specifically</h2>
      <Example>
        <p>
          <em>Classic rule:</em> wrong guess → drink. Right guess → give a
          drink.
        </p>
        <p>
          <em>Dry version:</em> wrong guess → +1 point. Right guess → give a
          point to any player. Lowest score after four rounds wins; ties are
          settled by one sudden-death suit call, which is the most dramatic
          rule we&rsquo;ve ever written.
        </p>
      </Example>
      <p>
        The give-a-point rule matters more than it looks: it keeps the social
        warfare — the alliances, the revenge arcs, the round-four targeting —
        fully intact. That&rsquo;s the part of the game people remember, and it
        survives the conversion untouched.
      </p>

      <h2>Hosting a mixed night without making it weird</h2>
      <ul>
        <li>
          <strong>Say the rule once, at the start:</strong> &ldquo;a drink is a
          sip of whatever&rsquo;s in your cup.&rdquo; Done. No follow-up
          questions allowed.
        </li>
        <li>
          <strong>Stock the dry bar like you mean it.</strong> One sad
          two-liter of store-brand cola says &ldquo;we forgot about you.&rdquo;
          Good soda, limes, and a pitcher of something homemade says everyone
          was invited.
        </li>
        <li>
          <strong>Let the non-drinkers be sharks.</strong> A clear head is a
          genuine edge in round three window-reading and round four
          suit-counting. By the end of the night the sober player is usually
          the one handing out penalties, which is exactly as funny as it
          sounds.
        </li>
        <li>
          <strong>Never comment on anyone&rsquo;s choice</strong> — not
          &ldquo;come on, one drink,&rdquo; not &ldquo;good for you!&rdquo;
          Both make it a thing. It&rsquo;s not a thing.
        </li>
      </ul>

      <h2>The proof is one hand away</h2>
      <p>
        Deal one dry hand of Irish Poker and watch what happens on the first
        round-four suit call. The scream is identical. The pointing is
        identical. Nobody remembers what was in the cups —{" "}
        <Link href="/play">start a free party</Link> and see for yourself, no
        alcohol (and no app, and no sign-up) required.
      </p>
    </ArticleLayout>
  );
}
