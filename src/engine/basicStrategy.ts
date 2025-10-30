import { Action, HandType, Rank, Rules } from '../types';

function rankToVal(rank: Rank): number {
  if (rank === 'A') return 11;
  if (['K','Q','J','10'].includes(rank)) return 10;
  return parseInt(rank, 10);
}

export function handType(cards: Rank[]): HandType {
  if (cards.length === 2 && cards[0] === cards[1]) return 'PAIR';
  if (cards.includes('A')) {
    const other = cards.filter(c => c !== 'A');
    const sumOthers = other.reduce((a, r) => a + rankToVal(r), 0);
    if (11 + sumOthers <= 21) return 'SOFT';
  }
  return 'HARD';
}

export function hardTotal(cards: Rank[]): number {
  return cards.reduce((a, r) => a + (r === 'A' ? 1 : rankToVal(r)), 0);
}

export function softTotal(cards: Rank[]): number {
  const others = cards.filter(c => c !== 'A');
  const sum = others.reduce((a, r) => a + (r === 'A' ? 1 : rankToVal(r)), 0);
  return 11 + sum;
}

function upcardVal(rank: Rank): number {
  if (rank === 'A') return 11;
  if (['K','Q','J','10'].includes(rank)) return 10;
  return parseInt(rank, 10);
}

// Basic strategy for 4-8D, S17, DAS, Late Surrender default.
export function basicAction(
  player: Rank[],
  dealerUp: Rank,
  rules: Rules
): Action {
  const type = handType(player);
  const d = upcardVal(dealerUp);

  if (rules.surrender !== 'NONE') {
    const ht = hardTotal(player);
    if (type === 'HARD') {
      if (ht === 16 && (d === 9 || d === 10 || d === 11)) return 'SURRENDER';
      if (ht === 15 && d === 10) return 'SURRENDER';
    }
  }

  if (type === 'PAIR') {
    const r = player[0];
    switch (r) {
      case 'A': return 'SPLIT';
      case 'K': case 'Q': case 'J': case '10': return 'STAND';
      case '9': return (d === 7 || d === 10 || d === 11) ? 'STAND' : 'SPLIT';
      case '8': return 'SPLIT';
      case '7': return (d <= 7) ? 'SPLIT' : 'HIT';
      case '6': return (d <= 6) ? 'SPLIT' : 'HIT';
      case '5':
        return (d >= 2 && d <= 9) ? 'DOUBLE' : 'HIT';
      case '4': return (d === 5 || d === 6) ? 'SPLIT' : 'HIT';
      case '3': case '2': return (d >= 2 && d <= 7) ? 'SPLIT' : 'HIT';
    }
  }

  if (type === 'SOFT') {
    const t = softTotal(player);
    if (t <= 17) {
      if (t === 13 || t === 14) return (d === 5 || d === 6) ? 'DOUBLE' : 'HIT';
      if (t === 15 || t === 16) return (d >= 4 && d <= 6) ? 'DOUBLE' : 'HIT';
      if (t === 17) return (d >= 3 && d <= 6) ? 'DOUBLE' : 'HIT';
    }
    if (t === 18) {
      if (d >= 3 && d <= 6) return 'DOUBLE';
      if (d === 2 || d === 7 || d === 8) return 'STAND';
      return 'HIT';
    }
    if (t >= 19) return 'STAND';
    return 'HIT';
  }

  const ht = hardTotal(player);
  if (ht <= 8) return 'HIT';
  if (ht === 9) return (d >= 3 && d <= 6) ? 'DOUBLE' : 'HIT';
  if (ht === 10) return (d <= 9) ? 'DOUBLE' : 'HIT';
  if (ht === 11) return (d <= 10) ? 'DOUBLE' : 'HIT';
  if (ht === 12) return (d >= 4 && d <= 6) ? 'STAND' : 'HIT';
  if (ht >= 13 && ht <= 16) return (d <= 6) ? 'STAND' : 'HIT';
  return 'STAND';
}
