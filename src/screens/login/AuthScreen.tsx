// src/screens/AuthScreen.tsx
import React from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "../../utils/supabase";
import { GOOGLE_CLIENT_ID } from '@env';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../AppNavigator';
import { styles } from './AuthScreen.styles';
import LottieView from "lottie-react-native";
import { useTheme } from '../../theme/ThemeContext';

export default function AuthScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Auth'>) {
  const { theme, isDark } = useTheme();
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) Alert.alert('Error logging in with Supabase', error.message);
      else navigation.replace('Paywall');
    } catch (error: any) {
      Alert.alert('Google Sign-In Error', error.message);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = appleCredential;

      if (!identityToken) {
        Alert.alert('Apple sign-in failed: No identity token');
        return;
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: identityToken,
      });

      if (error) Alert.alert('Error logging in with Supabase', error.message);
      else navigation.replace('Paywall');
    } catch (error: any) {
      if (error.code !== 'ERR_CANCELED') {
        Alert.alert('Apple Sign-In Error', error.message);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none">
        <LottieView
          source={require("../../../assets/animations/waves.json")}
          autoPlay
          loop
          style={styles.animationTop}
        />
        <LottieView
          source={require("../../../assets/animations/waves.json")}
          autoPlay
          loop
          style={styles.animationBottom}
        />
        {isDark && (
          <View style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(10,10,20,0.85)',
          }} />
        )}
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Welcome to Your AI Psychologist</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>Let us know who you are first</Text>

      <Pressable style={[styles.button, { backgroundColor: theme.inputBackground }]} onPress={handleGoogleSignIn}>
        <Image source={require('../../../assets/google-logo.png')} style={styles.googleLogo} />
        <Text style={[styles.buttonText, { color: theme.text }]}>Continue with Google</Text>
      </Pressable>

      {Platform.OS === "ios" && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={styles.appleButton}
          onPress={handleAppleSignIn}
        />
      )}
    </View>
  );
}

