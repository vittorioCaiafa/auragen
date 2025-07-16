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
  ActivityIndicator,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../theme/ThemeContext";
import { MainTabParamList, RootStackParamList } from "../../../AppNavigator";
import styles from "./HomeScreen.styles";
import { Ionicons } from "@expo/vector-icons";
import { ConversationStorage } from "../../services/conversationStorage";
import {
  askAI,
  Message,
  generateConversationTitle,
} from "../../services/openaiService";
import LottieView from "lottie-react-native";
import { startRecording, stopRecording } from "../../services/audio";
import { transcribeAudio, sendToGPT } from "../../api/openai";

type Props = BottomTabScreenProps<MainTabParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { isDark, theme } = useTheme();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const stackNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecord = async () => {
    if (!recording) {
      setRecording(true);
      await startRecording();
    } else {
      setRecording(false);
      setLoading(true);
      const uri = await stopRecording();
      const text = await transcribeAudio(uri);
      setMessage(text);
      const reply = await sendToGPT(text);
      setResponse(reply);
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // Create new conversation
      const newConversation = await ConversationStorage.createNewConversation(
        "New Conversation"
      );

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input.trim(),
        timestamp: new Date(),
      };

      await ConversationStorage.addMessageToConversation(
        newConversation.id,
        userMessage
      );

      // Generate AI response
      const aiResponse = await askAI([userMessage]);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      await ConversationStorage.addMessageToConversation(
        newConversation.id,
        aiMessage
      );

      // Generate title
      const title = await generateConversationTitle(userMessage.content);
      newConversation.title = title;
      await ConversationStorage.saveConversation(newConversation);

      // Navigate to conversation
      stackNavigation.navigate("Conversation", {
        conversationId: newConversation.id,
      });
    } catch (error: any) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/green-bg.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
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
            {/* Lottie animation behind input bar */}
            <View
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                zIndex: 0,
                justifyContent: "center",
                alignItems: "center",
                width: 0,
                height: 0,
              }}
              pointerEvents="none"
            >
              <LottieView
                source={require("../../../assets/animations/waves-around-line.json")}
                autoPlay
                loop
                style={{
                  width: 900,
                  height: 750,
                  opacity: 0.7,
                  position: "absolute",
                  left: 0,
                  top: 0,
                  transform: [
                    { translateX: -450 }, // -0.5 * width
                    { translateY: -325 }, // -0.5 * height
                  ],
                }}
                colorFilters={[{ keypath: "*", color: "#43ea7f" }]}
              />
            </View>
            {/* Foreground content */}
            <View style={{ zIndex: 1 }}>
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
                    marginTop: 100,
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
                    multiline
                  />
                  <View style={{ padding: 20 }}>
                    <Button
                      title={recording ? "Detener y Enviar" : "Grabar Voz"}
                      onPress={handleRecord}
                    />
                    {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
                    {message ? (
                      <Text style={{ marginTop: 20 }}>🗣️ Tú: {message}</Text>
                    ) : null}
                    {response ? (
                      <Text style={{ marginTop: 20 }}>
                        🧠 Psicólogo: {response}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={handleSend}
                    style={{
                      marginRight: -5,
                      backgroundColor: theme.green,
                      borderRadius: 15,
                      padding: 10,
                    }}
                  >
                    <Ionicons name="send" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </ImageBackground>
  );
}
