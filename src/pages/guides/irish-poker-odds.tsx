import Link from "next/link";
import ArticleLayout, {
  Callout,
  Example,
  TableScroller,
} from "../../../components/Guides/ArticleLayout";
import { getGuide } from "@lib/guides";

const guide = getGuide("irish-poker-odds");

export default function IrishPokerOdds() {
  return (
    <ArticleLayout
      guide={guide}
      lead="Irish Poker feels like pure luck, and mostly it is. But every round has real math underneath it, and the difference between a player who knows the numbers and one who guesses on vibes is about two drinks a game. Here's the actual arithmetic — no probability degree required."
    >
      <p>
        Quick refresher if you need it: in{" "}
        <Link href="/how-to-play">Irish Poker</Link>, every player gets four
        face-down cards and guesses each one before the flip — color, then
        higher/lower, then inside/outside, then the exact suit. All the math
        below assumes a standard 52-card deck, aces high, and that your four
        cards came off a fresh shuffle.
      </p>

      <h2>Round 1: Red or Black — a true coin flip</h2>
      <p>
        There are 26 red cards and 26 black cards, so your first guess is a
        genuine 50/50. There is no strategy on a fresh deck, and anyone at your
        table claiming to &ldquo;run hot on red&rdquo; is announcing that they
        will be fun to take drinks from later.
      </p>
      <Callout>
        <strong>One real edge:</strong> if you&rsquo;re playing with a physical
        deck and the table already has cards showing from earlier hands, count
        the colors you can see and call the <em>other</em> one. Every visible
        red card makes black slightly more likely for you. Online, each party
        deals from a fresh shuffle, so the coin stays fair.
      </Callout>

      <h2>Round 2: Higher or Lower — the round you can actually play well</h2>
      <p>
        This is the most skill-sensitive moment in the game, and the skill is
        embarrassingly simple: <strong>look at your first card</strong>. Your
        second guess is against the 51 cards you haven&rsquo;t seen, and
        remember — matching your first card&rsquo;s rank exactly is a loss. That
        tie chance is 3 in 51, about 6%, and it never goes away.
      </p>
      <TableScroller>
        <table>
          <thead>
            <tr>
              <th>Your first card</th>
              <th>Best call</th>
              <th>Win chance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2 or Ace</td>
              <td>
                <strong>Higher / Lower</strong>
              </td>
              <td>94%</td>
            </tr>
            <tr>
              <td>3 or King</td>
              <td>
                <strong>Higher / Lower</strong>
              </td>
              <td>86%</td>
            </tr>
            <tr>
              <td>4 or Queen</td>
              <td>
                <strong>Higher / Lower</strong>
              </td>
              <td>78%</td>
            </tr>
            <tr>
              <td>5 or Jack</td>
              <td>
                <strong>Higher / Lower</strong>
              </td>
              <td>71%</td>
            </tr>
            <tr>
              <td>6 or 10</td>
              <td>
                <strong>Higher / Lower</strong>
              </td>
              <td>63%</td>
            </tr>
            <tr>
              <td>7 or 9</td>
              <td>
                <strong>Higher / Lower</strong>
              </td>
              <td>55%</td>
            </tr>
            <tr>
              <td>8</td>
              <td>Either — it&rsquo;s dead even</td>
              <td>47%</td>
            </tr>
          </tbody>
        </table>
      </TableScroller>
      <p>
        Two things jump out of that table. First, extreme cards are gifts: off a
        2 or an ace, the obvious call wins about 19 times in 20, and the only
        way to drink is the tie or genuinely cursed luck. Second,{" "}
        <strong>an 8 is the worst card in the game</strong> — both calls win
        less than half the time, because the 6% tie chance is subtracted from
        whichever side you pick. If you flip an 8 in round one, budget a sip
        for round two and make peace with it.
      </p>
      <Example>
        <p>
          The classic table argument: &ldquo;I had a 9, higher was
          obvious!&rdquo; It wasn&rsquo;t. Off a 9, <em>lower</em> wins 55% and
          higher wins only about 39%. Middle cards lie to people who
          don&rsquo;t count.
        </p>
      </Example>

      <h2>Round 3: Inside or Outside — read the window</h2>
      <p>
        Your first two cards now form a window, and your third card either
        lands strictly between them (<strong>inside</strong>) or beyond them (
        <strong>outside</strong>). Landing exactly on either card&rsquo;s rank
        loses no matter what you called — that&rsquo;s a flat 12% tax on this
        round (6 of the 50 unseen cards match one of your two ranks).
      </p>
      <p>
        The whole decision comes down to one number:{" "}
        <strong>how many ranks sit strictly between your two cards.</strong>
      </p>
      <TableScroller>
        <table>
          <thead>
            <tr>
              <th>Ranks between your cards</th>
              <th>Example window</th>
              <th>Inside wins</th>
              <th>Outside wins</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0 (adjacent)</td>
              <td>7 and 8</td>
              <td>0% — impossible</td>
              <td>
                <strong>88%</strong>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>5 and 8</td>
              <td>16%</td>
              <td>
                <strong>72%</strong>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>6 and Jack</td>
              <td>32%</td>
              <td>
                <strong>56%</strong>
              </td>
            </tr>
            <tr>
              <td>6</td>
              <td>4 and Jack</td>
              <td>
                <strong>48%</strong>
              </td>
              <td>40%</td>
            </tr>
            <tr>
              <td>8</td>
              <td>4 and King</td>
              <td>
                <strong>64%</strong>
              </td>
              <td>24%</td>
            </tr>
            <tr>
              <td>11 (the full spread)</td>
              <td>2 and Ace</td>
              <td>
                <strong>88%</strong>
              </td>
              <td>0% — impossible</td>
            </tr>
          </tbody>
        </table>
      </TableScroller>
      <p>
        The break-even point is six ranks between your cards. Fewer than six,
        call outside; six or more, call inside. That&rsquo;s the entire
        strategy, and it&rsquo;s worth memorizing as a shortcut:{" "}
        <strong>
          if your two cards are less than seven apart, go outside.
        </strong>
      </p>
      <p>
        Two beautiful edge cases. Adjacent cards (a 7 and an 8) make inside
        literally impossible — zero cards fit — yet someone at every party
        calls it anyway around midnight. And a <strong>pair</strong> is
        secretly the best round-three hand in the game: with two 9s, every
        card that isn&rsquo;t another 9 counts as outside, so the correct call
        wins 96% of the time.
      </p>

      <h2>Round 4: Name the Suit — 25%, unless you&rsquo;ve been paying attention</h2>
      <p>
        Blind, this is a one-in-four shot, which is exactly why it&rsquo;s the
        finale — hitting it feels like a miracle and earns the biggest
        drink-giving of the night. But it&rsquo;s only truly 25% if you ignore
        the table, and by round four the table is covered in information.
      </p>
      <p>
        Every face-up card is a card your fourth card can&rsquo;t be. In an
        eight-player game, 24 cards are showing by the final round. Say only 3
        of them are clubs: then 10 of the 13 clubs are still hiding among the
        28 unseen cards, and calling clubs wins about{" "}
        <strong>36% of the time instead of 25%</strong>. That&rsquo;s not a
        guarantee — it&rsquo;s a meaningfully loaded die.
      </p>
      <Callout>
        <strong>The counting habit:</strong> you don&rsquo;t need to track
        every rank. Just keep a rough tally of suits as cards flip, and in
        round four call the suit you&rsquo;ve seen least. It&rsquo;s thirty
        seconds of attention for the best edge in the game.
      </Callout>

      <h2>So what does a perfect game look like?</h2>
      <p>
        Play every round optimally — take the obvious higher/lower call, read
        the window correctly, count suits — and the chance of going four for
        four in a single hand is still only around{" "}
        <strong>7 or 8 percent</strong>. Roughly one perfect hand in thirteen.
        That&rsquo;s the charm of Irish Poker: knowing the math makes you
        measurably better and still can&rsquo;t save you, which is why the
        table erupts when someone runs the board.
      </p>
      <p>
        The math also tells you how to lose gracefully: about half your drinks
        are baked into the game no matter how well you play. Sip accordingly,
        keep water in the rotation, and remember the goal is a great night, not
        a low score. When you&rsquo;re ready to test the tables above against a
        live deck, <Link href="/play">start a free party</Link> — the site
        counts every drink so you can audit your own decision-making in the
        morning.
      </p>
    </ArticleLayout>
  );
}
