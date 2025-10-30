import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const Btn = ({ title, onPress }: {title:string; onPress:()=>void}) => (
  <TouchableOpacity onPress={onPress} style={{
    flex:1, padding:16, borderRadius:14,
    backgroundColor:'rgba(255,255,255,0.08)', alignItems:'center'
  }}>
    <Text style={{ color:'white', fontWeight:'800', fontSize:16 }}>{title}</Text>
  </TouchableOpacity>
);

export default function ActionBar({ onHit, onStand, onDouble, onSplit, onSurrender }:{
  onHit:()=>void; onStand:()=>void; onDouble:()=>void; onSplit:()=>void; onSurrender:()=>void;
}) {
  return (
    <View style={{ gap:10 }}>
      <View style={{ flexDirection:'row', gap:10 }}>
        <Btn title="HIT" onPress={onHit} />
        <Btn title="STAND" onPress={onStand} />
      </View>
      <View style={{ flexDirection:'row', gap:10 }}>
        <Btn title="DOUBLE" onPress={onDouble} />
        <Btn title="SPLIT" onPress={onSplit} />
        <Btn title="SURRENDER" onPress={onSurrender} />
      </View>
    </View>
  );
}
