import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { styles } from '../styles/screens/ConversationScreen.styles';
import { askAI, Message, generateConversationTitle } from '../services/openaiService';
import { ConversationStorage } from '../services/conversationStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

export default function ConversationScreen({ navigation, route }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);
  
  const { isDark } = useTheme();
  const theme = isDark
    ? require('../theme/themes').darkTheme
    : require('../theme/themes').lightTheme;

  useEffect(() => {
    loadConversation();
  }, []);

  const loadConversation = async () => {
    const conversationId = route.params?.conversationId;
    if (conversationId) {
      const conv = await ConversationStorage.getConversation(conversationId);
      if (conv) {
        setConversation(conv);
        setMessages(conv.messages);
      }
    } else {
      // Create new conversation
      const newConversation = await ConversationStorage.createNewConversation('New Conversation');
      setConversation(newConversation);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Add user message to conversation
      await ConversationStorage.addMessageToConversation(conversation.id, userMessage);

      // Generate AI response
      const allMessages = [...messages, userMessage];
      const aiResponse = await askAI(allMessages);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      // Add AI message to conversation
      await ConversationStorage.addMessageToConversation(conversation.id, aiMessage);
      setMessages(prev => [...prev, aiMessage]);

      // Generate title for new conversations
      if (messages.length === 0 && conversation.title === 'New Conversation') {
        const title = await generateConversationTitle(userMessage.content);
        conversation.title = title;
        await ConversationStorage.saveConversation(conversation);
        setConversation(conversation);
      }

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.role === 'user' ? styles.userMessage : styles.aiMessage,
      { backgroundColor: item.role === 'user' ? theme.button : theme.card }
    ]}>
      <Text style={[
        styles.messageText,
        { color: item.role === 'user' ? '#FFFFFF' : theme.text }
      ]}>
        {item.content}
      </Text>
      <Text style={[
        styles.messageTime,
        { color: item.role === 'user' ? '#E0E0E0' : theme.textSecondary }
      ]}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {conversation?.title || 'New Conversation'}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.button} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            AI is thinking...
          </Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            { 
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border
            }
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={theme.textSecondary}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() ? theme.button : theme.textSecondary }
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
} 