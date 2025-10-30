import React from 'react';
import { View } from 'react-native';
import Chip from './Chip';

export default function ChipRack({ onAdd }: { onAdd: (v:number)=>void }) {
  const denoms = [1,5,25,100,500,1000];
  return (
    <View style={{ flexDirection:'row', gap:10, justifyContent:'space-between' }}>
      {denoms.map(d => <Chip key={d} value={d} onPress={() => onAdd(d)} />)}
    </View>
  );
}
