import Link from "next/link";
import ArticleLayout, {
  Callout,
  Example,
} from "../../../components/Guides/ArticleLayout";
import { getGuide } from "@lib/guides";

const guide = getGuide("virtual-drinking-games");

export default function VirtualDrinkingGames() {
  return (
    <ArticleLayout
      guide={guide}
      lead="The group chat scattered — new cities, new jobs, one guy inexplicably in Lisbon — but game night doesn't have to die with the shared zip code. After a lot of laggy, chaotic, occasionally perfect remote game nights, here's the setup that actually works."
    >
      <h2>Why most virtual game nights flop</h2>
      <p>
        It&rsquo;s never the distance; it&rsquo;s the logistics. Someone has to
        deal &ldquo;on camera,&rdquo; half the table can&rsquo;t see the cards,
        someone&rsquo;s audio lags the big reveal, and the host spends the
        whole night refereeing instead of playing. A remote game lives or dies
        on one question: <strong>does everyone see the same table at the same
        moment?</strong> Get that right and the rest is just friends being
        friends.
      </p>
      <p>That gives you three rules for picking a remote game:</p>
      <ul>
        <li>
          <strong>Shared state:</strong> everyone sees the same cards without a
          camera pointed at a coffee table;
        </li>
        <li>
          <strong>Turn structure:</strong> the game says whose moment it is, so
          people talk over each other <em>between</em> turns, not during;
        </li>
        <li>
          <strong>Instant onboarding:</strong> if joining takes an account, a
          download, and a tutorial, you&rsquo;ve lost two friends before the
          first hand.
        </li>
      </ul>

      <h2>The setup that works</h2>
      <h3>Two screens, one call</h3>
      <p>
        The winning formula is <strong>video call + shared game in the
        browser</strong>. Run the call wherever your group already lives —
        FaceTime, Discord, Zoom, Meet — and put the game itself in a browser
        tab or on everyone&rsquo;s phone. Faces on one screen, table on the
        other. Laptop-for-the-call, phone-for-the-game is the best two-device
        arrangement; on a single device, a split screen with the call pinned
        small works fine.
      </p>
      <Callout>
        <strong>Audio beats video.</strong> If bandwidth gets rough, drop video
        quality before anyone drops audio. Game night survives frozen faces;
        it does not survive missing the scream when the fourth suit call
        lands.
      </Callout>

      <h3>The games that survive the distance</h3>
      <p>
        <strong><Link href="/how-to-play">Irish Poker</Link></strong> might be
        the single best-suited card game for remote play, which is — full
        disclosure — a big part of why this site exists. It checks every box:
        the browser deals with a shared live table so nobody plays dealer, turns
        are strictly one-at-a-time so the call&rsquo;s attention has one focus,
        a hand takes ten minutes so latecomers slot into the next one, and
        joining is a 4-letter code with no account or download.{" "}
        <Link href="/play">Create a party</Link>, paste the invite link in the
        group chat, done.
      </p>
      <p>
        Beyond cards: trivia games where a host reads questions, drawing games
        built for browsers, and &ldquo;everyone watches the same thing and
        follows rules&rdquo; games (drink when the detective says the thing)
        all translate well. What doesn&rsquo;t translate: anything needing a
        physical deck on camera, games where everyone acts at once (King&rsquo;s
        Cup descends into &ldquo;wait, who drew what?&rdquo;), and marathon
        games — remote attention spans run about half as long as in-person
        ones.
      </p>

      <h2>Running the night: a working script</h2>
      <ul>
        <li>
          <strong>Schedule it like it matters.</strong> A calendar invite gets
          attendance; &ldquo;we should play sometime&rdquo; gets a rain check
          forever. Recurring beats one-off — first Friday of the month survives
          busy seasons.
        </li>
        <li>
          <strong>Mind the time zones.</strong> 9 p.m. on the East Coast is 6
          p.m. in California and 2 a.m. in Lisbon. Rotate who suffers.
        </li>
        <li>
          <strong>Start playing within five minutes.</strong> Open the call,
          drop the party link, deal the first hand. Catching up happens{" "}
          <em>between</em> hands automatically — a card game is scaffolding for
          conversation, and it outperforms &ldquo;so, how&rsquo;s work&rdquo;
          every time.
        </li>
        <li>
          <strong>Keep hands short, breaks natural.</strong> Two or three hands,
          then a refill break, then more if the energy&rsquo;s there. End on a
          loud moment, not a fizzle — 60 to 90 minutes is the sweet spot.
        </li>
        <li>
          <strong>Crown a champion.</strong> The site tracks drink standings
          across the whole session; screenshot the final board into the group
          chat. A running rivalry is the best guarantee there&rsquo;s a next
          time.
        </li>
      </ul>

      <Example>
        <p>
          <em>Field report:</em> our record onboarding for a remote hand is
          roughly 45 seconds — link posted in the chat, four people in from
          three cities, first card flipped. The slow part was one player
          finding her reading glasses.
        </p>
      </Example>

      <h2>Drinking rules, remote edition</h2>
      <p>
        Remote drinking needs <em>more</em> care than in-person, not less:
        nobody can see how much anyone&rsquo;s actually had, and nobody&rsquo;s
        walking anybody home. Keep drinks to sips, keep water in frame, and
        check in on the quiet ones — the same host instincts as a real
        kitchen, done through a webcam. Anyone playing dry follows the exact
        same rules with whatever&rsquo;s in their cup; our{" "}
        <Link href="/guides/drinking-games-without-alcohol">
          alcohol-free guide
        </Link>{" "}
        has the full playbook. The upside of remote: everyone&rsquo;s commute
        home is a walk to their own couch.
      </p>

      <h2>The point of all this</h2>
      <p>
        The game was never really the point — it&rsquo;s the excuse. An hour of
        guessing cards with scattered friends produces more actual catching-up
        than a month of &ldquo;we should call sometime.&rdquo; Put a date on
        it, <Link href="/play">grab a party code</Link>, and go find out who
        still can&rsquo;t read a round-three window.
      </p>
    </ArticleLayout>
  );
}
