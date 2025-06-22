// src/screens/PaywallScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../AppNavigator";
import { useTheme } from "../theme/ThemeContext";
import { styles } from "../styles/screens/PaymentScreen.styles";
import LottieView from "lottie-react-native";
import { 
  StripeProvider, 
  useStripe,
  PaymentSheet 
} from '@stripe/stripe-react-native';
import { 
  fetchPublishableKey, 
  fetchPaymentPlans, 
  createPaymentIntent, 
  processPayment,
  PaymentPlan 
} from "../services/payment";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

function PaymentScreenContent({ navigation }: Props) {
  const [publishableKey, setPublishableKey] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">(
    "basic"
  );
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const { isDark } = useTheme();
  const theme = isDark
    ? require("../theme/themes").darkTheme
    : require("../theme/themes").lightTheme;

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPublishableKeyFromService = async () => {
    try {
      const key = await fetchPublishableKey();
      setPublishableKey(key);
    } catch (error) {
      console.error('Failed to fetch publishable key:', error);
      // Fallback to a default key for development
      setPublishableKey('pk_test_your_test_key_here');
    }
  };

  const loadPaymentPlans = async () => {
    try {
      const plans = await fetchPaymentPlans();
      setPaymentPlans(plans);
    } catch (error) {
      console.error('Failed to load payment plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishableKeyFromService();
    loadPaymentPlans();
  }, []);

  const getPlanPrice = () => {
    const plan = paymentPlans.find(p => 
      p.id === (selectedPlan === "basic" ? "basic_monthly" : "premium_monthly")
    );
    return plan ? `$${(plan.price / 100).toFixed(2)}/mo` : 
      (selectedPlan === "basic" ? "$4.99/mo" : "$9.99/mo");
  };

  const getPlanPriceInCents = () => {
    const plan = paymentPlans.find(p => 
      p.id === (selectedPlan === "basic" ? "basic_monthly" : "premium_monthly")
    );
    return plan ? plan.price : (selectedPlan === "basic" ? 499 : 999);
  };

  const handleStartPurchase = async () => {
    try {
      setIsPaymentLoading(true);
      
      // Create payment intent
      const planId = selectedPlan === 'basic' ? 'basic_monthly' : 'premium_monthly';
      const paymentIntent = await createPaymentIntent(planId);
      
      // Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'AuraGen',
        paymentIntentClientSecret: paymentIntent.client_secret,
        defaultBillingDetails: {
          name: 'User',
        },
        appearance: {
          colors: {
            primary: '#2e7d32',
            background: theme.background,
            componentBackground: theme.card,
            componentBorder: theme.border,
            componentDivider: theme.border,
            componentText: theme.text,
            placeholderText: theme.textSecondary,
          },
          shapes: {
            borderRadius: 12,
            shadow: {
              color: '#000000',
              opacity: 0.1,
            },
          },
        },
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        return;
      }

      // Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === 'Canceled') {
          // User canceled the payment
          return;
        }
        Alert.alert('Payment Failed', presentError.message);
        return;
      }

      // Payment successful
      await handlePaymentSuccess();
      
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'An unexpected error occurred during payment processing');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await AsyncStorage.setItem("hasPaid", "true");
      await AsyncStorage.setItem("selectedPlan", selectedPlan);
      Alert.alert(
        "Payment Successful! 🎉",
        `Welcome to your ${selectedPlan} plan! You now have unlimited access to your AI psychologist.`,
        [
          {
            text: "Start Using App",
            onPress: () => navigation.replace("Home"),
          },
        ]
      );
    } catch (err) {
      Alert.alert(
        "Error",
        "Something went wrong while processing the purchase."
      );
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.title, { color: theme.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Unlock Your Personal AI Psychologist
      </Text>
      <Text style={[styles.description, { color: theme.text }]}>
        Get unlimited access to AI-guided mental health sessions. Choose your
        plan below!
      </Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: theme.card },
            selectedPlan === "basic" && styles.cardSelectedBasic,
          ]}
          onPress={() => setSelectedPlan("basic")}
          activeOpacity={0.9}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Basic Plan
          </Text>
          <Text style={[styles.cardPrice, { color: theme.button }]}>
            $4.99/mo
          </Text>
          <Text style={[styles.cardFeature, { color: theme.text }]}>
            • Unlimited AI sessions
          </Text>
          <Text style={[styles.cardFeature, { color: theme.text }]}>
            • Standard support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            styles.cardPremium,
            selectedPlan === "premium" && styles.cardSelectedPremium,
          ]}
          onPress={() => setSelectedPlan("premium")}
          activeOpacity={0.9}
        >
          {selectedPlan === "premium" && (
            <LottieView
              source={require("../../assets/animations/lightning.json")}
              autoPlay
              loop
              style={styles.animation}
            />
          )}
          <View style={{ zIndex: 1 }}>
            <Text style={[styles.cardTitle, { color: '#FFFFFF' }]}>
              Premium Plan
            </Text>
            <Text style={[styles.cardPrice, { color: '#F3E8FF' }]}>
              $9.99/mo
            </Text>
            <Text style={[styles.cardFeature, { color: '#F3E8FF' }]}>
              • Everything in Basic
            </Text>
            <Text style={[styles.cardFeature, { color: '#F3E8FF' }]}>
              • Priority support
            </Text>
            <Text style={[styles.cardFeature, { color: '#F3E8FF' }]}>
              • Early access to new features
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.purchaseButton,
          selectedPlan === "premium"
            ? styles.purchaseButtonPremium
            : styles.purchaseButtonBasic,
          isPaymentLoading && { opacity: 0.6 }
        ]}
        onPress={handleStartPurchase}
        activeOpacity={0.85}
        disabled={isPaymentLoading}
      >
        <Text
          style={
            selectedPlan === "premium"
              ? styles.purchaseButtonTextPremium
              : styles.purchaseButtonTextBasic
          }
        >
          {isPaymentLoading 
            ? "Processing..." 
            : (selectedPlan === "premium" ? "Start Premium" : "Start Basic")
          }
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("Home")}
        disabled={isPaymentLoading}
      >
        <Text style={[styles.skipButtonText, { color: theme.textSecondary }]}>
          Skip for now
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PaywallScreen(props: Props) {
  const [publishableKey, setPublishableKey] = useState('');

  useEffect(() => {
    const loadKey = async () => {
      try {
        const key = await fetchPublishableKey();
        setPublishableKey(key);
      } catch (error) {
        console.error('Failed to fetch publishable key:', error);
        setPublishableKey('pk_test_your_test_key_here');
      }
    };
    loadKey();
  }, []);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.auragen.app"
      urlScheme="auragen"
    >
      <PaymentScreenContent {...props} />
    </StripeProvider>
  );
}
