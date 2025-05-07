import { StyleSheet } from 'react-native';

export const calendarStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#4CAF50',
  },
  calendarBox: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  eventsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  eventText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  seedButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  seedText: {
    fontSize: 16,
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#f44336', // Red for cancel
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelText: {
    fontSize: 16,
    color: '#fff',
  },
});
