// screens/CalendarScreen.js
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { calendarStyles as styles } from './stylesC'; // Assuming you have styles in stylesC.js
import { useLogs } from '../contexts/LogContext'; // Import LogContext

import { seeds } from './seeds'; // Assuming you have seeds.js file

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const { addLog } = useLogs(); // Access addLog from context

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleSeedSelect = (seed) => {
    const logMessage = `${seed.name} is planted on ${selectedDate}`;
    addLog({ seed, date: selectedDate, message: logMessage });

    setMarkedDates((prev) => ({
      ...prev,
      [selectedDate]: { marked: true, selected: true, selectedColor: '#4CAF50' },
    }));
    setSelectedSeed(seed);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="calendar-today" size={28} color="#4CAF50" />
        <Text style={styles.headerText}>Calendar</Text>
      </View>

      <View style={styles.calendarBox}>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            selectedDayBackgroundColor: '#4CAF50',
            todayTextColor: '#4CAF50',
            arrowColor: '#4CAF50',
            textMonthFontWeight: 'bold',
          }}
        />
      </View>

      {/* Modal to select a seed */}
      {modalVisible && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Seed</Text>
              {seeds.map((seed) => (
                <TouchableOpacity key={seed.id} onPress={() => handleSeedSelect(seed)}>
                  <Text style={styles.modalSeed}>{seed.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
