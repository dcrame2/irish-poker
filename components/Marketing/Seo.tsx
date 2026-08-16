import Head from "next/head";

/* ---------------------------------------------------------------------------
   One <Head> to rule them all: title, description, canonical, Open Graph,
   Twitter card, icons, and optional JSON-LD. Every marketing/content page
   uses this so no page ships without a canonical or social tags again.
--------------------------------------------------------------------------- */

export const SITE_ORIGIN = "https://irish-poker.com";
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/irish_poker_logo.png`;

interface SeoProps {
  title: string;
  description: string;
  /** Path beginning with "/", e.g. "/guides/irish-poker-odds" */
  path: string;
  ogType?: "website" | "article";
  ogImage?: string;
  /** Zero or more schema.org objects, each rendered as its own script tag */
  jsonLd?: object[];
  children?: React.ReactNode;
}

export default function Seo({
  title,
  description,
  path,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd = [],
  children,
}: SeoProps) {
  const url = `${SITE_ORIGIN}${path === "/" ? "/" : path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta name="theme-color" content="#071a10" />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Irish Poker" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
      {children}
    </Head>
  );
}
