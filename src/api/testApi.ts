import { askAI } from './openaiService';
import { OPENAI_API_KEY } from '@env';

export const testOpenAIConnection = async () => {
  try {
    console.log('Testing OpenAI API connection...');
    
    // Debug: Check if API key exists
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY is not set');
      return { success: false, error: 'API key not found. Please check your .env file.' };
    }
    
    console.log('✅ API Key found (length:', OPENAI_API_KEY.length, ')');
    console.log('✅ API Key starts with:', OPENAI_API_KEY.substring(0, 7) + '...');
    
    const testMessage = {
      id: 'test',
      role: 'user' as const,
      content: 'Hello! Please respond with "API connection successful!"',
      timestamp: new Date()
    };

    const response = await askAI([testMessage]);
    console.log('✅ API Response:', response);
    return { success: true, response };
  } catch (error: any) {
    console.error('❌ API Test Failed:', error.message);
    return { success: false, error: error.message };
  }
}; 