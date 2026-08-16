// Central registry for the guides section. The index page, the article
// layout's "keep reading" links, and each article's own metadata all read
// from here so nothing drifts out of sync.

export interface GuideMeta {
  slug: string;
  title: string;
  /** Shorter title used on cards and in "keep reading" links */
  shortTitle: string;
  description: string;
  emoji: string;
  datePublished: string; // ISO date
  dateModified: string; // ISO date
  readMinutes: number;
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "irish-poker-odds",
    title: "Irish Poker Odds: The Real Math Behind Every Guess",
    shortTitle: "The odds guide",
    description:
      "The actual probabilities behind all four rounds of Irish Poker — when higher is a 92% lock, when inside is impossible, and how card counting turns round four from a 25% prayer into an edge.",
    emoji: "🎲",
    datePublished: "2026-08-16",
    dateModified: "2026-08-16",
    readMinutes: 7,
  },
  {
    slug: "irish-poker-vs-ride-the-bus",
    title: "Irish Poker vs. Ride the Bus: What's the Difference?",
    shortTitle: "Irish Poker vs. Ride the Bus",
    description:
      "The two games share the same four questions, so people mix them up constantly. Here's exactly where they differ, which one fits your group, and how to play a hybrid night of both.",
    emoji: "🚌",
    datePublished: "2026-08-16",
    dateModified: "2026-08-16",
    readMinutes: 6,
  },
  {
    slug: "best-drinking-card-games",
    title: "The 7 Best Drinking Card Games You Can Play With One Deck",
    shortTitle: "Best drinking card games",
    description:
      "Kings, Irish Poker, Ride the Bus, Horse Race and more — ranked by how fast they start, how loud they get, and how easy they are to teach a full kitchen of people.",
    emoji: "🃏",
    datePublished: "2026-08-16",
    dateModified: "2026-08-16",
    readMinutes: 8,
  },
  {
    slug: "drinking-games-without-alcohol",
    title: "How to Play Drinking Games Without Alcohol",
    shortTitle: "Alcohol-free game night",
    description:
      "Sober players, dry January, designated drivers, or just a Tuesday: how to run Irish Poker and other party games with water, points, or dares — without losing any of the fun.",
    emoji: "🥤",
    datePublished: "2026-08-16",
    dateModified: "2026-08-16",
    readMinutes: 6,
  },
  {
    slug: "virtual-drinking-games",
    title: "Virtual Game Night: Drinking Games for Long-Distance Friends",
    shortTitle: "Long-distance game night",
    description:
      "A practical setup guide for playing card games with friends in other cities: the video call setup that actually works, games built for remote play, and how to keep the energy up through a screen.",
    emoji: "🌍",
    datePublished: "2026-08-16",
    dateModified: "2026-08-16",
    readMinutes: 7,
  },
  {
    slug: "irish-poker-house-rules",
    title: "12 Irish Poker House Rules Worth Stealing",
    shortTitle: "House rules worth stealing",
    description:
      "Twelve field-tested variations — from double-or-nothing to the dreaded cascade — with honest notes on which ones make the game better and which ones end parties early.",
    emoji: "🏠",
    datePublished: "2026-08-16",
    dateModified: "2026-08-16",
    readMinutes: 7,
  },
  {
    slug: "st-patricks-day-party-games",
    title: "How to Host a St. Patrick's Day Game Night",
    shortTitle: "St. Patrick's Day game night",
    description:
      "A start-to-finish plan for a St. Paddy's party built around games instead of standing around: the schedule, the game lineup, food that survives a card table, and keeping everyone safe.",
    emoji: "☘️",
    datePublished: "2026-08-16",
    dateModified: "2026-08-16",
    readMinutes: 6,
  },
];

export function getGuide(slug: string): GuideMeta {
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) throw new Error(`Unknown guide slug: ${slug}`);
  return guide;
}
