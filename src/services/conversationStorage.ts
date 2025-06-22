import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Message } from './openaiService';

const CONVERSATIONS_KEY = 'conversations';
const CURRENT_CONVERSATION_KEY = 'current_conversation';

export class ConversationStorage {
  static async saveConversation(conversation: Conversation): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      const existingIndex = conversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.push(conversation);
      }
      
      await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  }

  static async getAllConversations(): Promise<Conversation[]> {
    try {
      const data = await AsyncStorage.getItem(CONVERSATIONS_KEY);
      if (data) {
        const conversations = JSON.parse(data);
        // Convert string dates back to Date objects
        return conversations.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  static async getConversation(id: string): Promise<Conversation | null> {
    try {
      const conversations = await this.getAllConversations();
      return conversations.find(c => c.id === id) || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  static async deleteConversation(id: string): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      const filtered = conversations.filter(c => c.id !== id);
      await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  static async addMessageToConversation(conversationId: string, message: Message): Promise<void> {
    try {
      const conversation = await this.getConversation(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      conversation.messages.push(message);
      conversation.updatedAt = new Date();
      
      await this.saveConversation(conversation);
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    }
  }

  static async createNewConversation(title: string): Promise<Conversation> {
    const conversation: Conversation = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.saveConversation(conversation);
    return conversation;
  }

  static async clearAllConversations(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONVERSATIONS_KEY);
    } catch (error) {
      console.error('Error clearing conversations:', error);
      throw error;
    }
  }
} 