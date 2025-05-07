import { StyleSheet } from 'react-native';

export const stylesS = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
  },
});
