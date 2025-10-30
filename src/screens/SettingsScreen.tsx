import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TextInput } from 'react-native';
import GlassButton from '../components/GlassButton';
import { loadShoe, saveShoe } from '../storage';
import { ScreenGradient } from '../theme';

export default function SettingsScreen({ navigation }: any) {
  const [stealth, setStealth] = useState(true);
  const [seats, setSeats] = useState('3');

  useEffect(() => { loadShoe().then(s => {
    if (!s) return;
    setStealth(s.stealth ?? true);
  }); }, []);

  async function save() {
    const shoe = await loadShoe();
    if (shoe) {
      await saveShoe({ ...shoe, stealth });
    }
    navigation.goBack();
  }

  return (
    <ScreenGradient>
      <View style={{ gap:14 }}>
        <Text style={{ color:'#fff', fontSize:22, fontWeight:'900' }}>Settings</Text>

        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
          <Text style={{ color:'#ccc' }}>Stealth Mode</Text>
          <Switch value={stealth} onValueChange={setStealth} />
        </View>

        <Text style={{ color:'#ccc' }}>Seats (info only for now):</Text>
        <TextInput value={seats} onChangeText={setSeats} keyboardType="number-pad"
          style={{ color:'white', backgroundColor:'rgba(255,255,255,0.06)', padding:10, borderRadius:10, width:100 }} />

        <GlassButton title="Save" onPress={save} />
      </View>
    </ScreenGradient>
  );
}
