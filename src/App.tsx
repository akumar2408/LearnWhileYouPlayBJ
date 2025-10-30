import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import TableSetupScreen from './screens/TableSetupScreen';
import RoundScreen from './screens/RoundScreen';
import ShoeSummaryScreen from './screens/ShoeSummaryScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import ShareScreen from './screens/ShareScreen';
import Theme, { AppThemeProvider } from './theme';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TableSetup: undefined;
  Round: undefined;
  ShoeSummary: undefined;
  Analytics: undefined;
  Share: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AppThemeProvider>
      <NavigationContainer theme={Theme}>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#0B0D17' },
            headerTintColor: '#E8ECF1',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#0B0D17' },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Learn-While-You-Play' }} />
          <Stack.Screen name="TableSetup" component={TableSetupScreen} options={{ title: 'Table Setup' }} />
          <Stack.Screen name="Round" component={RoundScreen} options={{ title: 'Live Round' }} />
          <Stack.Screen name="ShoeSummary" component={ShoeSummaryScreen} options={{ title: 'Shoe Summary' }} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Insights & Heatmaps' }} />
          <Stack.Screen name="Share" component={ShareScreen} options={{ title: 'Share Seat Report' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppThemeProvider>
  );
}
