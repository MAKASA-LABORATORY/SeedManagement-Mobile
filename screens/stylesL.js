import { StyleSheet } from 'react-native';

export const logStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  noLogsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  logItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logText: {
    fontSize: 16,
    color: '#333',
  },
  logExpandContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  logExpandText: {
    fontSize: 14,
    color: '#666',
  },
});
