import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../theme/themes';
import { styles } from '../styles/screens/SessionScreen.styles';

export default function SessionScreen() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, input.trim()]);
    setInput('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {messages.map((msg, index) => (
        <Text key={index} style={[styles.message, { backgroundColor: theme.card, color: theme.text }]}>
          {msg}
        </Text>
      ))}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
        style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}
      >
        <TextInput
          placeholder="Talk to your AI therapist..."
          placeholderTextColor={theme.text + '99'}
          value={input}
          onChangeText={setInput}
          style={[styles.input, { color: theme.text }]}
        />
        <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: theme.button }]}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
