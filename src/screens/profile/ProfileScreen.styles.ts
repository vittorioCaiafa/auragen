import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#f1f8f4',
  },
  header: {
    position: 'absolute',
    top: 0,
    height: 160,
    width: '100%',
    backgroundColor: '#a5d6a7',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 5,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#2e7d32',
  },
  age: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  buttonsContainer: {
    width: '80%',
    gap: 16,
  },
  button: {
    backgroundColor: '#66bb6a',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 3,
  },
  signOut: {
    backgroundColor: '#e53935',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
