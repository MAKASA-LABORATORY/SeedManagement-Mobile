import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { calendarStyles as styles } from '../styles/stylesC';
import { useLogs } from '../contexts/LogContext';
import { supabase } from '../config/supabaseClient';
import { useFocusEffect } from '@react-navigation/native';

export default function CalendarScreen({ navigation }) {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [plantedDates, setPlantedDates] = useState({});
  const [savedSeeds, setSavedSeeds] = useState([]);
  const { addLog } = useLogs();

  // Load plantedDates and seeds from Supabase on focus
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // Check if user is authenticated
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            Alert.alert('Error', 'User not authenticated. Please log in.');
            navigation.navigate('Login');
            return;
          }

          // Load planted dates from Supabase
          const { data: plantedData, error: plantedError } = await supabase
            .from('planted_dates')
            .select('date, seed_id')
            .eq('user_id', user.id);

          if (plantedError) {
            throw new Error(plantedError.message);
          }

          const newPlantedDates = plantedData.reduce((acc, item) => {
            acc[item.date] = item.seed_id;
            return acc;
          }, {});
          setPlantedDates(newPlantedDates);
          updateMarkedDates(selectedDate, newPlantedDates);

          // Load seeds from Supabase
          const { data: seedsData, error: seedsError } = await supabase
            .from('seeds')
            .select('*')
            .eq('user_id', user.id)
            .order('name', { ascending: true });

          if (seedsError) {
            throw new Error(seedsError.message);
          }

          const transformedSeeds = seedsData.map(seed => ({
            id: seed.id,
            name: seed.name,
            type: seed.type,
            quantity: seed.quantity,
            minGrowthTime: `${seed.min_growth_time} days`,
            maxGrowthTime: `${seed.max_growth_time} days`,
            preferredWeather: seed.preferred_weather,
            info: seed.info,
          }));

          setSavedSeeds(transformedSeeds);
        } catch (error) {
          console.error('Failed to load data in Calendar:', error.message);
          Alert.alert('Error', 'Failed to load calendar data.');
        }
      };
      loadData();
    }, [selectedDate, navigation])
  );

  const savePlantedDates = async (data) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'User not authenticated. Please log in.');
        navigation.navigate('Login');
        return;
      }

      // Clear existing planted dates for this user
      await supabase
        .from('planted_dates')
        .delete()
        .eq('user_id', user.id);

      // Insert new planted dates
      const plantedEntries = Object.entries(data).map(([date, seed_id]) => ({
        user_id: user.id,
        date,
        seed_id,
      }));

      if (plantedEntries.length > 0) {
        const { error } = await supabase
          .from('planted_dates')
          .insert(plantedEntries);

        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.error('Failed to save plantedDates:', error.message);
      Alert.alert('Error', 'Failed to save planted dates.');
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

  const handleSeedSelect = async (seed) => {
    const logMessage = `${seed.name} planted on ${selectedDate}`;
    addLog({ seed, date: selectedDate, message: logMessage });

    const newPlantedDates = { ...plantedDates, [selectedDate]: seed.id };
    setPlantedDates(newPlantedDates);
    await savePlantedDates(newPlantedDates);
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