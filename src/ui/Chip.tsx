import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const colors: Record<number,string> = {
  1:'#EEE', 5:'#e33', 25:'#1aa74a', 100:'#2e3df0', 500:'#8126d9', 1000:'#f2b01e'
};

export default function Chip({ value, onPress }: { value: number; onPress?: () => void }) {
  const c = colors[value] ?? '#888';
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ alignItems:'center' }}>
      <Svg width={48} height={48} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={48} fill={c} />
        <Circle cx={50} cy={50} r={36} fill="rgba(0,0,0,0.12)" />
        <Circle cx={50} cy={50} r={30} fill="#fff" />
      </Svg>
      <Text style={{ color:'#111', fontWeight:'800', position:'absolute', top:14 }}>{value}</Text>
    </TouchableOpacity>
  );
}
