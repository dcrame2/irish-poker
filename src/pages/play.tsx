import Head from "next/head";
import dynamic from "next/dynamic";

// The game is fully client-side (it talks to the socket server and reads
// localStorage for the persistent player id), so skip SSR for the app shell.
const App = dynamic(() => import("../../components/App/Index"), {
  ssr: false,
});

export default function Play() {
  return (
    <>
      <Head>
        <title>Play Irish Poker Online | Free Multiplayer Drinking Game</title>
        <meta
          name="description"
          content="Start an Irish Poker party in seconds: create a room, share the 4-letter code, and play the classic drinking card game live with 2-10 friends."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#071a10" />
        <link rel="canonical" href="https://irish-poker.com/play" />
        <link rel="icon" href="favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main>
        <App />
      </main>
    </>
  );
}
