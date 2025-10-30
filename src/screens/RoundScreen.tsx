import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenGradient, styles, Colors, Glass } from '../theme';
import GlassButton from '../components/GlassButton';
import CardPad from '../components/CardPad';
import DecisionBar from '../components/DecisionBar';
import VoiceBar from '../components/VoiceBar';
import { Action, CardEvent, DecisionLog, Rank, ShoeState } from '../types';
import { loadShoe, saveShoe } from '../storage';
import { addToCount, trueCount } from '../engine/count';
import { evaluateDecision, recommendedAction } from '../engine/coach';
import { payoutDelta, Outcome } from '../engine/payouts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

// Visuals / polish
import { Felt, SeatArc } from '../ui/Table';
import Card from '../ui/Card';
import ChipRack from '../ui/ChipRack';
import ActionBar from '../ui/ActionBar';
import FadeIn from '../ui/FadeIn';
import SlideCard from '../ui/SlideCard';
import DragChip from '../ui/DragChip';
import { tap, light, medium, warn } from '../ui/haptics';

type Seat = {
  idx: number;
  cards: Rank[];
  decisions: DecisionLog[];
  bet: number;
  bankroll: number;
  outcome?: Outcome;
  multiplier?: number;
};

export default function RoundScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Round'>) {
  const [shoe, setShoe] = useState<ShoeState | null>(null);
  const [seats, setSeats] = useState<Seat[]>(
    [0, 1, 2].map(i => ({ idx: i, cards: [], decisions: [], bet: 10, bankroll: 500 }))
  );
  const [dealerUp, setDealerUp] = useState<Rank | null>(null);
  const [roundId, setRoundId] = useState(() => `${Date.now()}`);
  const [decksRemaining, setDecksRemaining] = useState('6');

  useEffect(() => {
    loadShoe().then(s => {
      if (s) {
        setShoe(s);
        setDecksRemaining(String(s.decksRemaining || s.rules.decks));
        setSeats(prev => prev.map(seat => ({
          ...seat,
          bet: s.seatBets?.[seat.idx] ?? seat.bet,
          bankroll: s.seatBankrolls?.[seat.idx] ?? seat.bankroll,
        })));
      }
    });
  }, []);

  const runningCount = shoe?.runningCount ?? 0;
  const tc = useMemo(() => {
    const drem = parseFloat(decksRemaining || '1');
    return trueCount(runningCount, drem || 1);
  }, [runningCount, decksRemaining]);

  async function commitCard(seatIndex: number | null, rank: Rank) {
    if (!shoe) return;
    const ev: CardEvent = { ts: Date.now(), seatIndex, rank };
    const rc = addToCount(shoe.runningCount, rank);
    const next = { ...shoe, runningCount: rc, events: [...shoe.events, ev] };
    await saveShoe(next);
    setShoe(next);
    if (seatIndex === null) setDealerUp(rank);
    else setSeats(prev => prev.map(s => (s.idx === seatIndex ? { ...s, cards: [...s.cards, rank] } : s)));
  }

  async function setDecision(seatIndex: number, action: Action) {
    if (!shoe || !dealerUp) return;
    const seat = seats.find(s => s.idx === seatIndex)!;
    const log = evaluateDecision(
      shoe.id, roundId, seatIndex, seat.cards, dealerUp, action, shoe.rules, tc
    );
    const next = {
      ...shoe,
      decisions: [...shoe.decisions, log],
      decksRemaining: parseFloat(decksRemaining || '1'),
    };
    await saveShoe(next);
    setShoe(next);
    setSeats(prev => prev.map(s => (s.idx === seatIndex ? { ...s, decisions: [...s.decisions, log] } : s)));
  }

  async function applyPayout(seatIndex: number) {
    if (!shoe) return;
    const seat = seats.find(s => s.idx === seatIndex)!;
    const outcome = seat.outcome || 'PUSH';
    const mult = seat.multiplier ?? 1;
    const delta = payoutDelta(outcome, seat.bet, mult, shoe.rules.blackjackPayout);
    const newBank = Math.round((seat.bankroll + delta) * 100) / 100;
    const nextSeats = seats.map(s => (s.idx === seatIndex ? { ...s, bankroll: newBank } : s));
    setSeats(nextSeats);
    const nb = nextSeats.map(s => s.bankroll);
    const bts = nextSeats.map(s => s.bet);
    const next = { ...shoe, seatBankrolls: nb, seatBets: bts };
    await saveShoe(next);
    setShoe(next);
  }

  function nextRound() {
    setRoundId(`${Date.now()}`);
    setDealerUp(null);
    setSeats(seats.map(s => ({ ...s, cards: [], outcome: undefined, multiplier: undefined })));
  }

  async function endShoe() {
    if (!shoe) return;
    const next = {
      ...shoe,
      endedAt: Date.now(),
      decksRemaining: parseFloat(decksRemaining || '1'),
      seatBankrolls: seats.map(s => s.bankroll),
      seatBets: seats.map(s => s.bet),
    };
    await saveShoe(next);
    setShoe(next);
    navigation.navigate('ShoeSummary');
  }

  function hintForSeat(seat: Seat): string | null {
    if (!shoe || !dealerUp || (shoe.stealth ?? true)) return null;
    if (seat.cards.length < 2) return null;
    const rec = recommendedAction(seat.cards, dealerUp, shoe.rules, tc);
    return rec.indexApplied ? `${rec.action} (${rec.indexApplied}, TC≈${Math.round(tc)})` : rec.action;
  }

  // ✅ Outcome → haptic mapping (fixes the TS error and keeps strong feedback where it matters)
  const hapticForOutcome: Record<Outcome, () => void> = {
    WIN: tap,
    LOSE: tap,
    PUSH: tap,
    BLACKJACK: medium,
    SURRENDER: warn,
  };

  if (!shoe) {
    return (
      <ScreenGradient>
        <Text style={styles.text}>Loading...</Text>
      </ScreenGradient>
    );
  }

  return (
    <ScreenGradient>
      <Felt>
        <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 120 }}>
          {/* Header / counts */}
          <Glass>
            <Text style={[styles.title, { marginBottom: 6 }]}>Live Round</Text>
            <Text style={styles.text}>
              Running Count: <Text style={{ color: Colors.accentB, fontWeight: '800' }}>{runningCount}</Text>
            </Text>
            <View style={{ height: 6 }} />
            <Text style={styles.text}>Decks Remaining (est)</Text>
            <TextInput
              value={decksRemaining}
              onChangeText={setDecksRemaining}
              keyboardType="decimal-pad"
              style={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.06)',
                padding: 10,
                borderRadius: 10,
                width: 100,
              }}
            />
            <View style={{ height: 6 }} />
            <Text style={styles.text}>
              True Count: <Text style={{ color: Colors.accentA, fontWeight: '800' }}>{tc.toFixed(2)}</Text>
            </Text>
            <Text style={styles.label}>
              Stealth: {(shoe.stealth ?? true) ? 'ON (no mid-hand hints)' : 'OFF (show hints)'}
            </Text>
          </Glass>

          {/* Dealer area */}
          <SeatArc>
            <Text style={[styles.text, { fontWeight: '800', marginBottom: 6 }]}>Dealer</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {dealerUp ? <FadeIn><Card rank={dealerUp as any} width={86} /></FadeIn> : <Card faceDown width={86} />}
              <CardPad onPick={(r) => commitCard(null, r)} title={dealerUp ? `Upcard: ${dealerUp}` : 'Tap dealer upcard'} />
            </View>
          </SeatArc>

          {/* Seats */}
          {seats.map((s) => (
            <SeatArc key={s.idx}>
              <Text style={[styles.text, { fontWeight: '800' }]}>Seat {s.idx + 1}</Text>

              {/* Bankroll + Bet */}
              <View style={{ height: 6 }} />
              <Text style={styles.label}>Bankroll</Text>
              <TextInput
                value={String(s.bankroll)}
                onChangeText={(v) =>
                  setSeats(prev => prev.map(x => (x.idx === s.idx ? { ...x, bankroll: parseFloat(v || '0') } : x)))
                }
                keyboardType="decimal-pad"
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  padding: 10,
                  borderRadius: 10,
                  width: 140,
                }}
              />
              <View style={{ height: 6 }} />
              <Text style={styles.label}>Bet</Text>
              <View
                onLayout={(e) => {
                  const { x, y, width, height } = e.nativeEvent.layout;
                  // @ts-ignore store target rect for DragChip hit test
                  globalThis.__BET_AREA = { absX: x, absY: y, w: width, h: height };
                }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <TextInput
                  value={String(s.bet)}
                  onChangeText={(v) =>
                    setSeats(prev => prev.map(x => (x.idx === s.idx ? { ...x, bet: parseFloat(v || '0') } : x)))
                  }
                  keyboardType="decimal-pad"
                  style={{
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    padding: 10,
                    borderRadius: 10,
                    width: 120,
                  }}
                />
                <ChipRack
                  onAdd={(v) =>
                    setSeats(prev =>
                      prev.map(x => (x.idx === s.idx ? { ...x, bet: Math.min(5000, (x.bet || 0) + v) } : x)),
                    )
                  }
                />
              </View>

              {/* Drag chips row */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                {[1, 5, 25, 100, 500, 1000].map(v => (
                  <DragChip
                    key={v}
                    value={v}
                    onDropIn={() => {
                      tap();
                      setSeats(prev =>
                        prev.map(x => (x.idx === s.idx ? { ...x, bet: Math.min(5000, (x.bet || 0) + v) } : x))
                      );
                    }}
                  />
                ))}
              </View>

              {/* Cards + Actions */}
              <View style={{ height: 8 }} />
              <Text style={styles.label}>Cards</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {s.cards.length === 0 && <Text style={{ color: Colors.muted }}>—</Text>}
                {s.cards.map((c, i) => <SlideCard key={`${s.idx}-${i}`} rank={c as any} />)}
              </View>
              <CardPad onPick={(r) => commitCard(s.idx, r)} title="Tap card dealt to this seat" />
              {!!hintForSeat(s) && (
                <Text style={{ color: Colors.muted, marginTop: 6 }}>Hint: {hintForSeat(s)}</Text>
              )}

              <View style={{ height: 8 }} />
              <Text style={styles.label}>Log a decision (for coaching)</Text>
              <DecisionBar
                onPick={(a) => {
                  if (a === 'DOUBLE') medium(); else tap();
                  setDecision(s.idx, a);
                }}
              />
              <View style={{ height: 8 }} />
              <VoiceBar onCommand={(cmd) => setDecision(s.idx, cmd)} />

              {/* Payouts */}
              <View style={{ height: 12 }} />
              <Text style={[styles.text, { fontWeight: '800' }]}>Resolve Payout</Text>
              <View style={{ height: 6 }} />
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {(['WIN', 'LOSE', 'PUSH', 'BLACKJACK', 'SURRENDER'] as Outcome[]).map(o => (
                  <TouchableOpacity
                    key={o}
                    onPress={() => {
                      hapticForOutcome[o]?.();
                      setSeats(prev => prev.map(x => (x.idx === s.idx ? { ...x, outcome: o } : x)));
                    }}
                    style={[
                      styles.button,
                      { backgroundColor: s.outcome === o ? 'rgba(124,243,255,0.15)' : 'rgba(255,255,255,0.06)' },
                    ]}
                  >
                    <Text style={styles.buttonText}>{o}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ height: 6 }} />
              <Text style={styles.label}>Hand Multiplier (2× if doubled)</Text>
              <TextInput
                value={String(s.multiplier ?? 1)}
                onChangeText={(v) =>
                  setSeats(prev =>
                    prev.map(x => (x.idx === s.idx ? { ...x, multiplier: parseFloat(v || '1') } : x)),
                  )
                }
                keyboardType="decimal-pad"
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  padding: 10,
                  borderRadius: 10,
                  width: 100,
                }}
              />
              <View style={{ height: 6 }} />
              <GlassButton title="Apply Payout" onPress={() => { light(); applyPayout(s.idx); }} />
            </SeatArc>
          ))}

          <Glass>
            <GlassButton title="Next Hand" onPress={() => { tap(); nextRound(); }} />
            <View style={{ height: 8 }} />
            <GlassButton title="Finish Shoe → Summary" onPress={() => { tap(); endShoe(); }} />
          </Glass>
        </ScrollView>
      </Felt>
    </ScreenGradient>
  );
}
