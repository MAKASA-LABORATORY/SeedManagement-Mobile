import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { calendarStyles as styles } from './stylesC';
import { useLogs } from '../contexts/LogContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_KEY_SEEDS = '@seed_data';

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [plantedDates, setPlantedDates] = useState({});
  const [savedSeeds, setSavedSeeds] = useState([]);
  const { addLog } = useLogs();

  // Load plantedDates and seeds on focus
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // Load plantedDates
          const storedPlanted = await AsyncStorage.getItem('plantedDates');
          const parsedPlanted = storedPlanted ? JSON.parse(storedPlanted) : {};
          setPlantedDates(parsedPlanted);
          updateMarkedDates(selectedDate, parsedPlanted);

          // Load saved seeds from AsyncStorage with migration
          const storedSeeds = await AsyncStorage.getItem(STORAGE_KEY_SEEDS);
          let parsedSeeds = storedSeeds ? JSON.parse(storedSeeds) : [];
          // Migrate old seed data
          parsedSeeds = parsedSeeds.map(seed => {
            if (seed.timeOfGrowth && !seed.minGrowthTime) {
              const [min, max] = seed.timeOfGrowth.split('-').map(s => s.replace(' days', '').trim());
              return {
                ...seed,
                minGrowthTime: `${min} days`,
                maxGrowthTime: `${max || min} days`,
                timeOfGrowth: undefined,
              };
            }
            return {
              ...seed,
              minGrowthTime: seed.minGrowthTime || '60 days',
              maxGrowthTime: seed.maxGrowthTime || seed.minGrowthTime || '60 days',
            };
          });
          setSavedSeeds(parsedSeeds);
        } catch (error) {
          console.error('Failed to load data in Calendar:', error);
        }
      };
      loadData();
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
    const logMessage = `${seed.name} planted on ${selectedDate}`;
    addLog({ seed, date: selectedDate, message: logMessage });

    const newPlantedDates = { ...plantedDates, [selectedDate]: seed.id };
    setPlantedDates(newPlantedDates);
    savePlantedDates(newPlantedDates);
    updateMarkedDates(selectedDate, newPlantedDates);
    setModalVisible(false);
  };

  const handleCancel = () => {
    updateMarkedDates(selectedDate, plantedDates);
    setModalVisible(false);
  };

  // Get planted seed object based on plantedDates and savedSeeds
  const plantedSeed =
    selectedDate && plantedDates[selectedDate]
      ? savedSeeds.find((s) => s.id === plantedDates[selectedDate])
      : null;

  return (
    <ImageBackground
      source={require('../assets/seeds-bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
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
          {selectedDate && plantedSeed ? (
            <Text style={styles.eventText}>
              {`${plantedSeed.name} is planted on ${selectedDate}`}
            </Text>
          ) : (
            <Text style={styles.eventText}>No events on this day</Text>
          )}
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Seed</Text>
              {savedSeeds.length > 0 ? (
                savedSeeds.map((seed) => (
                  <TouchableOpacity
                    key={seed.id}
                    style={styles.seedButton}
                    onPress={() => handleSeedSelect(seed)}
                  >
                    <Text style={styles.seedText}>{seed.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ textAlign: 'center' }}>
                  No seeds available. Please add seeds in Inventory.
                </Text>
              )}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}