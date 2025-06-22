// src/screens/PaywallScreen.tsx
import React, { useState } from "react";
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
import { RootStackParamList } from "../navigation/AppNavigator";
import { useTheme } from "../theme/ThemeContext";
import { styles } from "../styles/screens/PaywallScreen.styles";
import LottieView from "lottie-react-native";
import PaymentModal from "../components/PaymentModal";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

export default function PaywallScreen({ navigation }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">(
    "basic"
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { isDark } = useTheme();
  const theme = isDark
    ? require("../theme/themes").darkTheme
    : require("../theme/themes").lightTheme;

  const getPlanPrice = () => {
    return selectedPlan === "basic" ? "$4.99/mo" : "$9.99/mo";
  };

  const handleStartPurchase = () => {
    setShowPaymentModal(true);
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

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
  };

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
        ]}
        onPress={handleStartPurchase}
        activeOpacity={0.85}
      >
        <Text
          style={
            selectedPlan === "premium"
              ? styles.purchaseButtonTextPremium
              : styles.purchaseButtonTextBasic
          }
        >
          {selectedPlan === "premium" ? "Start Premium" : "Start Basic"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("Home")}
      >
        <Text style={[styles.skipButtonText, { color: theme.textSecondary }]}>
          Skip for now
        </Text>
      </TouchableOpacity>

      <PaymentModal
        visible={showPaymentModal}
        onClose={handlePaymentClose}
        onSuccess={handlePaymentSuccess}
        plan={selectedPlan}
        price={getPlanPrice()}
      />
    </View>
  );
}
