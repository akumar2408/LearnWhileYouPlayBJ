import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, G } from 'react-native-svg';

type Suit = '♠'|'♥'|'♦'|'♣';
export type Rank = 'A'|'K'|'Q'|'J'|'10'|'9'|'8'|'7'|'6'|'5'|'4'|'3'|'2';

const suitColor = (s: Suit) => (s === '♥' || s === '♦') ? '#e33' : '#111';

function SuitGlyph({ s }: { s: Suit }) {
  if (s === '♠') return <Path d="M50 12 C20 34,25 60,50 78 C75 60,80 34,50 12 Z M43 82 h14 v8 H43z" />;
  if (s === '♥') return <Path d="M50 86 C38 76,12 60,12 36 C12 20,28 12,40 22 C50 30,50 30,60 22 C72 12,88 20,88 36 C88 60,62 76,50 86 Z" />;
  if (s === '♦') return <Path d="M50 10 L85 50 L50 90 L15 50 Z" />;
  return <Path d="M50 12 C34 12,22 24,22 38 C22 56,50 64,50 86 C50 64,78 56,78 38 C78 24,66 12,50 12 Z" />;
}

export default function Card({
  rank,
  suit='♠',
  width = 72,
  faceDown = false,
}: { rank?: Rank; suit?: Suit; width?: number; faceDown?: boolean }) {
  const aspect = 1.39;
  const w = width;
  const h = Math.round(w * aspect);

  return (
    <View style={{ width: w, height: h }}>
      <Svg width={w} height={h} viewBox="0 0 100 139">
        <Rect x={0.8} y={0.8} width={98.4} height={137.4} rx={8} fill="#FFF" stroke="#DADDE2" strokeWidth={1.6}/>
        {faceDown ? (
          <>
            <Rect x={6} y={6} width={88} height={127} rx={6} fill="#0e6" opacity={0.08}/>
            <Path d="M6 6 h88 v127 h-88 Z" fill="none" stroke="#0a7" strokeDasharray="4 4" opacity={0.25}/>
          </>
        ) : (
          <G fill={suitColor(suit)}>
            <G transform="translate(50,70) scale(0.75) translate(-50,-50)">
              <SuitGlyph s={suit} />
            </G>
          </G>
        )}
      </Svg>
    </View>
  );
}
