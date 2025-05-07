import { StyleSheet } from 'react-native';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10, // Space between icon and title
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 18,
  },
  // Clear Logs Button Styles
  clearLogsButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: 'green',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearLogsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
