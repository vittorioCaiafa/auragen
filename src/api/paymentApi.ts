// src/api/stripeApi.ts

import { Alert } from "react-native";

export const openCheckout = async (priceId: string, email: string): Promise<void> => {
  try {
    const response = await fetch(`http://192.168.1.12:3000/api/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, customerEmail: email }),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error('Invalid JSON response from backend');
    }

    if (!response.ok || !data?.url) {
      throw new Error(data?.error || 'No checkout URL returned');
    }

    await import('expo-web-browser').then(WebBrowser =>
      WebBrowser.openBrowserAsync(data.url)
    );
  } catch (error) {
    let message = 'Failed to open Stripe checkout. Please try again.';
    if (error instanceof Error) {
      message = error.message || message;
    } else {
    }
    Alert.alert('Error', message);
  }
};
