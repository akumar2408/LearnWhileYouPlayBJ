import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { ScreenGradient } from '../theme';
import GlassButton from '../components/GlassButton';

export default function LoginScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');

  return (
    <ScreenGradient>
      <ImageBackground
        source={require('../../assets/login-felt.png')}
        resizeMode="cover"
        style={{ flex:1, opacity: 0.35, position:'absolute', left:0, right:0, top:0, bottom:0 }}
      />
      <View style={{ flex:1, padding:22, justifyContent:'center' }}>
        <Text style={{ color:'#fff', fontSize:32, fontWeight:'900', letterSpacing:0.5, marginBottom:8 }}>
          Learn‑While‑You‑Play
        </Text>
        <Text style={{ color:'#A9B2BF', marginBottom:18 }}>
          Real dealer flow. Smart coaching after each hand.
        </Text>

        <View style={{ gap:12 }}>
          <Text style={{ color:'#D7DCE3' }}>Your name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Aayush"
            placeholderTextColor="#9AA7B4"
            autoCapitalize="words"
            style={{
              color:'white', backgroundColor:'rgba(255,255,255,0.06)',
              padding:14, borderRadius:14, borderWidth:1, borderColor:'rgba(255,255,255,0.08)'
            }}
          />

          <Text style={{ color:'#D7DCE3', marginTop:6 }}>Dealer PIN (optional)</Text>
          <TextInput
            value={pin}
            onChangeText={setPin}
            placeholder="(optional)"
            placeholderTextColor="#9AA7B4"
            keyboardType="number-pad"
            secureTextEntry
            style={{
              color:'white', backgroundColor:'rgba(255,255,255,0.06)',
              padding:14, borderRadius:14, borderWidth:1, borderColor:'rgba(255,255,255,0.08)'
            }}
          />

          <View style={{ height:10 }} />
          <GlassButton title="Enter Table" onPress={() => navigation.replace('Home', { name })} />
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginTop:10 }}>
            <Text style={{ color:'#8BE7D1', textAlign:'center' }}>Settings</Text>
          </TouchableOpacity>

          <View style={{ marginTop:26, opacity:0.85 }}>
            <Text style={{ color:'#8894A7', fontSize:12, textAlign:'center' }}>
              17+ Simulated Gambling · No real money
            </Text>
          </View>
        </View>
      </View>
    </ScreenGradient>
  );
}
