import * as Haptics from 'expo-haptics';
export const tap = () => Haptics.selectionAsync().catch(()=>{});
export const light = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(()=>{});
export const medium = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(()=>{});
export const warn = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(()=>{});
