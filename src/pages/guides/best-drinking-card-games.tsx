import Link from "next/link";
import ArticleLayout, { Callout } from "../../../components/Guides/ArticleLayout";
import { getGuide } from "@lib/guides";

const guide = getGuide("best-drinking-card-games");

export default function BestDrinkingCardGames() {
  return (
    <ArticleLayout
      guide={guide}
      lead="A standard 52-card deck is the best party accessory ever invented: it costs three dollars, fits in a pocket, and holds at least a dozen great drinking games. These are the seven we actually reach for, ranked by what they're best at — with honest notes on group size, chaos level, and how long the teach takes."
    >
      <p>
        Ground rules for every game on this list: they&rsquo;re for adults of
        legal drinking age, a &ldquo;drink&rdquo; always means a sip, and every
        one of them works with water, soda, or points — see{" "}
        <Link href="/guides/drinking-games-without-alcohol">
          our alcohol-free guide
        </Link>{" "}
        for how. Now, the lineup.
      </p>

      <h2>1. Irish Poker — best all-rounder</h2>
      <p>
        <em>2–10 players · 60-second teach · 10 minutes a hand</em>
      </p>
      <p>
        Four face-down cards each, four guesses — red or black, higher or
        lower, inside or outside, name the suit. Wrong guess, you drink; right
        guess, you hand a drink to anyone at the table. That give-a-drink rule
        is the secret engine: alliances form, betrayals land, and the round-four
        suit call produces the loudest moment in card games. It&rsquo;s the
        fastest teach on this list, works at nearly any group size, and deals
        drinks evenly instead of burying one victim.
      </p>
      <Callout>
        <strong>No deck? No dealer? No problem.</strong> Irish Poker is the one
        game on this list you can play free in your browser —{" "}
        <Link href="/play">start a party</Link>, share a 4-letter code, and the
        site deals, enforces the rules, and tallies every drink. Full rules in
        the <Link href="/how-to-play">complete guide</Link>.
      </Callout>

      <h2>2. Kings (King&rsquo;s Cup) — best for big, rowdy rooms</h2>
      <p>
        <em>4–12 players · 5-minute teach · 30–60 minutes</em>
      </p>
      <p>
        The heavyweight. Cards fan face-down around a center cup and each draw
        triggers a rule — categories, rhymes, &ldquo;never have I ever,&rdquo;
        make-a-rule — with the fourth king filling (and dooming someone to) the
        cup. Kings is less a card game than an operating system for a party:
        the cards just schedule the chaos. Downsides: you need to remember or
        print the rule list, and it runs long. Upsides: it absorbs any number
        of people and produces the night&rsquo;s running jokes.
      </p>

      <h2>3. Ride the Bus — best dramatic arc</h2>
      <p>
        <em>3–8 players · 5-minute teach · 20–40 minutes</em>
      </p>
      <p>
        Opens with the same four questions as Irish Poker, builds through a
        pyramid phase, and ends with the loser &ldquo;riding the bus&rdquo;
        through a solo gauntlet while the table spectates. No game builds
        tension better; no game is crueler to one person. If you can&rsquo;t
        decide between this and Irish Poker, our{" "}
        <Link href="/guides/irish-poker-vs-ride-the-bus">
          head-to-head comparison
        </Link>{" "}
        settles it — or play both, in that order.
      </p>

      <h2>4. Horse Race — best two minutes in card games</h2>
      <p>
        <em>2–12+ players · 30-second teach · 5 minutes a race</em>
      </p>
      <p>
        The four aces line up as horses; players bet drinks on a suit; cards
        flip from the deck and each suit&rsquo;s ace advances on its match.
        Winners give out their bet, losers drink theirs. It&rsquo;s pure
        spectacle — people scream at laminated cardboard like it&rsquo;s the
        Kentucky Derby. Perfect as an opener or a palate cleanser between
        longer games, and spectators can join a race with zero explanation.
      </p>

      <h2>5. Higher or Lower — best minimalist game</h2>
      <p>
        <em>2–8 players · 10-second teach · as long as you like</em>
      </p>
      <p>
        Flip a card, guess whether the next is higher or lower, pass the deck
        on a miss. That&rsquo;s the whole game, and that&rsquo;s the point: it
        needs zero table space, survives any noise level, and works standing
        up. If your group likes it, Irish Poker is its natural upgrade — same
        instinct, four times the structure, and a proper finale.
      </p>

      <h2>6. Screw the Dealer — best for needling one friend</h2>
      <p>
        <em>3–8 players · 1-minute teach · 15–25 minutes</em>
      </p>
      <p>
        One player deals; the others take turns guessing the top card&rsquo;s
        rank, with one hint (&ldquo;higher&rdquo; or &ldquo;lower&rdquo;) after
        the first miss. Wrong guesses drink the distance from the answer; a
        right guess makes the <em>dealer</em> drink and hands them the deck
        watch. The fun is entirely in the table talk — lying about your
        confidence, bullying the dealer, and the slow realization that the deck
        is running out of face cards. Card counters thrive here; so do
        charlatans.
      </p>

      <h2>7. Beer Blow — best absurd finale</h2>
      <p>
        <em>3–10 players · 10-second teach · 5 minutes</em>
      </p>
      <p>
        Balance the deck on an empty bottle. Players take turns blowing cards
        off the top; whoever blows the last card — or topples the whole deck —
        drinks. It is barely a game and completely undefeated at 1 a.m. There
        is no strategy. There is only hubris.
      </p>

      <h2>Building a night out of these</h2>
      <p>
        A great card night has a shape: something instant while people arrive,
        a main event once the room is full, and something silly to land the
        plane. Our default run:{" "}
        <strong>Horse Race → Irish Poker → Kings or Ride the Bus → Beer
        Blow</strong>. Swap freely — but keep the teaches early and the
        no-skill games late, because explaining pyramid rules to a room that
        just finished Kings never goes well.
      </p>
      <p>
        However you line them up: sips not chugs, water in the rotation,
        nobody pressured to drink, and everyone gets home safe. The deck will
        still be there next weekend.
      </p>
    </ArticleLayout>
  );
}
