import React, { useState, useEffect } from 'react';
import { Text, ImageBackground, View, TouchableOpacity, Alert, FlatList, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../AppNavigator';
import styles from '../styles/screens/HomeScreen.styles';
import BottomBar from '../components/BottomBar';
import { useTheme } from '../theme/ThemeContext';
import { testOpenAIConnection } from '../services/testApi';
import { debugApiConfiguration, testDirectApiCall, testAvailableModels } from '../services/debugApi';
import { ConversationStorage } from '../services/conversationStorage';
import { Conversation } from '../services/openaiService';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { isDark } = useTheme();
  const theme = isDark ? require('../theme/themes').darkTheme : require('../theme/themes').lightTheme;
  
  useEffect(() => {
    loadConversations();
  }, []);

  // Refresh conversations when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadConversations();
    }, [])
  );

  const loadConversations = async () => {
    try {
      const allConversations = await ConversationStorage.getAllConversations();
      // Sort by most recent first
      const sortedConversations = allConversations.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setConversations(sortedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const startNewConversation = () => {
    navigation.navigate('Conversation');
  };

  const continueConversation = (conversation: Conversation) => {
    navigation.navigate('Conversation', { conversationId: conversation.id });
  };

  const deleteConversation = async (conversationId: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ConversationStorage.deleteConversation(conversationId);
              await loadConversations();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete conversation');
            }
          }
        }
      ]
    );
  };

  const testAPI = async () => {
    const result = await testOpenAIConnection();
    if (result.success) {
      Alert.alert('✅ Success', 'OpenAI API connection is working!');
    } else {
      Alert.alert('❌ Error', `API test failed: ${result.error}`);
    }
  };

  const debugAPI = async () => {
    // First check configuration
    const configResult = debugApiConfiguration();
    
    if (!configResult.success) {
      Alert.alert(
        '🔍 Configuration Issue', 
        configResult.issues.join('\n') + '\n\nSolutions:\n' + configResult.solutions.join('\n')
      );
      return;
    }
    
    // Then test direct API call
    const apiResult = await testDirectApiCall();
    
    if (apiResult.success) {
      Alert.alert('✅ API Working', 'Direct API call successful!');
    } else {
      Alert.alert(
        '❌ API Error', 
        `Error: ${apiResult.error}\n\nThis will help identify if it's a quota issue or configuration problem.`
      );
    }
  };

  const testModels = async () => {
    Alert.alert(
      '🧪 Testing Models', 
      'This will test which models are available with your current quota. Check the console for detailed results.'
    );
    
    const result = await testAvailableModels();
    if (result.success) {
      const availableModels = result.results.filter(r => r.status === '✅ Available');
      const unavailableModels = result.results.filter(r => r.status !== '✅ Available');
      
      let message = `Available: ${availableModels.length}\n`;
      availableModels.forEach(m => message += `• ${m.model}\n`);
      
      if (unavailableModels.length > 0) {
        message += `\nUnavailable: ${unavailableModels.length}\n`;
        unavailableModels.forEach(m => message += `• ${m.model}: ${m.error}\n`);
      }
      
      Alert.alert('📊 Model Test Results', message);
    } else {
      Alert.alert('❌ Test Failed', result.error);
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[styles.conversationItem, { backgroundColor: theme.card }]}
      onPress={() => continueConversation(item)}
      onLongPress={() => deleteConversation(item.id)}
    >
      <View style={styles.conversationContent}>
        <Text style={[styles.conversationTitle, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.conversationPreview, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.messages.length > 0 
            ? item.messages[item.messages.length - 1].content
            : 'No messages yet'
          }
        </Text>
        <Text style={[styles.conversationTime, { color: theme.textSecondary }]}>
          {new Date(item.updatedAt).toLocaleDateString()} • {item.messages.length} messages
        </Text>
      </View>
    </TouchableOpacity>
  );

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
        
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: theme.button }]}
          onPress={startNewConversation}
        >
          <Text style={styles.startButtonText}>Start New Conversation</Text>
        </TouchableOpacity>

        {conversations.length > 0 && (
          <View style={styles.conversationsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Conversations
            </Text>
            <FlatList
              data={conversations}
              renderItem={renderConversation}
              keyExtractor={(item) => item.id}
              style={styles.conversationsList}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.text}
                />
              }
            />
          </View>
        )}

        <View style={styles.debugButtons}>
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: '#FF6B6B' }]}
            onPress={testAPI}
          >
            <Text style={styles.startButtonText}>Test API</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: '#4ECDC4' }]}
            onPress={debugAPI}
          >
            <Text style={styles.startButtonText}>🔍 Debug</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: '#9B59B6' }]}
            onPress={testModels}
          >
            <Text style={styles.startButtonText}>🧪 Models</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <BottomBar />
    </ImageBackground>
  );
}
