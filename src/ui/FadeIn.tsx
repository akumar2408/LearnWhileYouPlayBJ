import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function FadeIn({ children, dur=180 }: any) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: dur, useNativeDriver: true }).start();
  }, []);
  return <Animated.View style={{ opacity: a }}>{children}</Animated.View>;
}
