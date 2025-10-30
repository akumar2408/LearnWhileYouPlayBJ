import React, { PropsWithChildren } from 'react';
import { DefaultTheme, Theme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';

const ThemeColors = {
  bg: '#0B0D17',
  card: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
  text: '#E8ECF1',
  muted: '#9AA5B1',
  accentA: '#6C7CFF',
  accentB: '#7CF3FF',
  accentC: '#A47CFF',
  good: '#45D483',
  bad: '#FF6B6B',
  warn: '#F7B500',
};

const ThemeObj: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: ThemeColors.bg,
    card: ThemeColors.card,
    text: ThemeColors.text,
    border: ThemeColors.border,
    primary: ThemeColors.accentA,
  },
};

export function Glass({ children }: PropsWithChildren) {
  return <View style={styles.glass}>{children}</View>;
}

export function ScreenGradient({ children }: PropsWithChildren) {
  return (
    <LinearGradient
      colors={['#0B0D17', '#0B0D17', '#101327']}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['rgba(108,124,255,0.18)', 'transparent']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.2 }}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={['rgba(124,243,255,0.12)', 'transparent']}
          start={{ x: 0.2, y: 1.0 }}
          end={{ x: 0.8, y: 0.0 }}
          style={{ flex: 1, padding: 16 }}
        >
          {children}
        </LinearGradient>
      </LinearGradient>
    </LinearGradient>
  );
}

export const styles = StyleSheet.create({
  glass: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    padding: 14,
  },
  title: { color: ThemeColors.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: ThemeColors.muted, fontSize: 14 },
  label: { color: ThemeColors.muted, fontSize: 12 },
  text: { color: ThemeColors.text, fontSize: 16 },
  chipText: { color: ThemeColors.text, fontSize: 14, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center' },
  space: { height: 12 },
  bigSpace: { height: 24 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: ThemeColors.text, fontSize: 16, fontWeight: '700' }
});

export const Colors = ThemeColors;
export default ThemeObj;

export function AppThemeProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
