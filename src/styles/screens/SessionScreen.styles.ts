import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e8f5e9',
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -1,
    },
    messages: {
      padding: 16,
      paddingBottom: 100,
    },
    message: {
      backgroundColor: '#c8e6c9',
      marginVertical: 6,
      padding: 12,
      borderRadius: 12,
      alignSelf: 'flex-start',
      maxWidth: '80%',
      color: '#1b5e20',
      fontSize: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    inputContainer: {
      position: 'absolute',
      bottom: 10,
      left: 10,
      right: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffffee',
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 6,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#2e7d32',
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: '#66bb6a',
      padding: 10,
      borderRadius: 20,
    },
  });
  