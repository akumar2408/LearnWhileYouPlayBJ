export type Outcome = 'WIN' | 'LOSE' | 'PUSH' | 'BLACKJACK' | 'SURRENDER';

export function blackjackRatio(p: '3:2' | '6:5' | undefined): number {
  if (p === '6:5') return 1.2;
  return 1.5; // default 3:2
}

export function payoutDelta(
  outcome: Outcome,
  bet: number,
  multiplier: number,
  bjPayout: '3:2' | '6:5' | undefined
): number {
  const stake = bet * Math.max(1, multiplier || 1);
  switch (outcome) {
    case 'WIN': return stake;
    case 'LOSE': return -stake;
    case 'PUSH': return 0;
    case 'BLACKJACK': return bet * blackjackRatio(bjPayout);
    case 'SURRENDER': return -0.5 * bet;
    default: return 0;
  }
}
