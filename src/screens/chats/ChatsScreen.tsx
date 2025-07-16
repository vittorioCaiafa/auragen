import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { styles } from "./ChatsScreen.styles";
import { lightTheme, darkTheme } from "../../theme/themes";
import { ConversationStorage } from "../../services/conversationStorage";
import { Conversation } from "../../services/openaiService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../AppNavigator";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ChatsScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchConversations = async () => {
      const all = await ConversationStorage.getAllConversations();
      // Sort by most recent first
      const sortedConversations = all.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setConversations(sortedConversations);
      setFilteredConversations(sortedConversations);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const filtered = conversations.filter(conv =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  const handleConversationPress = (conversation: Conversation) => {
    navigation.navigate('Conversation', { conversationId: conversation.id });
  };

  const handleNewConversation = async () => {
    try {
      const newConversation = await ConversationStorage.createNewConversation('New Conversation');
      navigation.navigate('Conversation', { conversationId: newConversation.id });
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      {/* Search Bar */}
      <View style={{
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: theme.background,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.basicPlanCard.notSelected.backgroundColor,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          flex: 1,
        }}>
          <Ionicons name="search" size={20} color={theme.text} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor={theme.text + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              color: theme.text,
              fontSize: 16,
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            marginLeft: 8,
            padding: 4,
          }}
          onPress={handleNewConversation}
        >
          <Ionicons name="add" size={28} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0 }}>
        {filteredConversations.length === 0 && (
          <Text style={{ color: theme.text, textAlign: 'center', marginTop: 40 }}>
            {searchQuery ? 'No conversations found.' : 'No conversations yet.'}
          </Text>
        )}
        {filteredConversations.map((conv) => {
          const lastMsg = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
          return (
            <TouchableOpacity
              key={conv.id}
              style={{
                width: SCREEN_WIDTH - 32,
                backgroundColor: theme.premiumPlanCard.notSelected.backgroundColor,
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
              onPress={() => handleConversationPress(conv)}
            >
              <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>
                {conv.title}
              </Text>
              <Text style={{ color: theme.text, fontSize: 15, opacity: 0.8 }} numberOfLines={2}>
                {lastMsg ? lastMsg.content : 'No messages yet.'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
