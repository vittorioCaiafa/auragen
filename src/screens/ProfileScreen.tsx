import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/screens/ProfileScreen.styles';
import { useTheme } from '../theme/ThemeContext';

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? require('../theme/themes').darkTheme : require('../theme/themes').lightTheme;
  const user = {
    name: 'John Doe',
    age: 27,
    avatar: require('../../assets/avatar-placeholder.png'),
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.button }]} />

      <View style={styles.avatarContainer}>
        <Image source={user.avatar} style={styles.avatar} />
      </View>

      <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
      <Text style={[styles.age, { color: theme.text }]}>{user.age} years old</Text>

      <View style={styles.buttonsContainer}>
        <Pressable style={[styles.button, { backgroundColor: theme.button }]}>
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.signOut]}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}
