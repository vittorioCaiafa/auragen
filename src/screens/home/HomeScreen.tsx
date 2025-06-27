import React, { useState } from "react";
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "../../theme/ThemeContext";
import { MainTabParamList } from "../../../AppNavigator";
import styles from "./HomeScreen.styles";
import { Ionicons } from "@expo/vector-icons";

type Props = BottomTabScreenProps<MainTabParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { isDark, theme } = useTheme();
  const [input, setInput] = useState("");

  const handleSend = () => {
    setInput(""); // Placeholder: clear input on send
  };

  return (
    <ImageBackground
      source={require("../../../assets/violet-bg.jpg")}
      style={{ flex: 1, height: "100%", width: "100%" }}
    >
      <LinearGradient
        colors={
          isDark
            ? ["rgba(27,27,27,0.7)", "rgba(44,62,80,0.9)"]
            : ["rgba(232,245,233,0.7)", "rgba(200,230,201,0.9)"]
        }
        style={{ flex: 1, padding: 24 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[
                styles.title,
                { color: theme.text, textAlign: "center", marginBottom: 40 },
              ]}
            >
              Welcome to Your AI Psychologist
            </Text>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={80}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme.inputBackground,
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <TextInput
                  placeholder="Talk to your AI therapist..."
                  placeholderTextColor={theme.text + "99"}
                  value={input}
                  onChangeText={setInput}
                  style={{
                    color: theme.text,
                    fontSize: 16,
                    flex: 1,
                    minWidth: 200,
                  }}
                />
                <TouchableOpacity
                  onPress={handleSend}
                  style={{
                    marginRight: -5,
                    backgroundColor: "purple",
                    borderRadius: 15,
                    padding: 10,
                  }}
                >
                  <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </ImageBackground>
  );
}
