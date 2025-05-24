import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const calendarStyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 10,
  },
  calendarBox: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  eventsContainer: {
    marginTop: 10,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 5,
  },
  eventText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: height * 0.7,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#4CAF50',
    textAlign: 'center',
  },
  seedButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#e0f2f1',
    marginBottom: 8,
  },
  seedText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#B22222',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptContainer: {
    width: '80%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: '#4CAF50',
  },
  loginPromptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  loginPromptButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  loginPromptCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  loginPromptCloseButtonText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 16,
  },
});
