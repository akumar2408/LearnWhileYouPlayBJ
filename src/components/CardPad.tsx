import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Rank } from '../types';
import { Colors } from '../theme';

const ranks: Rank[] = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];

export default function CardPad({
  onPick,
  title = 'Tap a card dealt',
}: {
  onPick: (r: Rank) => void;
  title?: string;
}) {
  return (
    <View>
      <Text style={{ color: Colors.muted, marginBottom: 8 }}>{title}</Text>
      <View style={styles.grid}>
        {ranks.map((r) => (
          <TouchableOpacity key={r} style={styles.cell} onPress={() => onPick(r)}>
            <Text style={styles.cellText}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: 64,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 8,
  },
  cellText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  }
});
