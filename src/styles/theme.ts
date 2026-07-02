// Design tokens for the revamped Irish Poker UI.

export const theme = {
  // Greens
  feltDark: "#071a10",
  felt: "#0d3320",
  feltLight: "#155c36",
  rail: "#052012",
  clover: "#4fc878",

  // Golds / neutrals
  gold: "#e9b84c",
  goldSoft: "rgba(233, 184, 76, 0.35)",
  cream: "#f4efe1",
  creamDim: "rgba(244, 239, 225, 0.65)",

  // Semantic
  red: "#e6484d",
  redDark: "#a4272b",
  black: "#171b21",
  danger: "#ff5a5f",
  success: "#4fc878",

  // Surfaces
  panel: "rgba(7, 26, 16, 0.82)",
  panelBorder: "rgba(233, 184, 76, 0.25)",
  glass: "rgba(255, 255, 255, 0.06)",

  fontDisplay: `"Irish Grover", system-ui`,
  fontBody: `"Jost", sans-serif`,

  shadowLg: "0 24px 60px rgba(0, 0, 0, 0.55)",
  shadowMd: "0 10px 30px rgba(0, 0, 0, 0.45)",
} as const;

export const AVATAR_COLORS = [
  "#e9b84c",
  "#4fc878",
  "#5ab0f2",
  "#e6484d",
  "#c084fc",
  "#f97316",
  "#2dd4bf",
  "#f472b6",
  "#a3e635",
  "#94a3b8",
] as const;

export function avatarColor(idx: number) {
  return AVATAR_COLORS[Math.abs(idx) % AVATAR_COLORS.length];
}

export const mq = {
  mobile: "(max-width: 560px)",
  tablet: "(max-width: 900px)",
  short: "(max-height: 700px)",
} as const;
