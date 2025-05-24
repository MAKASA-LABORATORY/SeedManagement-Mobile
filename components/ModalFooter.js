import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ModalFooter = ({
  onSave,
  onCancel,
  saveText = 'Save',
  cancelText = 'Cancel',
  saveButtonColor = '#2e8b57',
  cancelButtonColor = '#B22222',
}) => {
  return (
    <View style={styles.modalFooter}>
      <View style={styles.actionButtons}>
        <View style={styles.leftButtonWrapper}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: saveButtonColor }]}
            onPress={onSave}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>{saveText}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightButtonWrapper}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: cancelButtonColor }]}
            onPress={onCancel}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>{cancelText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalFooter: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftButtonWrapper: {
    flex: 1,
    marginRight: 5,
  },
  rightButtonWrapper: {
    flex: 1,
    marginLeft: 5,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default ModalFooter;