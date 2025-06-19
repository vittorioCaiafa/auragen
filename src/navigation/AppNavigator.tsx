import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "../screens/AuthScreen";
import PaywallScreen from "../screens/PaywallScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SessionScreen from "../screens/SessionScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Paywall: undefined;
  Home: undefined;
  Profile: undefined;
  Session: undefined;
};

type Props = {
  initialRouteName?: "Paywall" | "Home";
};

export default function AppNavigator({ initialRouteName = "Paywall" }: Props) {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkFirstTime = async () => {
      const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
      setShowOnboarding(!hasSeen);
      setLoading(false);
    };
    checkFirstTime();
  }, []);

  if (loading) return null;

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Session" component={SessionScreen} />
    </Stack.Navigator>
  );
}
