import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';
import { seeds as defaultSeeds } from './seeds';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

const STORAGE_KEY = '@seed_data';

const InventoryScreen = () => {
  const [seeds, setSeeds] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedWeather, setSelectedWeather] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [newSeed, setNewSeed] = useState({
    name: '',
    type: '',
    quantity: '',
    timeOfGrowth: '',
    preferredWeather: '',
    info: '',
  });
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    loadSeeds();
  }, []);

  useEffect(() => {
    saveSeeds();
  }, [seeds]);

  const loadSeeds = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setSeeds(JSON.parse(jsonValue));
      } else {
        setSeeds(defaultSeeds);
      }
    } catch (e) {
      console.error('Failed to load seeds:', e);
    }
  };

  const saveSeeds = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
    } catch (e) {
      console.error('Failed to save seeds:', e);
    }
  };

  const handleAddSeed = () => {
    if (!newSeed.name || !newSeed.type || !newSeed.quantity) {
      Alert.alert('Please fill out required fields.');
      return;
    }
    const newId = (parseInt(seeds[seeds.length - 1]?.id || '0') + 1).toString();
    const updatedSeeds = [
      ...seeds,
      { id: newId, ...newSeed, quantity: parseInt(newSeed.quantity) },
    ];
    setSeeds(updatedSeeds);
    setModalVisible(false);
    setNewSeed({
      name: '',
      type: '',
      quantity: '',
      timeOfGrowth: '',
      preferredWeather: '',
      info: '',
    });
  };

  const handleDeleteSeed = (id) => {
    Alert.alert('Delete Seed', 'Are you sure you want to delete this seed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setSeeds(seeds.filter((s) => s.id !== id)),
      },
    ]);
  };

  const handleEditSeed = (updatedSeed) => {
    setSeeds(seeds.map((s) => (s.id === updatedSeed.id ? updatedSeed : s)));
    setInfoModalVisible(false);
  };

  const filteredSeeds = seeds
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedType === 'All' || s.type === selectedType) &&
        (selectedWeather === 'All' || s.preferredWeather === selectedWeather)
    )
    .sort((a, b) =>
      sortBy === 'name' ? a.name.localeCompare(b.name) : a.quantity - b.quantity
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="leaf" size={28} color="#4CAF50" />
        <Text style={styles.headerText}>Seed Inventory</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search seeds..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortBy(sortBy === 'name' ? 'quantity' : 'name')}
        >
          <Text style={styles.buttonText}>Sort: {sortBy}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {filteredSeeds.length === 0 ? (
        <Text style={styles.noSeedsText}>No seeds found.</Text>
      ) : (
        <FlatList
          data={filteredSeeds}
          keyExtractor={(item) => item.id}
          style={styles.seedList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.seedItem}
              onPress={() => {
                setSelectedSeed(item);
                setInfoModalVisible(true);
              }}
            >
              <View>
                <Text style={styles.seedText}>{item.name}</Text>
                <Text style={styles.seedDetail}>Qty: {item.quantity}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* The rest of the modals follow as in the original message... */}
    </View>
  );
};

export default InventoryScreen;
