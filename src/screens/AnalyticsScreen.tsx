import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ScreenGradient, styles, Colors, Glass } from '../theme';
import Heatmap from '../components/Heatmap';
import { DecisionLog, HeatCell, Rank } from '../types';
import { loadShoe } from '../storage';

const upOrder: Rank[] = ['2','3','4','5','6','7','8','9','10','A'];

function partitionHeat(cells: HeatCell[]) {
  const pair = cells.filter(c => c.totalLabel.includes(','));
  const soft = cells.filter(c => c.totalLabel.startsWith('A'));
  const hard = cells.filter(c => !c.totalLabel.includes(',') && !c.totalLabel.startsWith('A'));
  return { hard, soft, pair };
}

export default function AnalyticsScreen() {
  const [logs, setLogs] = useState<DecisionLog[]>([]);

  useEffect(() => {
    loadShoe().then(s => { if (s) setLogs(s.decisions); });
  }, []);

  const heat = useMemo(() => {
    const map = new Map<string, { correct: number; total: number; label: string; up: Rank }>();
    for (const d of logs) {
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
  }, [logs]);

  const { hard, soft, pair } = useMemo(() => partitionHeat(heat), [heat]);

  return (
    <ScreenGradient>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 80 }}>
        <Text style={styles.title}>Insights & Heatmaps</Text>

        <Glass>
          <Text style={[styles.text, { fontWeight: '800', marginBottom: 6 }]}>Hard Totals</Text>
          <Heatmap cells={hard} title="Hard" />
        </Glass>

        <Glass>
          <Text style={[styles.text, { fontWeight: '800', marginBottom: 6 }]}>Soft Hands</Text>
          <Heatmap cells={soft} title="Soft (A+)" />
        </Glass>

        <Glass>
          <Text style={[styles.text, { fontWeight: '800', marginBottom: 6 }]}>Pairs</Text>
          <Heatmap cells={pair} title="Pairs" />
        </Glass>

        <Glass>
          <Text style={[styles.text, { fontWeight: '800', marginBottom: 6 }]}>What this means</Text>
          <Text style={styles.label}>
            Red cells are where your choices often disagreed with optimal play; green cells are dialed in. 
            Focus practice on the reddest squares first.
          </Text>
        </Glass>
      </ScrollView>
    </ScreenGradient>
  );
}
