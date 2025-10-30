import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';

export function Felt({ children }: PropsWithChildren) {
  return (
    <View style={{ flex: 1 }}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="felt" cx="50%" cy="35%" r="70%">
            <Stop offset="0%" stopColor="#0A5F3E" />
            <Stop offset="100%" stopColor="#053F2A" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#felt)" />
      </Svg>
      <View style={{ position:'absolute', inset: 0, padding: 14 }}>{children}</View>
    </View>
  );
}

export function SeatArc({ children }: PropsWithChildren) {
  return (
    <View style={{
      marginTop: 8,
      borderRadius: 14,
      padding: 10,
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)'
    }}>
      {children}
    </View>
  );
}
