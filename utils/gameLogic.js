// Core Irish Poker game logic — used by the authoritative server.
// A card is { suit: "HEARTS"|"DIAMONDS"|"SPADES"|"CLUBS", rank: 2..14 }
// Rank 11=J, 12=Q, 13=K, 14=A (ace high).

const SUITS = ["HEARTS", "DIAMONDS", "SPADES", "CLUBS"];

const RANK_LABELS = {
  2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10",
  11: "JACK", 12: "QUEEN", 13: "KING", 14: "ACE",
};

function buildDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

// Fisher-Yates shuffle
function shuffle(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

// Deal 4 cards to each player id, in seat order.
// Returns { [playerId]: [card, card, card, card] }
function dealHands(playerIds) {
  const deck = shuffle(buildDeck());
  const hands = {};
  playerIds.forEach((id, i) => {
    hands[id] = deck.slice(i * 4, i * 4 + 4).map((card) => ({
      ...card,
      revealed: false,
      guess: null, // the option the player chose ("red", "higher", ...)
      correct: null, // true | false | null (null = skipped, no guess)
    }));
  });
  return hands;
}

const ROUND_OPTIONS = [
  ["red", "black"],
  ["higher", "lower"],
  ["inside", "outside"],
  ["hearts", "diamonds", "spades", "clubs"],
];

function isRed(suit) {
  return suit === "HEARTS" || suit === "DIAMONDS";
}

// Evaluate a guess for a player's hand at a given round (0-3).
// hand[round] is the card being guessed.
function evaluateGuess(hand, round, option) {
  const card = hand[round];
  const first = hand[0];
  const second = hand[1];

  switch (option) {
    case "red":
      return isRed(card.suit);
    case "black":
      return !isRed(card.suit);
    case "higher":
      return card.rank > first.rank;
    case "lower":
      return card.rank < first.rank;
    case "inside": {
      const lo = Math.min(first.rank, second.rank);
      const hi = Math.max(first.rank, second.rank);
      return card.rank > lo && card.rank < hi;
    }
    case "outside": {
      const lo = Math.min(first.rank, second.rank);
      const hi = Math.max(first.rank, second.rank);
      return card.rank < lo || card.rank > hi;
    }
    case "hearts":
      return card.suit === "HEARTS";
    case "diamonds":
      return card.suit === "DIAMONDS";
    case "spades":
      return card.suit === "SPADES";
    case "clubs":
      return card.suit === "CLUBS";
    default:
      return false;
  }
}

function isValidOption(round, option) {
  return ROUND_OPTIONS[round]?.includes(option) ?? false;
}

function rankLabel(rank) {
  return RANK_LABELS[rank] || String(rank);
}

module.exports = {
  SUITS,
  ROUND_OPTIONS,
  buildDeck,
  shuffle,
  dealHands,
  evaluateGuess,
  isValidOption,
  rankLabel,
};
