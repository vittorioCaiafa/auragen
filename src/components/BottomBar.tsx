import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../AppNavigator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/components/BottomBar.styles";

const BottomBar = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Session")}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          color="#2e7d32"
        />
        <Text style={styles.label}>Session</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="leaf-outline" size={24} color="#2e7d32" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-circle-outline" size={24} color="#2e7d32" />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Paywall")}
      >
        <Ionicons name="card-outline" size={24} color="#2e7d32" />
        <Text style={styles.label}>Paywall</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Auth")}
      >
        <Ionicons name="log-in-outline" size={24} color="#2e7d32" />
        <Text style={styles.label}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;
