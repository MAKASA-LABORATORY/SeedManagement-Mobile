// stylesL.js
import { StyleSheet } from 'react-native';

export const logStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  logTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  icon: {
    marginLeft: 10,
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
