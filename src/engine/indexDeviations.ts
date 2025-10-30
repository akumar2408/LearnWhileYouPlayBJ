import { Action, Rank, Rules } from '../types';

export type IndexDeviation = {
  key: string;
  match: (player: Rank[], dealerUp: Rank, rules: Rules) => boolean;
  threshold: number;
  direction: 'above' | 'below';
  action: Action;
};

function upVal(r: Rank) {
  if (r === 'A') return 11;
  if (['K','Q','J','10'].includes(r)) return 10;
  return parseInt(r, 10);
}

function isPair(player: Rank[], rank: Rank) {
  return player.length === 2 && player[0] === rank && player[1] === rank;
}

function hardTotal(cards: Rank[]): number {
  return cards.reduce((a, r) => a + (r === 'A' ? 1 : (['K','Q','J','10'].includes(r) ? 10 : parseInt(r, 10))), 0);
}

function softTotal(cards: Rank[]): number {
  if (!cards.includes('A')) return 0;
  const others = cards.filter(c => c !== 'A');
  const sum = others.reduce((a, r) => a + (['K','Q','J','10'].includes(r) ? 10 : (r === 'A' ? 1 : parseInt(r, 10))), 0);
  const total = 11 + sum;
  return total <= 21 ? total : 0;
}

export const deviations: IndexDeviation[] = [
  { key: 'Insurance @ TC>=3', match: (_p, up, _r) => up === 'A', threshold: 3, direction: 'above', action: 'STAND' },
  { key: '16 vs 10 — Stand @ TC>=0', match: (p, up, _r) => hardTotal(p) === 16 && upVal(up) === 10 && softTotal(p) === 0, threshold: 0, direction: 'above', action: 'STAND' },
  { key: '15 vs 10 — Stand @ TC>=4', match: (p, up, _r) => hardTotal(p) === 15 && upVal(up) === 10 && softTotal(p) === 0, threshold: 4, direction: 'above', action: 'STAND' },
  { key: '10 vs 10 — Double @ TC>=4', match: (p, up, _r) => hardTotal(p) === 10 && upVal(up) === 10 && softTotal(p) === 0, threshold: 4, direction: 'above', action: 'DOUBLE' },
  { key: '12 vs 3 — Stand @ TC>=2', match: (p, up, _r) => hardTotal(p) === 12 && upVal(up) === 3 && softTotal(p) === 0, threshold: 2, direction: 'above', action: 'STAND' },
  { key: '12 vs 2 — Stand @ TC>=3', match: (p, up, _r) => hardTotal(p) === 12 && upVal(up) === 2 && softTotal(p) === 0, threshold: 3, direction: 'above', action: 'STAND' },
  { key: '11 vs A — Double @ TC>=1', match: (p, up, r) => hardTotal(p) === 11 && up === 'A' && r.s17, threshold: 1, direction: 'above', action: 'DOUBLE' },
  { key: '9 vs 2 — Double @ TC>=1', match: (p, up, _r) => hardTotal(p) === 9 && upVal(up) === 2 && softTotal(p) === 0, threshold: 1, direction: 'above', action: 'DOUBLE' },
  { key: '10 vs A — Double @ TC>=4', match: (p, up, _r) => hardTotal(p) === 10 && up === 'A' && softTotal(p) === 0, threshold: 4, direction: 'above', action: 'DOUBLE' },
  { key: '9 vs 7 — Double @ TC>=3', match: (p, up, _r) => hardTotal(p) === 9 && upVal(up) === 7 && softTotal(p) === 0, threshold: 3, direction: 'above', action: 'DOUBLE' },
  { key: '16 vs 9 — Stand @ TC>=5', match: (p, up, _r) => hardTotal(p) === 16 && upVal(up) === 9 && softTotal(p) === 0, threshold: 5, direction: 'above', action: 'STAND' },
  { key: '13 vs 2 — Stand @ TC>=-1', match: (p, up, _r) => hardTotal(p) === 13 && upVal(up) === 2 && softTotal(p) === 0, threshold: -1, direction: 'above', action: 'STAND' },
  { key: '13 vs 3 — Stand @ TC>=-2', match: (p, up, _r) => hardTotal(p) === 13 && upVal(up) === 3 && softTotal(p) === 0, threshold: -2, direction: 'above', action: 'STAND' },
  { key: '12 vs 4 — Hit @ TC<0', match: (p, up, _r) => hardTotal(p) === 12 && upVal(up) === 4 && softTotal(p) === 0, threshold: 0, direction: 'below', action: 'HIT' },
  { key: '12 vs 5 — Hit @ TC<-2', match: (p, up, _r) => hardTotal(p) === 12 && upVal(up) === 5 && softTotal(p) === 0, threshold: -2, direction: 'below', action: 'HIT' },
  { key: '12 vs 6 — Hit @ TC<-1', match: (p, up, _r) => hardTotal(p) === 12 && upVal(up) === 6 && softTotal(p) === 0, threshold: -1, direction: 'below', action: 'HIT' },
  { key: '15 vs 9 — Stand @ TC>=2', match: (p, up, _r) => hardTotal(p) === 15 && upVal(up) === 9 && softTotal(p) === 0, threshold: 2, direction: 'above', action: 'STAND' },
  { key: 'A,8 vs 6 — Double @ TC>=1', match: (p, up, _r) => softTotal(p) === 19 && upVal(up) === 6, threshold: 1, direction: 'above', action: 'DOUBLE' },
];

export function deviationFor(
  player: Rank[],
  dealerUp: Rank,
  rules: Rules,
  tc: number
): { action: Action, indexApplied: string } | null {
  for (const d of deviations) {
    if (d.match(player, dealerUp, rules)) {
      const cond = d.direction === 'above' ? (tc >= d.threshold) : (tc < d.threshold);
      if (cond) return { action: d.action, indexApplied: d.key };
    }
  }
  return null;
}
