import { openCheckout } from '../api/paymentApi';

export const openStripeCheckout = async (planId: string, email: string): Promise<void> => {
  await openCheckout(planId, email);
};

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
