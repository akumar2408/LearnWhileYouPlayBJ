import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Colors, styles } from '../theme';

function parseCommand(s: string): 'HIT'|'STAND'|'DOUBLE'|'SPLIT'|'SURRENDER'|null {
  const t = s.toLowerCase();
  if (t.includes('stand') || t.includes('stay')) return 'STAND';
  if (t.includes('double') || t.includes('down')) return 'DOUBLE';
  if (t.includes('split')) return 'SPLIT';
  if (t.includes('surrender') || t.includes('sur')) return 'SURRENDER';
  if (t.includes('hit')) return 'HIT';
  return null;
}

export default function VoiceBar({
  onCommand
}: {
  onCommand: (cmd: 'HIT'|'STAND'|'DOUBLE'|'SPLIT'|'SURRENDER') => void;
}) {
  const [text, setText] = useState('');
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>Quick command (type & apply):</Text>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <TextInput
          placeholder="hit / stand / double / split / surrender"
          placeholderTextColor={Colors.muted}
          value={text}
          onChangeText={setText}
          style={{ flex: 1, color: 'white', backgroundColor: 'rgba(255,255,255,0.06)', padding: 10, borderRadius: 10 }}
        />
        <TouchableOpacity onPress={() => { const cmd = parseCommand(text||''); if (cmd) onCommand(cmd); }} style={[styles.button]}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
