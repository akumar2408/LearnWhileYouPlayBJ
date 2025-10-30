import React, { useMemo, useRef } from 'react';
import { PanResponder, Animated } from 'react-native';
import Chip from './Chip';

export default function DragChip({ value, onDropIn }: { value:number; onDropIn:()=>void }) {
  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pos.x, dy: pos.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      const cx = g.moveX, cy = g.moveY;
      // @ts-ignore
      const A = globalThis.__BET_AREA;
      if (A && cx > A.absX && cx < A.absX + A.w && cy > A.absY && cy < A.absY + A.h) onDropIn();
      Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
  }), []);
  return <Animated.View {...pan.panHandlers} style={{ transform: [{ translateX: pos.x }, { translateY: pos.y }] }}>
    <Chip value={value} />
  </Animated.View>;
}
