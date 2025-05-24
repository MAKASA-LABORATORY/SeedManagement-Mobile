import React, { useState, useCallback, useEffect } from 'react';
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
  const [user, setUser] = useState(null);
  const [loginPromptVisible, setLoginPromptVisible] = useState(false);

  // Fetch user on mount - do not show login prompt here
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  // Load plantedDates and seeds from Supabase on focus
  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      const loadData = async () => {
        try {
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
          setPlantedDates(prev => {
            const merged = { ...prev, ...newPlantedDates };
            updateMarkedDates(selectedDate, merged);
            return merged;
          });

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
    }, [user, selectedDate])
  );

  // Real-time subscription for planted_dates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('planted_dates-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'planted_dates',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const { new: newRecord } = payload;
          setPlantedDates(prev => {
            const updated = { ...prev, [newRecord.date]: newRecord.seed_id };
            updateMarkedDates(selectedDate, updated);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, selectedDate]);

  const savePlantedDates = async (date, seedId) => {
    try {
      if (!user) {
        setLoginPromptVisible(true);
        return;
      }

      const { error } = await supabase
        .from('planted_dates')
        .insert({
          user_id: user.id,
          date,
          seed_id: seedId,
        });

      if (error) {
        throw new Error(error.message);
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
        customStyles: {
          container: {
            backgroundColor: '#ADD8E6', // light blue background for days with events
            borderRadius: 6,
          },
          text: {
            color: '#000',
            fontWeight: 'bold',
          },
        },
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
    if (!user) {
      setLoginPromptVisible(true);
      return;
    }
    setSelectedDate(newDate);
    updateMarkedDates(newDate, plantedDates);
    setModalVisible(true);
  };

  const handleSeedSelect = async (seed) => {
    const logMessage = `${seed.name} planted on ${selectedDate}`;
    addLog({ seed, date: selectedDate, message: logMessage });

    const newPlantedDates = { ...plantedDates, [selectedDate]: seed.id };
    setPlantedDates(newPlantedDates);
    await savePlantedDates(selectedDate, seed.id);
    updateMarkedDates(selectedDate, newPlantedDates);
    setModalVisible(false);
  };

  const handleCancel = () => {
    updateMarkedDates(selectedDate, plantedDates);
    setModalVisible(false);
  };

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
            markingType={'custom'}
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

        <Modal
          visible={loginPromptVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setLoginPromptVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.loginPromptContainer}>
              <Text style={styles.loginPromptText}>You must log in first</Text>
              <TouchableOpacity
                style={styles.loginPromptButton}
                onPress={() => {
                  setLoginPromptVisible(false);
                  navigation.navigate('Login');
                }}
              >
                <Text style={styles.loginPromptButtonText}>Go to Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.loginPromptCloseButton}
                onPress={() => setLoginPromptVisible(false)}
              >
                <Text style={styles.loginPromptCloseButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}
