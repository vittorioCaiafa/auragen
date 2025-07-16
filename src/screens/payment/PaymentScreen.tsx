// src/screens/PaywallScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../AppNavigator";
import { useTheme } from "../../theme/ThemeContext";
import { styles } from "./PaymentScreen.styles";
import LottieView from "lottie-react-native";
import {
  StripeProvider,
} from "@stripe/stripe-react-native";
import {
  openStripeCheckout,
} from "../../services/PaymentService";
import { TestPriceId } from "../../utils/constants";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

function PaymentScreenContent({ navigation }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">(
    "basic"
  );
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const { isDark } = useTheme();
  const theme = isDark
    ? require("../../theme/themes").darkTheme
    : require("../../theme/themes").lightTheme;

  const handleOpenStripeCheckout = async () => {
    let priceId =
      selectedPlan === "basic" ? TestPriceId.basic : TestPriceId.premium;
    try {
      await openStripeCheckout(priceId, "vittorio.caiafa@gmail.com");
    } catch (err) {}
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
            onPress: () => {
              (navigation as any).navigate("Main", { screen: "Home" });
            },
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Close (X) button in top right */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          (navigation as any).navigate("Main", { screen: "Home" });
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.text }]}>
        Unlock Your Personal AI Psychologist
      </Text>
      <Text style={[styles.description, { color: theme.text }]}>
        Get unlimited access to AI-guided mental health sessions. Choose your
        plan below!
      </Text>

      <View style={styles.cardsContainer}>
        {/* Basic Plan Card */}
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor:
                selectedPlan === "basic"
                  ? theme.basicPlanCard.selected.backgroundColor
                  : theme.basicPlanCard.notSelected.backgroundColor,
              borderColor:
                selectedPlan === "basic"
                  ? theme.basicPlanCard.selected.borderColor
                  : theme.basicPlanCard.notSelected.borderColor,
            },
          ]}
          onPress={() => setSelectedPlan("basic")}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.cardTitle,
              {
                color:
                  selectedPlan === "basic"
                    ? theme.basicPlanCard.selected.title
                    : theme.basicPlanCard.notSelected.title,
              },
            ]}
          >
            Basic Plan
          </Text>
          <Text
            style={[
              styles.cardPrice,
              {
                color:
                  selectedPlan === "basic"
                    ? theme.basicPlanCard.selected.text
                    : theme.basicPlanCard.notSelected.text,
              },
            ]}
          >
            $4.99/mo
          </Text>
          <Text
            style={[
              styles.cardFeature,
              {
                color:
                  selectedPlan === "basic"
                    ? theme.basicPlanCard.selected.text
                    : theme.basicPlanCard.notSelected.text,
              },
            ]}
          >
            • Unlimited AI sessions
          </Text>
          <Text
            style={[
              styles.cardFeature,
              {
                color:
                  selectedPlan === "basic"
                    ? theme.basicPlanCard.selected.text
                    : theme.basicPlanCard.notSelected.text,
              },
            ]}
          >
            • Standard support
          </Text>
        </TouchableOpacity>

        {/* Premium Plan Card */}
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor:
                selectedPlan === "premium"
                  ? theme.premiumPlanCard.selected.backgroundColor
                  : theme.premiumPlanCard.notSelected.backgroundColor,
              borderColor:
                selectedPlan === "premium"
                  ? theme.premiumPlanCard.selected.borderColor
                  : theme.premiumPlanCard.notSelected.borderColor,
            },
          ]}
          onPress={() => setSelectedPlan("premium")}
          activeOpacity={0.9}
        >
          {selectedPlan === "premium" && (
            <LottieView
              source={require("../../../assets/animations/lightning.json")}
              autoPlay
              loop
              style={styles.animation}
            />
          )}
          <View style={{ zIndex: 1 }}>
            <Text
              style={[
                styles.cardTitle,
                {
                  color:
                    selectedPlan === "premium"
                      ? theme.premiumPlanCard.selected.title
                      : theme.premiumPlanCard.notSelected.title,
                },
              ]}
            >
              Premium Plan
            </Text>
            <Text
              style={[
                styles.cardPrice,
                {
                  color:
                    selectedPlan === "premium"
                      ? theme.premiumPlanCard.selected.price
                      : theme.premiumPlanCard.notSelected.text,
                },
              ]}
            >
              $9.99/mo
            </Text>
            <Text
              style={[
                styles.cardFeature,
                {
                  color:
                    selectedPlan === "premium"
                      ? theme.premiumPlanCard.selected.text
                      : theme.premiumPlanCard.notSelected.text,
                },
              ]}
            >
              • Everything in Basic
            </Text>
            <Text
              style={[
                styles.cardFeature,
                {
                  color:
                    selectedPlan === "premium"
                      ? theme.premiumPlanCard.selected.text
                      : theme.premiumPlanCard.notSelected.text,
                },
              ]}
            >
              • Priority support
            </Text>
            <Text
              style={[
                styles.cardFeature,
                {
                  color:
                    selectedPlan === "premium"
                      ? theme.premiumPlanCard.selected.text
                      : theme.premiumPlanCard.notSelected.text,
                },
              ]}
            >
              • Early access to new features
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.purchaseButton,
          selectedPlan === "premium"
            ? { backgroundColor: theme.premiumPlanCard.selected.submitButton }
            : { backgroundColor: theme.basicPlanCard.selected.submitButton },
          isPaymentLoading && { opacity: 0.6 },
        ]}
        onPress={handleOpenStripeCheckout}
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
            : selectedPlan === "premium"
            ? "Start Premium"
            : "Start Basic"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PaywallScreen(props: Props) {
  const [publishableKey, setPublishableKey] = useState("");

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
