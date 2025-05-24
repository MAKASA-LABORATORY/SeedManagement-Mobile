import { StyleSheet } from 'react-native';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50', // Matches your app's theme color
    textShadowColor: '#aaa',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    fontFamily: 'Arial', // Apply desired font family here
  },
  loadingBarContainer: {
    position: 'absolute',
    bottom: 40, // elevated a little more
    left: 20,
    right: 20,
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    overflow: 'hidden',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
});
