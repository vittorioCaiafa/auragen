import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { Button } from "react-native";

async function fetchPaymentSheetParams(): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}> {
  return fetch("/api/payment-sheet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export default function CheckoutForm({ amount }: { amount: number }) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  return <Button title="Pay" onPress={() => {}} />;
}
