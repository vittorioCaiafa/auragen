import axios from "axios";
import { OPENAI_API_KEY } from "@env";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Simple usage tracking
let apiCallCount = 0;
const MAX_CALLS_PER_SESSION = 50; // Adjust based on your needs

export const askAI = async (messages: Message[]): Promise<string> => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found. Please check your environment variables.");
    }

    // Check usage limits
    apiCallCount++;
    if (apiCallCount > MAX_CALLS_PER_SESSION) {
      throw new Error("Session API call limit reached. Please restart the app or check your quota.");
    }

    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    console.log(`Making API call #${apiCallCount}...`);

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: formattedMessages,
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    
    // Handle specific quota errors
    if (error.response?.data?.error?.code === "insufficient_quota") {
      throw new Error(
        "🚫 Quota Exceeded\n\n" +
        "Your OpenAI free trial quota has been used up.\n\n" +
        "Solutions:\n" +
        "1. Convert to regular free tier at https://platform.openai.com/account/billing\n" +
        "2. Create a new account with different email\n" +
        "3. Add payment method for pay-as-you-go\n" +
        "4. Wait for trial reset (if monthly)\n\n" +
        "The app will work once you have available quota."
      );
    }
    
    throw new Error(
      error.response?.data?.error?.message || 
      error.message || 
      "Failed to get response from AI"
    );
  }
};

export const generateConversationTitle = async (firstMessage: string): Promise<string> => {
  try {
    const response = await askAI([
      {
        id: "temp",
        role: "user",
        content: `Generate a short, descriptive title (max 50 characters) for a conversation that starts with: "${firstMessage.substring(0, 100)}..."`,
        timestamp: new Date()
      }
    ]);
    
    return response.trim().replace(/[""]/g, '');
  } catch (error) {
    return "New Conversation";
  }
};

// Function to check quota status
export const checkQuotaStatus = async (): Promise<{ success: boolean; message: string }> => {
  try {
    if (!OPENAI_API_KEY) {
      return { success: false, message: "OpenAI API key not found" };
    }

    // Make a minimal test call to check quota
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "test" }],
        max_tokens: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return { success: true, message: "Quota available" };
  } catch (error: any) {
    if (error.response?.data?.error?.code === "insufficient_quota") {
      return { 
        success: false, 
        message: "Quota exceeded. Check https://platform.openai.com/usage" 
      };
    }
    return { 
      success: false, 
      message: error.response?.data?.error?.message || "Unknown error" 
    };
  }
};

// Reset session call counter
export const resetSessionCounter = () => {
  apiCallCount = 0;
  console.log("Session API call counter reset");
};
