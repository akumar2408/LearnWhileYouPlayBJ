import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoeState } from './types';

const KEY = 'LWYPBJ__CURRENT_SHOE';

export async function saveShoe(shoe: ShoeState) {
  await AsyncStorage.setItem(KEY, JSON.stringify(shoe));
}

export async function loadShoe(): Promise<ShoeState | null> {
  const s = await AsyncStorage.getItem(KEY);
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
}

export async function clearShoe() {
  await AsyncStorage.removeItem(KEY);
}
