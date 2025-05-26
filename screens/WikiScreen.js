import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../config/supabaseClient';

// Fallback image (replace with your local asset if available)
const FALLBACK_IMAGE = 'https://via.placeholder.com/50';

export default function WikiScreen() {
  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getSeeds = async () => {
      setLoading(true);
      try {
        // Fetch vegetable and fruit seeds in parallel
        const [vegResult, fruitResult] = await Promise.all([
          supabase.from('vegetable_seeds').select('*'),
          supabase.from('fruit_seeds').select('*'),
        ]);

        const { data: vegData, error: vegError } = vegResult;
        const { data: fruitData, error: fruitError } = fruitResult;

        if (vegError) throw vegError;
        if (fruitError) throw fruitError;

        // Combine data from both tables and add category
        const combinedSeeds = [
          ...(vegData || []).map((item) => ({ ...item, category: 'Vegetable' })),
          ...(fruitData || []).map((item) => ({ ...item, category: 'Fruit' })),
        ];

        // Sort combined data by name ascending
        combinedSeeds.sort((a, b) => a.name.localeCompare(b.name));

        setSeeds(combinedSeeds);
      } catch (error) {
        console.error('Error fetching seeds:', error.message);
        Alert.alert('Error', 'Failed to load seeds. Please try again later.');
        setSeeds([]);
      } finally {
        setLoading(false);
      }
    };

    getSeeds();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.seedContainer}
      onPress={() => navigation.navigate('SeedDetail', { seed: item })}
    >
      <View style={styles.listContainer}>
        <Image
          source={{ uri: item.image_url || FALLBACK_IMAGE }}
          style={styles.iconImage}
          resizeMode="contain"
          onError={(error) => {
            console.log(`Failed to load image for ${item.name}:`, error.nativeEvent.error);
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.seedName}>{item.name}</Text>
          <Text style={styles.seedType}>{item.type && item.type !== item.category ? `${item.type}` : item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00AA00" />
        <Text style={styles.loadingText}>Loading Seeds...</Text>
      </View>
    );
  }

  if (seeds.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No seeds found. Please try again later.</Text>
      </View>
    );
  }

  // Filter seeds based on filter
  const filteredSeeds = filter === 'All' ? seeds : seeds.filter(seed => seed.category === filter);

  // Function to handle filter selection
  const selectFilter = (selected) => {
    setFilter(selected);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seed Wiki</Text>
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.categoryButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredSeeds}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}-${item.category}`}
        contentContainerStyle={styles.flatListContent}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {['All', 'Fruit', 'Vegetable'].map((option) => (
              <Pressable
                key={option}
                style={styles.modalOption}
                onPress={() => selectFilter(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </Pressable>
            ))}
            <Pressable
              style={[styles.modalOption, styles.modalCancel]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#green',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#black',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00AA00',
    marginHorizontal: 10,
    backgroundColor: '#fff',
  },
  categoryButtonActive: {
    backgroundColor: '#00AA00',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#00AA00',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  seedContainer: {
    marginBottom: 10,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  iconImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    backgroundColor: '#ccc', // Placeholder background
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  seedName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seedType: {
    fontSize: 14,
    color: '#666',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    marginHorizontal: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#00AA00',
  },
  modalCancel: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  modalCancelText: {
    fontSize: 18,
    color: '#999',
  },
});

