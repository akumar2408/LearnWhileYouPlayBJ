import React from 'react';
import { Modal, View, Text } from 'react-native';
import GlassButton from '../components/GlassButton';

export default function OnboardModal({ visible, onClose }: { visible:boolean; onClose:()=>void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'center', padding:24 }}>
        <View style={{ backgroundColor:'rgba(255,255,255,0.06)', borderRadius:18, padding:18 }}>
          <Text style={{ color:'#fff', fontSize:20, fontWeight:'800', marginBottom:6 }}>Welcome</Text>
          <Text style={{ color:'#D7DCE3', marginBottom:10 }}>
            Tap cards to log the hand. Hints show after each hand (Stealth ON by default).
          </Text>
          <GlassButton title="Got it" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
