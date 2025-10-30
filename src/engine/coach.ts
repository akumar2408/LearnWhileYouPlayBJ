import { Action, DecisionLog, Rank, Rules } from '../types';
import { basicAction } from './basicStrategy';
import { deviationFor } from './indexDeviations';

export function recommendedAction(
  player: Rank[],
  dealerUp: Rank,
  rules: Rules,
  tc: number
): { action: Action; indexApplied?: string } {
  const base = basicAction(player, dealerUp, rules);
  const dev = deviationFor(player, dealerUp, rules, Math.round(tc));
  if (dev) {
    return { action: dev.action, indexApplied: dev.indexApplied };
  }
  return { action: base };
}

export function evaluateDecision(
  shoeId: string,
  roundId: string,
  seatIndex: number,
  player: Rank[],
  dealerUp: Rank,
  actionTaken: Action,
  rules: Rules,
  tc: number
): DecisionLog {
  const rec = recommendedAction(player, dealerUp, rules, tc);
  const correct = actionTaken === rec.action;
  return {
    ts: Date.now(),
    shoeId,
    roundId,
    seatIndex,
    playerHand: player,
    dealerUpcard: dealerUp,
    actionTaken,
    recommended: rec.action,
    tcAtDecision: Math.round(tc),
    indexApplied: rec.indexApplied,
    correct,
  };
}
