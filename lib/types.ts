// Shared client-side types mirroring the server's serialized room state.

export type Suit = "HEARTS" | "DIAMONDS" | "SPADES" | "CLUBS";

export type MaskedCard =
  | { hidden: true }
  | {
      hidden: false;
      suit: Suit;
      rank: number;
      label: string;
      guess: string | null;
      correct: boolean | null;
    };

export interface PlayerView {
  id: string;
  username: string;
  avatar: number;
  connected: boolean;
  left: boolean;
  drinks: number;
  totalDrinks: number;
  isHost: boolean;
}

export interface LastResult {
  type: "guess" | "skip";
  playerId: string;
  username: string;
  option?: string;
  correct?: boolean | null;
  round: number;
  card: MaskedCard | null;
  drinkers?: { id: string; username: string }[] | null;
}

export interface GameView {
  turnOrder: string[];
  currentPlayerId: string | null;
  round: number;
  turn: number;
  awaiting: "guess" | "drink_pick" | "interlude";
  skipDeadline: number | null;
  pickDeadline: number | null;
  interludeUntil: number | null;
  lastResult: LastResult | null;
  hands: Record<string, MaskedCard[]>;
}

export interface ChatMsg {
  id: string;
  playerId: string;
  username: string;
  text: string;
  at: number;
}

export interface RoomState {
  code: string;
  hostId: string | null;
  phase: "lobby" | "playing" | "results";
  players: PlayerView[];
  game: GameView | null;
  chat: ChatMsg[];
  serverNow: number;
}

export interface GameEvent {
  type: string;
  at: number;
  [key: string]: any;
}

export const ROUND_INFO = [
  {
    title: "Red or Black",
    question: "What color is your first card?",
    options: [
      { key: "red", label: "Red", tone: "red" },
      { key: "black", label: "Black", tone: "black" },
    ],
  },
  {
    title: "Higher or Lower",
    question: "Is your second card higher or lower than your first?",
    options: [
      { key: "higher", label: "Higher", tone: "gold" },
      { key: "lower", label: "Lower", tone: "gold" },
    ],
  },
  {
    title: "Inside or Outside",
    question: "Does your third card fall inside or outside your first two?",
    options: [
      { key: "inside", label: "Inside", tone: "gold" },
      { key: "outside", label: "Outside", tone: "gold" },
    ],
  },
  {
    title: "Name the Suit",
    question: "What suit is your final card?",
    options: [
      { key: "hearts", label: "♥ Hearts", tone: "red" },
      { key: "diamonds", label: "♦ Diamonds", tone: "red" },
      { key: "spades", label: "♠ Spades", tone: "black" },
      { key: "clubs", label: "♣ Clubs", tone: "black" },
    ],
  },
] as const;
