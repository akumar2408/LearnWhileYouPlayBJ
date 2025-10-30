import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenGradient, styles, Colors, Glass } from '../theme';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { DecisionLog } from '../types';

function buildSeatReport(logs: DecisionLog[]) {
  const tot = logs.length || 1;
  const ok = logs.filter(l => l.correct).length;
  const mistakes = logs.filter(l => !l.correct).slice(0, 40).map(m => ({
    hand: m.playerHand,
    up: m.dealerUpcard,
    did: m.actionTaken,
    rec: m.recommended,
    idx: m.indexApplied || null,
    tc: m.tcAtDecision
  }));
  return { accuracy: ok / tot, count: logs.length, mistakes };
}

export default function ShareScreen({
  route
}: any) {
  const { seatIndex, allLogs } = route.params as { seatIndex: number, allLogs: DecisionLog[] };
  const seatLogs = useMemo(() => allLogs.filter(l => l.seatIndex === seatIndex), [allLogs, seatIndex]);
  const report = useMemo(() => buildSeatReport(seatLogs), [seatLogs]);
  const payload = useMemo(() => JSON.stringify({ seatIndex, report }), [seatIndex, report]);

  return (
    <ScreenGradient>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 80 }}>
        <Text style={styles.title}>Share Seat {seatIndex+1} Report</Text>
        <Glass>
          <Text style={styles.label}>Scan this QR to import the report:</Text>
          <View style={{ alignItems: 'center', marginVertical: 12 }}>
            <QRCode value={payload} size={240} />
          </View>
          <TouchableOpacity onPress={async () => { await Clipboard.setStringAsync(payload); }} style={[styles.button]}>
            <Text style={styles.buttonText}>Copy JSON to Clipboard</Text>
          </TouchableOpacity>
          <View style={{ height: 8 }} />
          <Text style={styles.label}>Tip: If the QR is too dense, use “Copy JSON” and share via any messenger.</Text>
        </Glass>
      </ScrollView>
    </ScreenGradient>
  );
}
