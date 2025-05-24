import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { supabase } from '../config/supabaseClient';
import { styles } from '../styles/stylesInv';

const { height } = Dimensions.get('window');

export default function InventoryScreen({ navigation }) {
  // States
  const [seeds, setSeeds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Clear Filter');
  const [sortWeather, setSortWeather] = useState('Clear Sort');
  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [seedInfoVisible, setSeedInfoVisible] = useState(false);
  const [addSeedModalVisible, setAddSeedModalVisible] = useState(false);
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const [weatherPickerVisible, setWeatherPickerVisible] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lastDeletedSeed, setLastDeletedSeed] = useState(null);
  const [lastDeletedIndex, setLastDeletedIndex] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  // New/edit seed input states
  const [newSeedName, setNewSeedName] = useState('');
  const [newSeedQuantity, setNewSeedQuantity] = useState('');
  const [newSeedType, setNewSeedType] = useState('');
  const [newSeedMinGrowthTime, setNewSeedMinGrowthTime] = useState('');
  const [newSeedMaxGrowthTime, setNewSeedMaxGrowthTime] = useState('');
  const [newSeedPreferredWeather, setNewSeedPreferredWeather] = useState('');
  const [newSeedInfo, setNewSeedInfo] = useState('');

  // Load seeds from Supabase on mount
  useEffect(() => {
    const fetchSeeds = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          Alert.alert('Error', 'User not authenticated. Please log in.');
          navigation.navigate('Login');
          return;
        }

        const { data, error } = await supabase
          .from('seeds')
          .select('*')
          .eq('user_id', user.id)
          .order('name', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        // Transform data to match the format expected by the UI
        const transformedSeeds = data.map(seed => ({
          id: seed.id,
          name: seed.name,
          type: seed.type,
          quantity: seed.quantity,
          minGrowthTime: `${seed.min_growth_time} days`,
          maxGrowthTime: `${seed.max_growth_time} days`,
          preferredWeather: seed.preferred_weather,
          info: seed.info,
        }));

        setSeeds(transformedSeeds);
      } catch (error) {
        console.error('Error fetching seeds:', error.message);
        Alert.alert('Error', 'Failed to load seeds.');
      }
    };

    fetchSeeds();
  }, []);

  // Refresh seeds when navigating back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSeeds();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchSeeds = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data, error } = await supabase
        .from('seeds')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw new Error(error.message);

      const transformedSeeds = data.map(seed => ({
        id: seed.id,
        name: seed.name,
        type: seed.type,
        quantity: seed.quantity,
        minGrowthTime: `${seed.min_growth_time} days`,
        maxGrowthTime: `${seed.max_growth_time} days`,
        preferredWeather: seed.preferred_weather,
        info: seed.info,
      }));

      setSeeds(transformedSeeds);
    } catch (error) {
      console.error('Error refreshing seeds:', error.message);
    }
  };

  // Filtering seeds by search and category
  let filteredSeeds = seeds.filter(seed =>
    seed.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (categoryFilter !== 'Clear Filter') {
    filteredSeeds = filteredSeeds.filter(seed => seed.type === categoryFilter);
  }

  // Filter by weather or sort by name if no weather filter
  if (sortWeather !== 'Clear Sort') {
    filteredSeeds = filteredSeeds.filter(seed => seed.preferredWeather === sortWeather);
  } else {
    filteredSeeds = [...filteredSeeds].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Handlers for modals and selections
  const handleCategorySelect = (category) => {
    setCategoryFilter(category);
    setModalVisible(false);
  };

  const handleSortSelect = (weather) => {
    setSortWeather(weather);
    setSortModalVisible(false);
  };

  const handleSeedPress = (seed) => {
    setSelectedSeed(seed);
    setSeedInfoVisible(true);
    if (!seed) {
      Alert.alert('Error', 'No seed selected');
    }
  };

  const handleTypeSelect = (type) => {
    setNewSeedType(type);
    setTypePickerVisible(false);
  };

  const handleWeatherSelect = (weather) => {
    setNewSeedPreferredWeather(weather);
    setWeatherPickerVisible(false);
  };

  const resetNewSeedInputs = () => {
    setNewSeedName('');
    setNewSeedQuantity('');
    setNewSeedType('');
    setNewSeedMinGrowthTime('');
    setNewSeedMaxGrowthTime('');
    setNewSeedPreferredWeather('');
    setNewSeedInfo('');
  };

  const handleOpenAddSeedModal = () => {
    setIsEditing(false);
    resetNewSeedInputs();
    setAddSeedModalVisible(true);
  };

  const handleEditSeed = (seed) => {
    setIsEditing(true);
    setSelectedSeed(seed);
    setNewSeedName(seed.name);
    setNewSeedQuantity(seed.quantity.toString());
    setNewSeedType(seed.type);
    setNewSeedMinGrowthTime(seed.minGrowthTime ? seed.minGrowthTime.replace(' days', '') : '');
    setNewSeedMaxGrowthTime(seed.maxGrowthTime ? seed.maxGrowthTime.replace(' days', '') : '');
    setNewSeedPreferredWeather(seed.preferredWeather);
    setNewSeedInfo(seed.info);
    setSeedInfoVisible(false);
    setAddSeedModalVisible(true);
  };

  const handleSaveSeed = async () => {
    if (
      !newSeedName.trim() ||
      !newSeedQuantity.trim() ||
      !newSeedType.trim() ||
      !newSeedMinGrowthTime.trim() ||
      !newSeedMaxGrowthTime.trim() ||
      !newSeedPreferredWeather.trim() ||
      !newSeedInfo.trim()
    ) {
      Alert.alert('Validation', 'Please fill in all fields.');
      return;
    }

    const quantityInt = parseInt(newSeedQuantity, 10);
    const minTimeInt = parseInt(newSeedMinGrowthTime, 10);
    const maxTimeInt = parseInt(newSeedMaxGrowthTime, 10);

    if (isNaN(quantityInt) || quantityInt < 0) {
      Alert.alert('Validation', 'Quantity must be a valid non-negative number.');
      return;
    }
    if (isNaN(minTimeInt) || minTimeInt <= 0) {
      Alert.alert('Validation', 'Minimum growth time must be a positive number.');
      return;
    }
    if (isNaN(maxTimeInt) || maxTimeInt <= 0) {
      Alert.alert('Validation', 'Maximum growth time must be a positive number.');
      return;
    }
    if (minTimeInt > maxTimeInt) {
      Alert.alert('Validation', 'Minimum growth time cannot exceed maximum growth time.');
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'User not authenticated. Please log in.');
        navigation.navigate('Login');
        return;
      }

      const seedData = {
        user_id: user.id,
        name: newSeedName.trim(),
        type: newSeedType.trim(),
        quantity: quantityInt,
        min_growth_time: minTimeInt,
        max_growth_time: maxTimeInt,
        preferred_weather: newSeedPreferredWeather.trim(),
        info: newSeedInfo.trim(),
      };

      if (isEditing) {
        const { error } = await supabase
          .from('seeds')
          .update(seedData)
          .eq('id', selectedSeed.id)
          .eq('user_id', user.id);

        if (error) {
          throw new Error(error.message);
        }
      } else {
        const { error } = await supabase
          .from('seeds')
          .insert(seedData);

        if (error) {
          throw new Error(error.message);
        }
      }

      // Refresh seeds after saving
      await fetchSeeds();

      resetNewSeedInputs();
      setAddSeedModalVisible(false);
      setIsEditing(false);
      setSelectedSeed(null);
    } catch (error) {
      console.error('Error saving seed:', error.message);
      Alert.alert('Error', 'Failed to save seed.');
    }
  };

  const handleDeleteSeed = async (seed) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'User not authenticated. Please log in.');
        navigation.navigate('Login');
        return;
      }

      const index = seeds.findIndex(s => s.id === seed.id);
      setLastDeletedSeed(seed);
      setLastDeletedIndex(index);

      const { error } = await supabase
        .from('seeds')
        .delete()
        .eq('id', seed.id)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      // Refresh seeds after deletion
      await fetchSeeds();

      setSeedInfoVisible(false);
      setShowUndo(true);

      setTimeout(() => {
        setShowUndo(false);
        setLastDeletedSeed(null);
        setLastDeletedIndex(null);
      }, 5000);
    } catch (error) {
      console.error('Error deleting seed:', error.message);
      Alert.alert('Error', 'Failed to delete seed.');
    }
  };

  const handleUndoDelete = async () => {
    if (lastDeletedSeed && lastDeletedIndex !== null) {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return;

        const seedData = {
          id: lastDeletedSeed.id,
          user_id: user.id,
          name: lastDeletedSeed.name,
          type: lastDeletedSeed.type,
          quantity: lastDeletedSeed.quantity,
          min_growth_time: parseInt(lastDeletedSeed.minGrowthTime.replace(' days', '')),
          max_growth_time: parseInt(lastDeletedSeed.maxGrowthTime.replace(' days', '')),
          preferred_weather: lastDeletedSeed.preferredWeather,
          info: lastDeletedSeed.info,
        };

        const { error } = await supabase
          .from('seeds')
          .insert(seedData);

        if (error) {
          throw new Error(error.message);
        }

        // Refresh seeds after undo
        await fetchSeeds();

        setLastDeletedSeed(null);
        setLastDeletedIndex(null);
        setShowUndo(false);
      } catch (error) {
        console.error('Error undoing delete:', error.message);
        Alert.alert('Error', 'Failed to undo delete.');
      }
    }
  };

  const useScrollView = height < 700;

  return (
    <ImageBackground source={require('../assets/seeds-bg.jpg')} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🌱 Seed Inventory</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search seeds..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortModalVisible(true)}>
          <Text style={styles.buttonText}>
            {sortWeather === 'Clear Sort' ? 'Sort by Weather' : `Sort: ${sortWeather}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>
            {categoryFilter === 'Clear Filter' ? 'Category' : `Category: ${categoryFilter}`}
          </Text>
        </TouchableOpacity>
      </View>

      {filteredSeeds.length === 0 ? (
        <Text style={styles.noSeedsText}>No seeds match your criteria.</Text>
      ) : (
        <FlatList
          data={filteredSeeds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.seedItem}
              onPress={() => handleSeedPress(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.seedName}>{item.name}</Text>
              <Text style={styles.seedQuantity}>Qty: {item.quantity}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => handleOpenAddSeedModal()}>
        <Text style={styles.addButtonText}>Add Seed</Text>
      </TouchableOpacity>

      {/* Category Filter Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filter by Category</Text>
            <View style={styles.modalDivider} />
            {['Clear Filter', 'Fruit', 'Vegetable'].map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.modalOption, categoryFilter === cat && styles.selectedOption]}
                onPress={() => handleCategorySelect(cat)}
              >
                <Text style={styles.modalOptionText}>{cat}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Weather Sort Modal */}
      <Modal visible={sortModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sort by Preferred Weather</Text>
            <View style={styles.modalDivider} />
            {['Clear Sort', 'Temperate', 'Warm', 'Cool', 'Humid', 'Dry'].map(weather => (
              <TouchableOpacity
                key={weather}
                style={[styles.modalOption, sortWeather === weather && styles.selectedOption]}
                onPress={() => handleSortSelect(weather)}
              >
                <Text style={styles.modalOptionText}>{weather}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSortModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Seed Info Modal */}
      <Modal visible={seedInfoVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.seedInfoContainer}>
            {selectedSeed ? (
              <>
                <View style={styles.modalContent}>
                  <Text style={styles.infoName}>{selectedSeed.name}</Text>
                  <Text style={styles.infoText}>Quantity: {selectedSeed.quantity}</Text>
                  <Text style={styles.infoText}>Type: {selectedSeed.type}</Text>
                  <Text style={styles.infoText}>
                    Growth Time: {selectedSeed.minGrowthTime?.replace(' days', '') || 'N/A'}-
                    {selectedSeed.maxGrowthTime || 'N/A'}
                  </Text>
                  <Text style={styles.infoText}>Preferred Weather: {selectedSeed.preferredWeather}</Text>
                  <Text style={styles.infoText}>Info: {selectedSeed.info}</Text>
                  <View style={styles.infoButtons}>
                    <TouchableOpacity
                      style={[styles.infoButton, { backgroundColor: '#2E8B57' }]}
                      onPress={() => handleEditSeed(selectedSeed)}
                    >
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.infoButton, { backgroundColor: '#B22222' }]}
                      onPress={() =>
                        Alert.alert(
                          'Confirm Delete',
                          `Are you sure you want to delete ${selectedSeed.name}?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => handleDeleteSeed(selectedSeed) },
                          ]
                        )
                      }
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.infoButton, { backgroundColor: '#555' }]}
                      onPress={() => setSeedInfoVisible(false)}
                    >
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              <Text style={styles.infoText}>No seed selected</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Add/Edit Seed Modal */}
      <Modal visible={addSeedModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.addSeedModalOverlay}>
            <View style={styles.addSeedModalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{isEditing ? 'Edit Seed' : 'Add New Seed'}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setAddSeedModalVisible(false);
                    setIsEditing(false);
                    resetNewSeedInputs();
                    setSelectedSeed(null);
                  }}
                >
                </TouchableOpacity>
              </View>
              <View style={styles.modalDivider} />
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#999"
                  value={newSeedName}
                  onChangeText={setNewSeedName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={newSeedQuantity}
                  onChangeText={setNewSeedQuantity}
                />
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setTypePickerVisible(true)}
                >
                  <Text style={[styles.inputText, !newSeedType && { color: '#999' }]}>
                    {newSeedType || 'Select Type'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setWeatherPickerVisible(true)}
                >
                  <Text style={[styles.inputText, !newSeedPreferredWeather && { color: '#999' }]}>
                    {newSeedPreferredWeather || 'Select Preferred Weather'}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Min Growth Time (days)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={newSeedMinGrowthTime}
                  onChangeText={setNewSeedMinGrowthTime}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Max Growth Time (days)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={newSeedMaxGrowthTime}
                  onChangeText={setNewSeedMaxGrowthTime}
                />
                <TextInput
                  style={styles.inputMultiline}
                  placeholder="Additional Info"
                  placeholderTextColor="#999"
                  multiline
                  value={newSeedInfo}
                  onChangeText={setNewSeedInfo}
                />
              </View>
              <View style={styles.modalFooter}>
                <View style={styles.actionButtons}>
                  <View style={styles.leftButtonWrapper}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#2e8b57' }]}
                      onPress={handleSaveSeed}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Save</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rightButtonWrapper}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#B22222' }]}
                      onPress={() => {
                        setAddSeedModalVisible(false);
                        setIsEditing(false);
                        resetNewSeedInputs();
                        setSelectedSeed(null);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.actionButtonText, { color: '#fff' }]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Type Picker Modal */}
      <Modal visible={typePickerVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Seed Type</Text>
            <View style={styles.modalDivider} />
            {['Fruit', 'Vegetable'].map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.modalOption, newSeedType === type && styles.selectedOption]}
                onPress={() => handleTypeSelect(type)}
              >
                <Text style={styles.modalOptionText}>{type}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setTypePickerVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Weather Picker Modal */}
      <Modal visible={weatherPickerVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Preferred Weather</Text>
            <View style={styles.modalDivider} />
            {['Temperate', 'Warm', 'Cool', 'Humid', 'Dry'].map(weather => (
              <TouchableOpacity
                key={weather}
                style={[styles.modalOption, newSeedPreferredWeather === weather && styles.selectedOption]}
                onPress={() => handleWeatherSelect(weather)}
              >
                <Text style={styles.modalOptionText}>{weather}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setWeatherPickerVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {showUndo && (
        <View style={styles.undoContainer}>
          <Text style={styles.undoText}>Seed deleted</Text>
          <TouchableOpacity onPress={handleUndoDelete}>
            <Text style={styles.undoButtonText}>UNDO</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
}