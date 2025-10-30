import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Colors } from '../theme';
import { HeatCell, Rank } from '../types';

const upOrder: Rank[] = ['2','3','4','5','6','7','8','9','10','A'];

export default function Heatmap({
  cells,
  title,
}: {
  cells: HeatCell[];
  title: string;
}) {
  const totals = Array.from(new Set(cells.map(c => c.totalLabel)));
  const rowH = 28;
  const colW = 28;
  const pad = 8;
  const w = pad*2 + colW*upOrder.length;
  const h = pad*2 + rowH*totals.length;

  function colorFor(p: number) {
    const clamp = (x: number) => Math.max(0, Math.min(1, x));
    const r = p < 0.5 ? 255 : Math.round(255 * (1 - (p-0.5)*2));
    const g = p > 0.5 ? 255 : Math.round(255 * (p*2));
    const b = 96;
    return `rgb(${clamp(r)*255},${clamp(g)*255},${b})`;
  }

  return (
    <View style={{ marginVertical: 16 }}>
      <Text style={{ color: Colors.text, fontSize: 18, fontWeight: '800', marginBottom: 8 }}>{title}</Text>
      <Svg width={w} height={h}>
        {totals.map((t, row) => (
          upOrder.map((u, col) => {
            const c = cells.find(x => x.totalLabel === t && x.dealerUp === u);
            const p = c ? c.correctPct : 0;
            const x = pad + col * colW;
            const y = pad + row * rowH;
            return (
              <Rect
                key={`${t}-${u}`}
                x={x}
                y={y}
                width={colW-2}
                height={rowH-2}
                fill={colorFor(p)}
                stroke="rgba(255,255,255,0.1)"
              />
            );
          })
        ))}
      </Svg>
      <View style={{ height: 8 }} />
      <Text style={{ color: Colors.muted }}>
        Columns = dealer upcard (2..10,A). Rows = player total/shape. Color shows % of correct actions.
      </Text>
    </View>
  );
}
