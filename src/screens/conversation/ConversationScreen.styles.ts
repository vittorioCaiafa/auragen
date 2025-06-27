import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 20,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});