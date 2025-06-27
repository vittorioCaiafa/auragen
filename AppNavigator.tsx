import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import AuthScreen from "./src/screens/AuthScreen";
import PaywallScreen from "./src/screens/PaymentScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SessionScreen from "./src/screens/SessionScreen";
import ConversationScreen from "./src/screens/ConversationScreen";
import BottomBar from "./src/components/BottomBar";

export type RootStackParamList = {
  Auth: undefined;
  Paywall: undefined;
  Main: undefined;
  Conversation: { conversationId?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Session: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type Props = {
  initialRouteName?: keyof RootStackParamList;
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props: BottomTabBarProps) => <BottomBar {...props} />}
    >
      <Tab.Screen name="Session" component={SessionScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator({ initialRouteName = "Paywall" }: Props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
}
