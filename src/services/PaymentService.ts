import { Alert } from 'react-native';
import { initStripe, createToken, confirmPayment } from '@stripe/stripe-react-native';

// Types for payment integration
export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  paymentIntentId?: string;
}

// Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-backend-api.com';
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Initialize Stripe
export const initializeStripe = async (): Promise<boolean> => {
  try {
    await initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: 'merchant.com.auragen.app', // Replace with your merchant identifier
    });
    return true;
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return false;
  }
};

// Fetch publishable key from backend
export const fetchPublishableKey = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stripe/config`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch publishable key');
    }
    
    return data.publishableKey;
  } catch (error) {
    console.error('Error fetching publishable key:', error);
    // Fallback to environment variable
    return STRIPE_PUBLISHABLE_KEY;
  }
};

// Fetch available payment plans from backend
export const fetchPaymentPlans = async (): Promise<PaymentPlan[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stripe/plans`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch payment plans');
    }
    
    return data.plans;
  } catch (error) {
    console.error('Error fetching payment plans:', error);
    // Return default plans as fallback
    return [
      {
        id: 'basic_monthly',
        name: 'Basic Plan',
        price: 499, // $4.99 in cents
        currency: 'usd',
        interval: 'month',
        features: ['Unlimited AI sessions', 'Standard support']
      },
      {
        id: 'premium_monthly',
        name: 'Premium Plan',
        price: 999, // $9.99 in cents
        currency: 'usd',
        interval: 'month',
        features: ['Everything in Basic', 'Priority support', 'Early access to new features']
      }
    ];
  }
};

// Create payment intent on backend
export const createPaymentIntent = async (
  planId: string,
  customerId?: string
): Promise<PaymentIntent> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        customerId,
        metadata: {
          source: 'mobile_app',
          plan_type: planId
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create payment intent');
    }
    
    return data.paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Process payment with Stripe
export const processPayment = async (
  paymentIntent: PaymentIntent,
  cardDetails: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
    name: string;
  }
): Promise<PaymentResult> => {
  try {
    // For now, we'll use a simplified approach that works with the current Stripe setup
    // In a real implementation, you would use the Stripe Elements or a more direct approach
    
    // Simulate payment processing (replace with actual Stripe integration)
    const isPaymentSuccessful = await simulatePaymentProcessing(cardDetails);
    
    if (!isPaymentSuccessful) {
      return {
        success: false,
        error: 'Payment processing failed'
      };
    }

    return {
      success: true,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during payment processing'
    };
  }
};

// Simulate payment processing (replace with actual Stripe integration)
const simulatePaymentProcessing = async (cardDetails: any): Promise<boolean> => {
  // This is a placeholder for actual Stripe payment processing
  // In a real implementation, you would:
  // 1. Create a payment method with Stripe
  // 2. Confirm the payment intent
  // 3. Handle the response
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 95% success rate
      resolve(Math.random() > 0.05);
    }, 2000);
  });
};

// Verify payment status on backend
export const verifyPayment = async (paymentIntentId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stripe/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentIntentId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify payment');
    }
    
    return data.verified;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};

// Create customer on backend
export const createCustomer = async (email: string, name: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stripe/create-customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create customer');
    }
    
    return data.customerId;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// Get customer subscription status
export const getSubscriptionStatus = async (customerId: string): Promise<{
  hasActiveSubscription: boolean;
  planId?: string;
  expiresAt?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stripe/subscription-status/${customerId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get subscription status');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return { hasActiveSubscription: false };
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stripe/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to cancel subscription');
    }
    
    return data.success;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return false;
  }
};

// Helper function to format card number for display
export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

// Helper function to validate card details
export const validateCardDetails = (cardDetails: {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  name: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate card number (basic Luhn algorithm check)
  const cardNumber = cardDetails.number.replace(/\s/g, '');
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    errors.push('Invalid card number length');
  }
  
  // Validate expiry date
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const expYear = parseInt(cardDetails.expYear);
  const expMonth = parseInt(cardDetails.expMonth);
  
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    errors.push('Card has expired');
  }
  
  // Validate CVC
  if (cardDetails.cvc.length < 3 || cardDetails.cvc.length > 4) {
    errors.push('Invalid CVC');
  }
  
  // Validate name
  if (!cardDetails.name.trim()) {
    errors.push('Cardholder name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
