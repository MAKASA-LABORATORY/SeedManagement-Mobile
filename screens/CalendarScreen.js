import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { calendarStyles as styles } from './stylesC';
import { useLogs } from '../contexts/LogContext';
import { seeds } from './seeds';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [plantedDates, setPlantedDates] = useState({});
  const [selectedSeed, setSelectedSeed] = useState(null);
  const { addLog } = useLogs();

  // Reload plantedDates every time screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadPlantedDates = async () => {
        try {
          const stored = await AsyncStorage.getItem('plantedDates');
          const parsed = stored ? JSON.parse(stored) : {};
          setPlantedDates(parsed);
          updateMarkedDates(selectedDate, parsed);
        } catch (error) {
          console.error('Failed to load plantedDates', error);
        }
      };

      loadPlantedDates();
    }, [selectedDate])
  );

  const savePlantedDates = async (data) => {
    try {
      await AsyncStorage.setItem('plantedDates', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save plantedDates', error);
    }
  };

  const updateMarkedDates = (newSelectedDate, newPlantedDates) => {
    const updated = {};

    Object.keys(newPlantedDates).forEach((date) => {
      updated[date] = {
        marked: true,
        dotColor: '#f44336',
      };
    });

    if (newSelectedDate) {
      updated[newSelectedDate] = {
        ...(updated[newSelectedDate] || {}),
        selected: true,
        selectedColor: '#4CAF50',
      };
    }

    setMarkedDates(updated);
  };

  const handleDayPress = (day) => {
    const newDate = day.dateString;
    setSelectedDate(newDate);
    updateMarkedDates(newDate, plantedDates);
    setModalVisible(true);
  };

  const handleSeedSelect = (seed) => {
    const logMessage = `${seed.name} is planted on ${selectedDate}`;
    addLog({ seed, date: selectedDate, message: logMessage });

    const newPlantedDates = { ...plantedDates, [selectedDate]: true };
    setPlantedDates(newPlantedDates);
    savePlantedDates(newPlantedDates);
    setSelectedSeed(seed);
    updateMarkedDates(selectedDate, newPlantedDates);
    setModalVisible(false);
  };

  const handleCancel = () => {
    updateMarkedDates(selectedDate, plantedDates);
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
            dotColor: '#f44336',
          }}
        />
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Events:</Text>
        {selectedDate && plantedDates[selectedDate] ? (
          <Text style={styles.eventText}>
            {selectedSeed ? `${selectedSeed.name} is planted` : 'Planted'}
          </Text>
        ) : (
          <Text style={styles.eventText}>No events on this day</Text>
        )}
      </View>

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
  <TouchableOpacity
    key={seed.id}
    style={styles.seedButton} // Green background container
    onPress={() => handleSeedSelect(seed)}
  >
    <Text style={styles.seedText}>{seed.name}</Text>
  </TouchableOpacity>
))}

              
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
