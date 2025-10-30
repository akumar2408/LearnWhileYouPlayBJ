import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ScreenGradient, styles, Colors, Glass } from '../theme';
import GlassButton from '../components/GlassButton';
import { loadShoe } from '../storage';
import { DecisionLog, HeatCell, Rank } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const upOrder: Rank[] = ['2','3','4','5','6','7','8','9','10','A'];

function buildHeat(cells: DecisionLog[]): HeatCell[] {
  const map = new Map<string, { correct: number; total: number; label: string; up: Rank }>();
  for (const d of cells) {
    let label = '';
    const ranks = d.playerHand;
    const hasAce = ranks.includes('A');
    const bothSame = ranks.length === 2 && ranks[0] === ranks[1];
    if (bothSame) label = `${ranks[0]},${ranks[1]}`;
    else if (hasAce) {
      const others = ranks.filter(r => r !== 'A');
      if (others.length === 1) label = `A,${others[0]}`; else label = `A,${others.join('+')}`;
    } else {
      const total = ranks.reduce((a, r) => a + (['K','Q','J','10'].includes(r) ? 10 : (r === 'A' ? 1 : parseInt(r, 10))), 0);
      label = String(total);
    }
    const key = `${label}-${d.dealerUpcard}`;
    const cur = map.get(key) || { correct: 0, total: 0, label, up: d.dealerUpcard };
    cur.total += 1;
    if (d.correct) cur.correct += 1;
    map.set(key, cur);
  }
  const arr: HeatCell[] = [];
  for (const [_k, v] of map) {
    arr.push({
      key: `${v.label}-${v.up}`,
      totalLabel: v.label,
      dealerUp: v.up,
      correctPct: v.total ? v.correct / v.total : 0,
      samples: v.total
    });
  }
  return arr.sort((a,b) => {
    const au = upOrder.indexOf(a.dealerUp);
    const bu = upOrder.indexOf(b.dealerUp);
    if (a.totalLabel === b.totalLabel) return au - bu;
    const an = parseInt(a.totalLabel.replace(/\D/g,'')) || 0;
    const bn = parseInt(b.totalLabel.replace(/\D/g,'')) || 0;
    return an - bn;
  });
}

export default function ShoeSummaryScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'ShoeSummary'>) {
  const [logs, setLogs] = useState<DecisionLog[]>([]);

  useEffect(() => {
    loadShoe().then(s => {
      if (!s) return;
      setLogs(s.decisions);
    });
  }, []);

  const correctPct = useMemo(() => {
    const tot = logs.length || 1;
    const ok = logs.filter(l => l.correct).length;
    return ok / tot;
  }, [logs]);

  const topMistakes = useMemo(() => {
    const map = new Map<string, { key: string; count: number; sample: DecisionLog }>();
    for (const d of logs) {
      if (d.correct) continue;
      const k = `${d.playerHand.join(',')}|${d.dealerUpcard}|${d.recommended}`;
      const cur = map.get(k) || { key: k, count: 0, sample: d };
      cur.count += 1;
      map.set(k, cur);
    }
    return Array.from(map.values()).sort((a,b) => b.count - a.count).slice(0, 6);
  }, [logs]);

  const cells: HeatCell[] = useMemo(() => buildHeat(logs), [logs]);

  return (
    <ScreenGradient>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 100 }}>
        <Text style={styles.title}>Shoe Summary</Text>
        <Glass>
          <Text style={styles.text}>Accuracy this shoe: <Text style={{ color: Colors.good, fontWeight: '800' }}>{(correctPct*100).toFixed(1)}%</Text></Text>
          <Text style={styles.label}>Total decisions logged: {logs.length}</Text>
        </Glass>

        <Glass>
          <Text style={[styles.text, { fontWeight: '800', marginBottom: 6 }]}>Share Reports</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' as any }}>
            <GlassButton title="Seat 1 → QR/JSON" onPress={() => navigation.navigate('Share' as any, { seatIndex: 0, allLogs: logs })} />
            <GlassButton title="Seat 2 → QR/JSON" onPress={() => navigation.navigate('Share' as any, { seatIndex: 1, allLogs: logs })} />
            <GlassButton title="Seat 3 → QR/JSON" onPress={() => navigation.navigate('Share' as any, { seatIndex: 2, allLogs: logs })} />
          </View>
        </Glass>

        <Glass>
          <Text style={[styles.text, { fontWeight: '800', marginBottom: 6 }]}>Top Mistakes</Text>
          {topMistakes.length === 0 && <Text style={styles.label}>Nice! No mistakes logged.</Text>}
          {topMistakes.map((m, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <Text style={styles.text}>
                • You played [{m.sample.actionTaken}] with {m.sample.playerHand.join(', ')} vs {m.sample.dealerUpcard}. Recommended: {m.sample.recommended}{m.sample.indexApplied ? ` (${m.sample.indexApplied})` : ''}.
              </Text>
            </View>
          ))}
        </Glass>

        <Glass>
          <Text style={[styles.text, { fontWeight: '800', marginBottom: 6 }]}>Next</Text>
          <Text style={styles.label}>View detailed heatmaps and per-situation accuracy.</Text>
          <GlassButton title="Open Heatmaps & Insights" onPress={() => navigation.navigate('Analytics')} />
        </Glass>

        <GlassButton title="Back to Home" onPress={() => navigation.navigate('Home')} />
      </ScrollView>
    </ScreenGradient>
  );
}
