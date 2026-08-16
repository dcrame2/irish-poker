import Link from "next/link";
import ArticleLayout, {
  Callout,
  Example,
} from "../../../components/Guides/ArticleLayout";
import { getGuide } from "@lib/guides";

const guide = getGuide("irish-poker-house-rules");

export default function IrishPokerHouseRules() {
  return (
    <ArticleLayout
      guide={guide}
      lead="The classic four rounds of Irish Poker are basically perfect — which is exactly why every group immediately starts modifying them. These are the twelve house rules we've seen (and inflicted) most often, with honest verdicts on which ones improve the game and which ones merely improve the chaos."
    >
      <p>
        Baseline first: if you don&rsquo;t know the standard game, read the{" "}
        <Link href="/how-to-play">full rules</Link> — everything below is a
        modification of that. And the one meta-rule that outranks all twelve:{" "}
        <strong>agree on tonight&rsquo;s rules before the deal.</strong>{" "}
        Mid-game rules committees have ended more parties than empty fridges.
      </p>

      <h2>Rules that make the game better</h2>

      <h3>1. Double or nothing</h3>
      <p>
        After a correct guess, a player may press their luck and guess again on
        the same round instead of giving a drink. Right twice, give double;
        wrong, take everything yourself. This is the best house rule in
        existence because it converts good luck into drama — the table{" "}
        <em>will</em> chant &ldquo;press, press, press&rdquo; and the player{" "}
        <em>will</em> regret listening. <strong>Verdict: always play it.</strong>
      </p>

      <h3>2. Social ties</h3>
      <p>
        In round two, a tie normally means you drink. Under social ties,
        everyone drinks — the table shares your misfortune. It converts the
        game&rsquo;s cruelest beat (a 6% lightning strike, per{" "}
        <Link href="/guides/irish-poker-odds">the odds guide</Link>) into its
        warmest moment. <strong>Verdict: lovely, keep it.</strong>
      </p>

      <h3>3. Splitting drinks</h3>
      <p>
        A correct guess normally sends one drink to one player. Splitting lets
        you divide it — two sips to two people, or on a doubled reward, spread
        it around like a tiny vindictive Santa. Adds politics without adding
        rules overhead. <strong>Verdict: yes, and it keeps any one player from
        getting buried.</strong>
      </p>

      <h3>4. The reverse gift</h3>
      <p>
        Once per game, a player receiving a drink may say &ldquo;return to
        sender&rdquo; and send it back — but if they&rsquo;re given another
        drink that same round, it&rsquo;s doubled. One-shot defensive magic;
        people save it like a Pokémon master ball and usually waste it anyway.{" "}
        <strong>Verdict: fun, teach it on night two.</strong>
      </p>

      <h3>5. The commentator</h3>
      <p>
        Whoever most recently guessed all four rounds correctly earns the mic:
        they may narrate other players&rsquo; flips in a sports voice until
        someone else runs a perfect hand. Costs nothing, produces legends.{" "}
        <strong>Verdict: free money.</strong>
      </p>

      <h2>Rules that make the game spicier</h2>

      <h3>6. Suit streaks</h3>
      <p>
        If two players in a row nail round four&rsquo;s suit call, the rest of
        the table drinks. At 25% a call it&rsquo;s rare enough to feel like an
        eclipse, which is exactly why the room detonates when it lands.{" "}
        <strong>Verdict: harmless, dramatic, in.</strong>
      </p>

      <h3>7. The confidence call</h3>
      <p>
        Before any guess, a player may announce &ldquo;confident.&rdquo; Their
        stakes double, both directions. Simple, self-balancing, and it gives
        the table a read on who actually absorbed the{" "}
        <Link href="/guides/irish-poker-odds">odds table</Link> versus who just
        likes saying &ldquo;confident.&rdquo;{" "}
        <strong>Verdict: great with points, fine with sips.</strong>
      </p>

      <h3>8. Dealer&rsquo;s tax</h3>
      <p>
        Physical-deck only: the dealer drinks whenever anyone guesses all four
        rounds right, as payment for dealing them such a good hand. A nice
        thank-you mechanic — and a solid argument for{" "}
        <Link href="/play">letting the website deal</Link>, since it can&rsquo;t
        drink. <strong>Verdict: charming at small tables.</strong>
      </p>

      <h2>Rules to approach with caution</h2>

      <h3>9. The cascade</h3>
      <p>
        A wrong guess in round N means you drink N sips — one in round one, up
        to four in round four. It sounds like a gentle difficulty curve; across
        a few hands it&rsquo;s a firehose, because round four misses 75% of the
        time <em>by design</em>.{" "}
        <strong>Verdict: points-mode only</strong> (see the{" "}
        <Link href="/guides/drinking-games-without-alcohol">
          alcohol-free conversions
        </Link>
        ), where it&rsquo;s genuinely excellent.
      </p>

      <h3>10. Blind mode</h3>
      <p>
        All four guesses are locked in <em>before</em> any card flips, then the
        hand is revealed in order. Strips out the round-by-round information
        that makes rounds two and three interesting, but the reveal sequence is
        theatrical. <strong>Verdict: fun exactly once per night, as the
        finale.</strong>
      </p>

      <h3>11. The encyclopedia</h3>
      <p>
        Miss round four and you must also name a fact about the card you got
        (&ldquo;the king of hearts is the only king without a
        mustache&rdquo; — true, look at him). Wrong or stumped, drink again.
        Devolves into increasingly desperate card trivia by hand three.{" "}
        <strong>Verdict: for exactly one kind of friend group. You know if
        it&rsquo;s yours.</strong>
      </p>

      <h3>12. Winner deals</h3>
      <p>
        Whoever had the fewest drinks deals (and sits out) the next hand.
        Punishes winning with boredom — the one thing a party game must never
        do. <strong>Verdict: skip it</strong>, or play online where nobody has
        to deal at all.
      </p>

      <Example>
        <p>
          <em>A proven combination</em> for a weekly table: double or nothing +
          social ties + splitting + suit streaks. Enough politics to fuel
          rivalries, nothing that buries anyone, and every rule explainable in
          one sentence to whoever shows up late.
        </p>
      </Example>

      <h2>Designing your own</h2>
      <p>
        Every rule above passes three tests, and yours should too:{" "}
        <strong>one sentence to explain</strong> (if it needs a diagram,
        it&rsquo;s a different game), <strong>spreads drinks rather than
        stacking them</strong> on one person, and{" "}
        <strong>creates a moment</strong> — a chant, a reveal, a betrayal —
        rather than just arithmetic. And whatever you invent, sips not chugs,
        water in the rotation, and nobody plays who doesn&rsquo;t want to.
      </p>
      <p>
        Got a house rule that beats these twelve? Genuinely,{" "}
        <Link href="/contact">tell us</Link> — the best submissions may end up
        built into the game. Meanwhile, the classic rules are always one{" "}
        <Link href="/play">4-letter code</Link> away.
      </p>
    </ArticleLayout>
  );
}
