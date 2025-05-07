import { StyleSheet } from 'react-native';

export const logStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    flexDirection: 'row', // Align icon and title horizontally
    alignItems: 'center', // Center vertically
    marginBottom: 20, // Add space between header and logs
  },
  headerIcon: {
    marginRight: 10, // Add space between icon and title
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
    flexDirection: 'row', // Align text and icon horizontally
    justifyContent: 'space-between', // Space between the text and icons
    alignItems: 'center', // Center vertically
  },
  logText: {
    fontSize: 16,
    color: '#333',
    flex: 1, // Ensures text takes space and pushes icon to the right
  },
  icon: {
    marginLeft: 10, // Adds space between text and icon
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
