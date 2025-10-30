import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { ScreenGradient, Glass, styles, Colors } from '../theme';
import GlassButton from '../components/GlassButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { clearShoe, loadShoe } from '../storage';

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const [stealth, setStealth] = useState(true);
  const [resume, setResume] = useState(false);

  useEffect(() => {
    loadShoe().then(s => setResume(!!s && !s.endedAt));
  }, []);

  return (
    <ScreenGradient>
      <View style={{ gap: 16 }}>
        <Text style={[styles.title, { textAlign: 'center' }]}>
          Learn-While-You-Play Blackjack
        </Text>
        <Text style={[styles.subtitle, { textAlign: 'center' }]}>
          Real dealer. Quiet coaching. Big insights after the shoe.
        </Text>

        <Glass>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={[styles.text, { fontWeight: '800' }]}>Stealth Coach</Text>
              <Text style={styles.label}>Hide advice during hands; rate after.</Text>
            </View>
            <Switch value={stealth} onValueChange={setStealth} trackColor={{true: Colors.accentB}} />
          </View>
        </Glass>

        <GlassButton title="Start New Shoe" onPress={() => navigation.navigate('TableSetup', { stealth })} />
        {resume && (
          <GlassButton title="Resume Current Shoe" onPress={() => navigation.navigate('Round')} />
        )}
        <TouchableOpacity onPress={async () => { await clearShoe(); setResume(false); }}>
          <Text style={{ color: Colors.muted, textAlign: 'center', marginTop: 8 }}>Clear saved shoe</Text>
        </TouchableOpacity>
      </View>
    </ScreenGradient>
  );
}
