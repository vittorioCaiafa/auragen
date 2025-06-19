import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.2)', // subtle dark overlay
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b5e20',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: '#a5d6a7',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#66bb6a',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginVertical: 10,
    elevation: 6,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  icon: {
    marginRight: 10,
  },
});
