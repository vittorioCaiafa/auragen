// src/api/stripeApi.ts

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

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-backend-api.com';

export const fetchPublishableKey = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/stripe/config`);
  if (!response.ok) throw new Error('Failed to fetch publishable key');
  const data = await response.json();
  return data.publishableKey;
};

export const fetchPaymentPlans = async (): Promise<PaymentPlan[]> => {
  const response = await fetch(`${API_BASE_URL}/api/stripe/plans`);
  if (!response.ok) throw new Error('Failed to fetch payment plans');
  const data = await response.json();
  return data.plans;
};

export const createPaymentIntent = async (
  planId: string,
  customerId?: string
): Promise<PaymentIntent> => {
  const response = await fetch(`${API_BASE_URL}/api/stripe/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId,
      customerId,
      metadata: { source: 'mobile_app', plan_type: planId }
    }),
  });
  if (!response.ok) throw new Error('Failed to create payment intent');
  const data = await response.json();
  return data.paymentIntent;
};

export const verifyPayment = async (paymentIntentId: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/stripe/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentIntentId }),
  });
  if (!response.ok) throw new Error('Failed to verify payment');
  const data = await response.json();
  return data.verified;
};

export const createCustomer = async (email: string, name: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/stripe/create-customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  if (!response.ok) throw new Error('Failed to create customer');
  const data = await response.json();
  return data.customerId;
};

export const getSubscriptionStatus = async (customerId: string): Promise<{
  hasActiveSubscription: boolean;
  planId?: string;
  expiresAt?: string;
}> => {
  const response = await fetch(`${API_BASE_URL}/api/stripe/subscription-status/${customerId}`);
  if (!response.ok) throw new Error('Failed to get subscription status');
  const data = await response.json();
  return data;
};

export const cancelSubscription = async (subscriptionId: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/stripe/cancel-subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscriptionId }),
  });
  if (!response.ok) throw new Error('Failed to cancel subscription');
  const data = await response.json();
  return data.success;
}; 