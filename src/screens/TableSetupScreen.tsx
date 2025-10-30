import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Glass, ScreenGradient, styles, Colors } from '../theme';
import GlassButton from '../components/GlassButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Rules, ShoeState } from '../types';
import { saveShoe } from '../storage';

export default function TableSetupScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'TableSetup'>) {
  const [decks, setDecks] = useState('6');
  const [s17, setS17] = useState(true);
  const [das, setDAS] = useState(true);
  const [surrender, setSurrender] = useState<'LATE' | 'NONE'>('LATE');
  const [bj, setBJ] = useState<'3:2' | '6:5'>('3:2');

  const stealth = (route.params as any)?.stealth ?? true;

  async function start() {
    const rules: Rules = {
      decks: Math.max(1, parseInt(decks || '6', 10)),
      s17,
      das,
      surrender,
      blackjackPayout: bj,
    };
    const shoe: ShoeState = {
      id: `${Date.now()}`,
      rules,
      cutDepth: 0,
      startedAt: Date.now(),
      runningCount: 0,
      decksRemaining: +decks || 6,
      events: [],
      decisions: [],
      stealth,
      seatBankrolls: [500,500,500],
      seatBets: [10,10,10],
    };
    await saveShoe(shoe);
    navigation.navigate('Round');
  }

  return (
    <ScreenGradient>
      <View style={{ gap: 16 }}>
        <Text style={styles.title}>Table Rules</Text>
        <Glass>
          <View style={{ gap: 12 }}>
            <Text style={styles.text}>Number of decks</Text>
            <TextInput
              value={decks}
              onChangeText={setDecks}
              keyboardType="number-pad"
              style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.06)', padding: 12, borderRadius: 10 }}
              placeholder="6"
              placeholderTextColor={Colors.muted}
            />
            <Text style={styles.text}>Dealer stands on soft 17 (S17): {s17 ? 'Yes' : 'No'}</Text>
            <GlassButton title={s17 ? 'Toggle: S17 ON' : 'Toggle: S17 OFF'} onPress={() => setS17(!s17)} />
            <Text style={styles.text}>Double After Split (DAS): {das ? 'Yes' : 'No'}</Text>
            <GlassButton title={das ? 'Toggle: DAS ON' : 'Toggle: DAS OFF'} onPress={() => setDAS(!das)} />
            <Text style={styles.text}>Surrender: {surrender}</Text>
            <GlassButton title="Toggle Surrender" onPress={() => setSurrender(surrender === 'LATE' ? 'NONE' : 'LATE')} />
            <Text style={styles.text}>Blackjack Payout: {bj}</Text>
            <GlassButton title="Toggle BJ 3:2 / 6:5" onPress={() => setBJ(bj === '3:2' ? '6:5' : '3:2')} />
          </View>
        </Glass>
        <Glass>
          <Text style={styles.text}>Stealth Mode: {stealth ? 'ON' : 'OFF'}</Text>
          <Text style={styles.label}>When OFF, subtle mid-hand hint text appears under each seat.</Text>
        </Glass>
        <GlassButton title="Begin Shoe" onPress={start} />
      </View>
    </ScreenGradient>
  );
}
