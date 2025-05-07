// stylesC.js
import { StyleSheet } from 'react-native';

export const calendarStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  calendarBox: {
    marginTop: 20,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalSeed: {
    fontSize: 16,
    marginBottom: 10,
    color: '#4CAF50',
  },
});
