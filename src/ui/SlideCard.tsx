import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Card from './Card';

type Props = { rank?: any; suit?: '♠'|'♥'|'♦'|'♣'; width?: number; fromX?: number; fromY?: number; dur?: number; };
export default function SlideCard({ rank, suit='♠', width=72, fromX=-140, fromY=-200, dur=260 }: Props) {
  const t = useRef(new Animated.ValueXY({ x: fromX, y: fromY })).current;
  const o = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(t, { toValue: { x: 0, y: 0 }, duration: dur, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(o, { toValue: 1, duration: Math.max(160, dur * 0.8), useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={{ transform: [{ translateX: t.x }, { translateY: t.y }], opacity: o }}>
    <Card rank={rank} suit={suit} width={width} />
  </Animated.View>;
}
