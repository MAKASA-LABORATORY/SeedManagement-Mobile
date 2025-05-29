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

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      const loadData = async () => {
        try {
          const { data: plantedData, error: plantedError } = await supabase
            .from('planted_dates')
            .select('date, seed_id')
            .eq('user_id', user.id);

          if (plantedError) throw new Error(plantedError.message);

          const newPlantedDates = plantedData.reduce((acc, item) => {
            if (!acc[item.date]) acc[item.date] = [];
            acc[item.date].push(item.seed_id);
            return acc;
          }, {});
          setPlantedDates(newPlantedDates);

          const { data: seedsData, error: seedsError } = await supabase
            .from('seeds')
            .select('*')
            .eq('user_id', user.id);

          if (seedsError) throw new Error(seedsError.message);

          const transformedSeeds = seedsData.map(seed => ({
            id: seed.id,
            name: seed.name,
            type: seed.type,
            quantity: seed.quantity,
            minGrowthTime: seed.min_growth_time,
            maxGrowthTime: seed.max_growth_time,
            preferredWeather: seed.preferred_weather,
            info: seed.info,
          }));

          setSavedSeeds(transformedSeeds);
          updateMarkedDates(newPlantedDates, transformedSeeds);
        } catch (error) {
          console.error('Calendar load error:', error.message);
          Alert.alert('Error', 'Failed to load calendar data.');
        }
      };

      loadData();
    }, [user])
  );

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
            const updated = { ...prev };
            if (!updated[newRecord.date]) updated[newRecord.date] = [];
            updated[newRecord.date].push(newRecord.seed_id);
            updateMarkedDates(updated, savedSeeds);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, savedSeeds]);

  const updateMarkedDates = (plantedDatesMap, seedsList) => {
    const marked = {};

    Object.entries(plantedDatesMap).forEach(([date, seedIds]) => {
      seedIds.forEach(seedId => {
        const seed = seedsList.find(s => s.id === seedId);
        if (!seed) return;

        const plantedDate = new Date(date);
        const minDate = new Date(plantedDate);
        minDate.setDate(minDate.getDate() + seed.minGrowthTime);

        const maxDate = new Date(plantedDate);
        maxDate.setDate(maxDate.getDate() + seed.maxGrowthTime);

        // 🌱 Planted date marker
        if (!marked[date]) {
          marked[date] = {
            marked: true,
            dotColor: '#FFA500',
            customStyles: {
              container: { backgroundColor: '#fff8dc', borderRadius: 6 },
              text: { color: '#000', fontWeight: 'bold' },
            },
          };
        }

        // ✅ Expected harvest period
        for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
          const dStr = d.toISOString().split('T')[0];
          if (!marked[dStr]) {
            marked[dStr] = {
              customStyles: {
                container: {
                  backgroundColor: '#c8e6c9',
                  borderRadius: 6,
                },
                text: { color: '#000' },
              },
              harvests: [],
            };
          }
          if (!marked[dStr].harvests.includes(seed.name)) {
            marked[dStr].harvests.push(seed.name);
          }
        }
      });
    });

    if (selectedDate) {
      if (!marked[selectedDate]) marked[selectedDate] = {};
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = '#4CAF50';
    }

    setMarkedDates(marked);
  };

  const handleDayPress = (day) => {
    const newDate = day.dateString;
    if (!user) {
      setLoginPromptVisible(true);
      return;
    }
    setSelectedDate(newDate);
    setModalVisible(true);
  };

  const savePlantedDate = async (date, seedId) => {
    try {
      const { error } = await supabase.from('planted_dates').insert({
        user_id: user.id,
        date,
        seed_id: seedId,
      });
      if (error) throw new Error(error.message);
    } catch (err) {
      console.error('Save error:', err.message);
      Alert.alert('Error', 'Could not plant seed.');
    }
  };

  const handleSeedSelect = async (seed) => {
    const newPlanted = {
      ...plantedDates,
      [selectedDate]: [...(plantedDates[selectedDate] || []), seed.id],
    };
    setPlantedDates(newPlanted);
    await savePlantedDate(selectedDate, seed.id);
    addLog({
      seed,
      date: selectedDate,
      message: `${seed.name} planted on ${selectedDate}`,
    });
    updateMarkedDates(newPlanted, savedSeeds);
    setModalVisible(false);
  };

  const handleCancel = () => {
    updateMarkedDates(plantedDates, savedSeeds);
    setModalVisible(false);
  };

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
            markingType="custom"
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
          {selectedDate ? (
            <>
              {(plantedDates[selectedDate] || []).map((seedId, index) => {
                const seed = savedSeeds.find(s => s.id === seedId);
                return (
                  <Text key={`plant-${index}`} style={styles.eventText}>
                    {`${seed?.name || 'Seed'} planted on ${selectedDate}`}
                  </Text>
                );
              })}

              {(markedDates[selectedDate]?.harvests || []).map((name, i) => (
                <Text key={`harvest-${i}`} style={styles.eventText}>
                  Expected harvest of {name}
                </Text>
              ))}

              {(plantedDates[selectedDate]?.length === 0 &&
                !markedDates[selectedDate]?.harvests) && (
                <Text style={styles.eventText}>No events on this day</Text>
              )}
            </>
          ) : (
            <Text style={styles.eventText}>No date selected</Text>
          )}
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={handleCancel}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Seed</Text>
              {savedSeeds.length > 0 ? (
                savedSeeds.map(seed => (
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
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}
