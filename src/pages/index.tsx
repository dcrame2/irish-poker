import UserSetup from "../../components/UserSetup/Index";

import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Irish Poker</title>
        <meta
          name="description"
          content="Irish Poker is a solo or multiplayer online drinking game that can be played in-person or across the world."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <UserSetup />
      </main>
    </>
  );
}
