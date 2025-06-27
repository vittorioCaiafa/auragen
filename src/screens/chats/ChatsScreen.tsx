import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  Dimensions,
} from "react-native";
import { styles } from "./ChatsScreen.styles";
import { lightTheme, darkTheme } from "../../theme/themes";
import { ConversationStorage } from "../../services/conversationStorage";
import { Conversation } from "../../services/openaiService";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SessionScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const all = await ConversationStorage.getAllConversations();
      setConversations(all);
    };
    fetchConversations();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {conversations.length === 0 && (
          <Text style={{ color: theme.text, textAlign: 'center', marginTop: 40 }}>
            No conversations yet.
          </Text>
        )}
        {conversations.map((conv) => {
          const lastMsg = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
          return (
            <View
              key={conv.id}
              style={{
                width: SCREEN_WIDTH - 32,
                backgroundColor: theme.card,
                borderRadius: 18,
                padding: 18,
                marginBottom: 20,
                alignSelf: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>
                {conv.title}
              </Text>
              <Text style={{ color: theme.text, fontSize: 15, opacity: 0.8 }} numberOfLines={2}>
                {lastMsg ? lastMsg.content : 'No messages yet.'}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
