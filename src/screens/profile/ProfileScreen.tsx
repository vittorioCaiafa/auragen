import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./ProfileScreen.styles";
import { useTheme } from "../../theme/ThemeContext";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const user = {
    name: "John Doe",
    age: 27,
    avatar: require("../../../assets/avatar-placeholder.png"),
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.lighterBackground }]} />

      <View style={[styles.avatarContainer, { backgroundColor: theme.inputBackground }]}>
        <Image source={user.avatar} style={styles.avatar} />
      </View>

      <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
      <Text style={[styles.age, { color: theme.text }]}>
        {user.age} years old
      </Text>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.lighterBackground },
          ]}
        >
          <Ionicons name="list-outline" size={20} color={theme.text} />
          <Text style={[styles.buttonText, { color: theme.text }]}>Preferences</Text>
        </Pressable>
      </View>

      <View style={styles.bottomButtonsContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: theme.lighterBackground }]}
        >
          <Ionicons name="create-outline" size={20} color={theme.text} />
          <Text style={[styles.buttonText, { color: theme.text }]}>Edit Profile</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: theme.lighterBackground }]}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.red} />
          <Text style={[styles.buttonText, { color: theme.red }]}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}
