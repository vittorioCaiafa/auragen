import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    animation: {
      position: "absolute",
      width: "140%",
      height: "140%",
      top: "-20%",
      left: 0,
      right: 0,
      alignSelf: "center",
      opacity: 0.7,
      zIndex: 0,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 30,
    },
    cardsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 32,
      gap: 16,
    },
    card: {
      flex: 1,
      borderRadius: 18,
      padding: 22,
      marginHorizontal: 4,
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      borderWidth: 2,
      borderColor: 'transparent',
    },
    cardPremium: {
      backgroundColor: '#8B5CF6',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    cardPrice: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    cardFeature: {
      fontSize: 14,
      marginBottom: 2,
    },
    purchaseButton: {
      marginTop: 10,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      elevation: 4,
    },
    purchaseButtonTextBasic: {
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 0.5,
      color: '#ffffff',
    },
    purchaseButtonTextPremium: {
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 0.5,
      color: '#ffffff',
    },
    skipButton: {
      marginTop: 16,
      paddingVertical: 12,
      alignItems: 'center',
    },
    skipButtonText: {
      fontSize: 16,
      textDecorationLine: 'underline',
    },
    closeButton: {
      position: 'absolute',
      top: 50,
      right: 16,
      zIndex: 10,
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
    },
    closeButtonText: {
      fontSize: 28,
      color: '#888',
      fontWeight: 'bold',
      lineHeight: 32,
    },
  });
  