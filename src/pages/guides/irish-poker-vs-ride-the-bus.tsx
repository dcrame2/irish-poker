import Link from "next/link";
import ArticleLayout, {
  Callout,
  TableScroller,
} from "../../../components/Guides/ArticleLayout";
import { getGuide } from "@lib/guides";

const guide = getGuide("irish-poker-vs-ride-the-bus");

export default function IrishPokerVsRideTheBus() {
  return (
    <ArticleLayout
      guide={guide}
      lead="Ask three people the rules of Irish Poker and one of them will describe Ride the Bus. The two games share the same DNA — the same four questions, even — which is exactly why every party has a five-minute argument about which one you're playing. Here's the clean answer."
    >
      <h2>The short version</h2>
      <p>
        <strong>Irish Poker</strong> is the tight, fast, four-round game: four
        face-down cards per player, four guesses — red or black, higher or
        lower, inside or outside, name the suit — drink when you&rsquo;re
        wrong, give a drink when you&rsquo;re right, done in about ten minutes.
        The full rules are in our{" "}
        <Link href="/how-to-play">how-to-play guide</Link>.
      </p>
      <p>
        <strong>Ride the Bus</strong> uses those same four questions as its{" "}
        <em>opening act</em>, then keeps going: a communal pyramid phase where
        players shed cards onto matching ranks, and a finale where the loser —
        the player left holding the most cards — must &ldquo;ride the
        bus,&rdquo; facing a brutal solo gauntlet of repeated guesses that
        resets every time they miss. A full game runs 20 to 40 minutes, most of
        it spent watching one unlucky soul suffer.
      </p>

      <h2>Side by side</h2>
      <TableScroller>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Irish Poker</th>
              <th>Ride the Bus</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Length</strong>
              </td>
              <td>~10 minutes a hand</td>
              <td>20–40 minutes</td>
            </tr>
            <tr>
              <td>
                <strong>Structure</strong>
              </td>
              <td>Four rounds, everyone plays every round</td>
              <td>Three phases; ends with one player in the spotlight</td>
            </tr>
            <tr>
              <td>
                <strong>Drinking pace</strong>
              </td>
              <td>Even and steady across the table</td>
              <td>Light early, then very concentrated on the bus rider</td>
            </tr>
            <tr>
              <td>
                <strong>Spotlight</strong>
              </td>
              <td>Rotates every single turn</td>
              <td>The finale is one person&rsquo;s ordeal</td>
            </tr>
            <tr>
              <td>
                <strong>Teaching time</strong>
              </td>
              <td>One round — about 60 seconds</td>
              <td>Needs a real explanation of all three phases</td>
            </tr>
            <tr>
              <td>
                <strong>Best group size</strong>
              </td>
              <td>2–10, sweet spot 4–8</td>
              <td>3–8, needs patience</td>
            </tr>
          </tbody>
        </table>
      </TableScroller>

      <h2>Where people get them confused</h2>
      <p>
        The confusion is completely fair: the four questions —{" "}
        <em>red or black, higher or lower, inside or outside, name the suit</em>{" "}
        — appear in both games, in the same order. Regional naming makes it
        worse. In plenty of places the whole of Ride the Bus is just called
        &ldquo;Irish Poker,&rdquo; and in others Irish Poker is called
        &ldquo;Red or Black&rdquo; after its first round. If your table is
        arguing, nobody is wrong — you just learned the games in different
        kitchens. Agree on tonight&rsquo;s rules before the deal and move on.
      </p>
      <Callout>
        <strong>The one-line test:</strong> if the game ended after the fourth
        guess, you were playing Irish Poker. If somebody ended the night
        flipping cards alone while the table chanted, that was Ride the Bus.
      </Callout>

      <h2>Which one should your group play?</h2>
      <h3>Pick Irish Poker when…</h3>
      <ul>
        <li>
          <strong>People are still arriving.</strong> New players can be dealt
          into the next hand in seconds, and nobody joins mid-pyramid.
        </li>
        <li>
          <strong>You want everyone involved constantly.</strong> The spotlight
          moves every turn, so phones stay in pockets.
        </li>
        <li>
          <strong>The night has other plans.</strong> A ten-minute hand is easy
          to fit before dinner, between rounds of another game, or as a
          pre-game before going out.
        </li>
        <li>
          <strong>You want even, moderate drinking.</strong> Drinks spread
          across the whole table instead of piling onto one person — easier to
          keep the night friendly and everyone at sipping pace.
        </li>
      </ul>
      <h3>Pick Ride the Bus when…</h3>
      <ul>
        <li>
          <strong>You have time and a settled group</strong> that wants one
          long, escalating game with a dramatic arc.
        </li>
        <li>
          <strong>Your friends love shared spectacle.</strong> The bus-riding
          finale is genuinely theatrical — if your crew loves cheering on a
          doomed hero, nothing else delivers that.
        </li>
        <li>
          <strong>Everyone already knows it.</strong> Teaching three phases to
          a loud kitchen is its own drinking game.
        </li>
      </ul>

      <h2>The hybrid night</h2>
      <p>
        The best answer is often both. Open with two or three quick hands of
        Irish Poker while people trickle in and learn the four questions —
        which, conveniently, is a perfect tutorial for Ride the Bus. Then, once
        the group is full and warmed up, play one big game of Ride the Bus as
        the main event. The four-question phase will already be second nature,
        so you skip straight to the fun part of the teach.
      </p>
      <p>
        One safety note that applies double to Ride the Bus: because its
        finale concentrates so much drinking on one player, agree in advance
        that a &ldquo;drink&rdquo; is a sip and cap the bus ride at a fixed
        number of laps. No card game is worth anyone&rsquo;s night ending
        early. More on keeping things sane in our{" "}
        <Link href="/guides/drinking-games-without-alcohol">
          alcohol-free guide
        </Link>
        .
      </p>
      <p>
        Want the ten-minute option right now? Irish Poker runs free in your
        browser — <Link href="/play">start a party</Link>, share the four-letter
        code, and the site deals, referees, and counts every drink for you.
      </p>
    </ArticleLayout>
  );
}
