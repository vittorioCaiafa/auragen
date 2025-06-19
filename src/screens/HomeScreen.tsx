import React from 'react';
import { Text, ImageBackground, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/screens/HomeScreen.styles';
import BottomBar from '../components/BottomBar';
import { useTheme } from '../theme/ThemeContext';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? require('../theme/themes').darkTheme : require('../theme/themes').lightTheme;
  return (
    <ImageBackground
      source={require('../../assets/forest-bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={isDark ? ['rgba(27,27,27,0.7)', 'rgba(44,62,80,0.9)'] : ['rgba(232,245,233,0.7)', 'rgba(200,230,201,0.9)']}
        style={styles.overlay}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Welcome to Your AI Psychologist
        </Text>
      </LinearGradient>

      <BottomBar />
    </ImageBackground>
  );
}
