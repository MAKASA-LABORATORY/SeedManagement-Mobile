import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import { styles } from './styles';
import { seeds as initialSeeds } from './seeds';

export default function InventoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Clear Filter'); // 'Clear Filter', 'Fruit', 'Vegetable'
  const [sortWeather, setSortWeather] = useState('Clear Sort'); // 'Clear Sort', 'Temperate', 'Warm', 'Cool', 'Humid', 'Dry'
  const [modalVisible, setModalVisible] = useState(false); // For category modal
  const [sortModalVisible, setSortModalVisible] = useState(false); // For sort modal
  const [seedInfoVisible, setSeedInfoVisible] = useState(false); // For seed info modal
  const [addSeedModalVisible, setAddSeedModalVisible] = useState(false); // For add/edit seed modal
  const [typePickerVisible, setTypePickerVisible] = useState(false); // For custom type dropdown
  const [weatherPickerVisible, setWeatherPickerVisible] = useState(false); // For custom weather dropdown
  const [selectedSeed, setSelectedSeed] = useState(null); // Store selected seed for info/edit
  const [seeds, setSeeds] = useState(initialSeeds); // Local state for seeds
  const [isEditing, setIsEditing] = useState(false); // Track if editing or adding
  const [lastDeletedSeed, setLastDeletedSeed] = useState(null); // Store last deleted seed for undo
  const [lastDeletedIndex, setLastDeletedIndex] = useState(null); // Store index for undo
  const [showUndo, setShowUndo] = useState(false); // Control undo message visibility

  // State for new/edit seed inputs
  const [newSeedName, setNewSeedName] = useState('');
  const [newSeedQuantity, setNewSeedQuantity] = useState('');
  const [newSeedType, setNewSeedType] = useState(''); // Default type empty for placeholder
  const [newSeedTimeOfGrowth, setNewSeedTimeOfGrowth] = useState(''); // Numeric input
  const [newSeedPreferredWeather, setNewSeedPreferredWeather] = useState(''); // Default weather empty for placeholder
  const [newSeedInfo, setNewSeedInfo] = useState('');

  // Filter seeds by search query and category
  let filteredSeeds = seeds.filter(seed =>
    seed.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (categoryFilter !== 'Clear Filter') {
    filteredSeeds = filteredSeeds.filter(seed => seed.type === categoryFilter);
  }

  // Filter seeds by selected weather if not 'Clear Sort'
  if (sortWeather !== 'Clear Sort') {
    filteredSeeds = filteredSeeds.filter(seed => seed.preferredWeather === sortWeather);
  } else {
    // Sort by name (A-Z) when no weather filter is applied
    filteredSeeds = [...filteredSeeds].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Handle category selection from modal
  const handleCategorySelect = (category) => {
    setCategoryFilter(category);
    setModalVisible(false); // Close modal after selection
  };

  // Handle sort selection from modal
  const handleSortSelect = (weather) => {
    setSortWeather(weather);
    setSortModalVisible(false); // Close modal after selection
  };

  // Handle seed info display
  const handleSeedPress = (seed) => {
    setSelectedSeed(seed);
    setSeedInfoVisible(true); // Open seed info modal
  };

  // Handle type selection from custom dropdown
  const handleTypeSelect = (type) => {
    setNewSeedType(type);
    setTypePickerVisible(false);
  };

  // Handle weather selection from custom dropdown
  const handleWeatherSelect = (weather) => {
    setNewSeedPreferredWeather(weather);
    setWeatherPickerVisible(false);
  };

  // Handle opening the modal for adding a new seed
  const handleOpenAddSeedModal = () => {
    setIsEditing(false);
    setNewSeedName('');
    setNewSeedQuantity('');
    setNewSeedType('');
    setNewSeedTimeOfGrowth('');
    setNewSeedPreferredWeather('');
    setNewSeedInfo('');
    setAddSeedModalVisible(true);
  };

  // Handle opening the modal for editing a seed
  const handleEditSeed = (seed) => {
    setIsEditing(true);
    setSelectedSeed(seed);
    setNewSeedName(seed.name);
    setNewSeedQuantity(seed.quantity.toString());
    setNewSeedType(seed.type);
    setNewSeedTimeOfGrowth(seed.timeOfGrowth.replace(' days', '')); // Remove "days" for editing
    setNewSeedPreferredWeather(seed.preferredWeather);
    setNewSeedInfo(seed.info);
    setSeedInfoVisible(false); // Close info modal
    setAddSeedModalVisible(true); // Open edit modal
  };

  // Handle adding or editing a seed
  const handleSaveSeed = () => {
    if (!newSeedName || !newSeedQuantity || !newSeedType || !newSeedTimeOfGrowth || !newSeedPreferredWeather || !newSeedInfo) {
      alert('Please fill in all fields.');
      return;
    }

    const seedData = {
      name: newSeedName,
      type: newSeedType,
      quantity: parseInt(newSeedQuantity, 10),
      timeOfGrowth: `${newSeedTimeOfGrowth} days`,
      preferredWeather: newSeedPreferredWeather,
      info: newSeedInfo,
    };

    if (isEditing) {
      // Update existing seed
      const updatedSeeds = seeds.map(seed =>
        seed.id === selectedSeed.id ? { ...seed, ...seedData } : seed
      );
      setSeeds(updatedSeeds);
    } else {
      // Add new seed
      const newSeed = {
        id: (seeds.length + 1).toString(),
        ...seedData,
      };
      setSeeds([...seeds, newSeed]);
    }

    // Reset input fields and close modal
    setNewSeedName('');
    setNewSeedQuantity('');
    setNewSeedType('');
    setNewSeedTimeOfGrowth('');
    setNewSeedPreferredWeather('');
    setNewSeedInfo('');
    setAddSeedModalVisible(false);
    setIsEditing(false);
    setSelectedSeed(null);
  };

  // Handle deleting a seed
  const handleDeleteSeed = (seed) => {
    const index = seeds.findIndex(s => s.id === seed.id);
    setLastDeletedSeed(seed);
    setLastDeletedIndex(index);
    const updatedSeeds = seeds.filter(s => s.id !== seed.id);
    setSeeds(updatedSeeds);
    setSeedInfoVisible(false);
    setShowUndo(true);

    // Auto-hide undo message after 5 seconds
    setTimeout(() => {
      setShowUndo(false);
      setLastDeletedSeed(null);
      setLastDeletedIndex(null);
    }, 5000);
  };

  // Handle undoing a deletion
  const handleUndoDelete = () => {
    if (lastDeletedSeed && lastDeletedIndex !== null) {
      const updatedSeeds = [...seeds];
      updatedSeeds.splice(lastDeletedIndex, 0, lastDeletedSeed);
      setSeeds(updatedSeeds);
      setLastDeletedSeed(null);
      setLastDeletedIndex(null);
      setShowUndo(false);
    }
  };

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
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {sortWeather === 'Clear Sort' ? 'Sort by Weather' : `Sort: ${sortWeather}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {categoryFilter === 'Clear Filter' ? 'Category' : `Category: ${categoryFilter}`}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredSeeds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSeedPress(item)}
            style={styles.seedItem}
          >
            <View style={styles.seedContent}>
              <Text style={styles.seedText}>{item.name}</Text>
              <Text style={styles.seedDetail}>Qty: {item.quantity}</Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.seedList}
        ListEmptyComponent={<Text style={styles.noSeedsText}>No seeds found for this weather</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleOpenAddSeedModal}
      >
        <Text style={styles.addButtonText}>Add Seed</Text>
      </TouchableOpacity>

      {/* Undo message */}
      {showUndo && (
        <View style={styles.undoContainer}>
          <Text style={styles.undoText}>Seed deleted.</Text>
          <TouchableOpacity onPress={handleUndoDelete}>
            <Text style={styles.undoButtonText}>Undo?</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for category selection */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleCategorySelect('Clear Filter')}
            >
              <Text style={styles.modalOptionText}>Clear Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleCategorySelect('Fruit')}
            >
              <Text style={styles.modalOptionText}>Fruit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleCategorySelect('Vegetable')}
            >
              <Text style={styles.modalOptionText}>Vegetable</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for sort selection */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSortSelect('Clear Sort')}
            >
              <Text style={styles.modalOptionText}>Clear Sort</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSortSelect('Temperate')}
            >
              <Text style={styles.modalOptionText}>Temperate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSortSelect('Warm')}
            >
              <Text style={styles.modalOptionText}>Warm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSortSelect('Cool')}
            >
              <Text style={styles.modalOptionText}>Cool</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSortSelect('Humid')}
            >
              <Text style={styles.modalOptionText}>Humid</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSortSelect('Dry')}
            >
              <Text style={styles.modalOptionText}>Dry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for seed info */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={seedInfoVisible}
        onRequestClose={() => setSeedInfoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSeed && (
              <>
                <Text style={styles.modalTitle}>{selectedSeed.name}</Text>
                <Text style={styles.expandedDetail}>Type: {selectedSeed.type}</Text>
                <Text style={styles.expandedDetail}>Time of Growth: {selectedSeed.timeOfGrowth}</Text>
                <Text style={styles.expandedDetail}>Quantity: {selectedSeed.quantity}</Text>
                <Text style={styles.expandedDetail}>Preferred Weather: {selectedSeed.preferredWeather}</Text>
                <Text style={styles.expandedDetail}>Info: {selectedSeed.info}</Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalEditButton}
                    onPress={() => handleEditSeed(selectedSeed)}
                  >
                    <Text style={styles.modalEditText}>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDeleteButton}
                    onPress={() => handleDeleteSeed(selectedSeed)}
                  >
                    <Text style={styles.modalDeleteText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setSeedInfoVisible(false)}
                  >
                    <Text style={styles.modalCloseText}>✖️ Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal for adding or editing a seed */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={addSeedModalVisible}
        onRequestClose={() => setAddSeedModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Seed' : 'Add New Seed'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Seed Name"
              placeholderTextColor="#999"
              value={newSeedName}
              onChangeText={setNewSeedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              placeholderTextColor="#999"
              value={newSeedQuantity}
              onChangeText={setNewSeedQuantity}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.customPicker}
              onPress={() => setTypePickerVisible(true)}
            >
              <Text style={[styles.customPickerText, !newSeedType && styles.placeholderText]}>
                {newSeedType || 'Type'}
              </Text>
            </TouchableOpacity>
            <View style={styles.inputWithSuffix}>
              <TextInput
                style={styles.inputText}
                placeholder="Time of Growth"
                placeholderTextColor="#999"
                value={newSeedTimeOfGrowth}
                onChangeText={setNewSeedTimeOfGrowth}
                keyboardType="numeric"
              />
              <Text style={styles.inputSuffix}>days</Text>
            </View>
            <TouchableOpacity
              style={styles.customPicker}
              onPress={() => setWeatherPickerVisible(true)}
            >
              <Text style={[styles.customPickerText, !newSeedPreferredWeather && styles.placeholderText]}>
                {newSeedPreferredWeather || 'Preferred Weather'}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Info"
              placeholderTextColor="#999"
              value={newSeedInfo}
              onChangeText={setNewSeedInfo}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setAddSeedModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleSaveSeed}
              >
                <Text style={styles.modalAddText}>{isEditing ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for type selection */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={typePickerVisible}
        onRequestClose={() => setTypePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleTypeSelect('Fruit')}
            >
              <Text style={styles.modalOptionText}>Fruit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleTypeSelect('Vegetable')}
            >
              <Text style={styles.modalOptionText}>Vegetable</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for weather selection */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={weatherPickerVisible}
        onRequestClose={() => setWeatherPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleWeatherSelect('Temperate')}
            >
              <Text style={styles.modalOptionText}>Temperate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleWeatherSelect('Warm')}
            >
              <Text style={styles.modalOptionText}>Warm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleWeatherSelect('Cool')}
            >
              <Text style={styles.modalOptionText}>Cool</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleWeatherSelect('Humid')}
            >
              <Text style={styles.modalOptionText}>Humid</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleWeatherSelect('Dry')}
            >
              <Text style={styles.modalOptionText}>Dry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}