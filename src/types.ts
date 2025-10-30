export type Rank =
  | 'A' | 'K' | 'Q' | 'J'
  | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export type Action = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER';

export type HandType = 'HARD' | 'SOFT' | 'PAIR';

export type Rules = {
  decks: number;
  s17: boolean;
  das: boolean;
  surrender: 'LATE' | 'NONE';
  blackjackPayout?: '3:2' | '6:5';
};

export type CardEvent = {
  ts: number;
  seatIndex: number | null; // null = dealer
  rank: Rank;
};

export type DecisionLog = {
  ts: number;
  shoeId: string;
  roundId: string;
  seatIndex: number;
  playerHand: Rank[];
  dealerUpcard: Rank;
  actionTaken: Action;
  recommended: Action;
  tcAtDecision: number;
  indexApplied?: string;
  correct: boolean;
};

export type HeatCell = {
  key: string;
  totalLabel: string;
  dealerUp: Rank;
  correctPct: number;
  samples: number;
};

export type ShoeState = {
  id: string;
  rules: Rules;
  cutDepth: number;
  startedAt: number;
  endedAt?: number;
  runningCount: number;
  decksRemaining: number;
  events: CardEvent[];
  decisions: DecisionLog[];
  stealth?: boolean;
  seatBankrolls?: number[]; // bankroll per seat
  seatBets?: number[];      // default bet per seat
};
