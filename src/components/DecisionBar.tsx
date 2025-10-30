import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Action } from '../types';
import { Colors } from '../theme';

const items: { key: Action; label: string }[] = [
  { key: 'HIT', label: 'Hit' },
  { key: 'STAND', label: 'Stand' },
  { key: 'DOUBLE', label: 'Double' },
  { key: 'SPLIT', label: 'Split' },
  { key: 'SURRENDER', label: 'Surrender' },
];

export default function DecisionBar({
  onPick,
}: {
  onPick: (a: Action) => void;
}) {
  return (
    <View style={styles.wrap}>
      {items.map((it) => (
        <TouchableOpacity key={it.key} style={styles.btn} onPress={() => onPick(it.key)}>
          <Text style={styles.txt}>{it.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  txt: { color: Colors.text, fontSize: 14, fontWeight: '700' }
});
