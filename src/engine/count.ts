import { Rank } from '../types';

export function hiLoValue(rank: Rank): number {
  switch (rank) {
    case '2': case '3': case '4': case '5': case '6':
      return 1;
    case '7': case '8': case '9':
      return 0;
    default:
      return -1;
  }
}

export function addToCount(current: number, rank: Rank): number {
  return current + hiLoValue(rank);
}

export function trueCount(runningCount: number, decksRemaining: number): number {
  if (decksRemaining <= 0.25) return runningCount;
  return runningCount / decksRemaining;
}
