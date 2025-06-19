// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';  // <-- Import this
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function MainApp() {
  const [initialRoute, setInitialRoute] = useState<'Paywall' | 'Home' | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const checkPayment = async () => {
      const hasPaid = await AsyncStorage.getItem('hasPaid');
      setInitialRoute(hasPaid === 'true' ? 'Home' : 'Paywall');
    };

    checkPayment();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <AppNavigator initialRouteName={initialRoute} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
