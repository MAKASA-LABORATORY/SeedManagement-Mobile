import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // For responsive sizing

export default function SeedDetailScreen({ route }) {
  const { seed } = route.params;

  return (
    <ScrollView style={styles.detailContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={
            seed.image_url
              ? { uri: seed.image_url }
              : { uri: 'https://placehold.co/300x300' }
          }
          style={styles.detailImage}
          resizeMode="contain"
          onError={(error) => console.log(`Failed to load detail image for ${seed.name}:`, error.nativeEvent.error)}
        />
      </View>
      <View style={styles.infoTable}>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{seed.name}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{seed.category || 'N/A'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{seed.type || 'N/A'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Preferred Weather:</Text>
          <Text style={styles.value}>{seed.preferred_weather || 'N/A'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Growth Time:</Text>
          <Text style={styles.value}>
            {seed.min_growth || '?'} – {seed.max_growth || '?'} days
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Info:</Text>
          <Text style={styles.value}>{seed.info || 'No additional information.'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // General Container Styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  // Text Styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
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
    paddingHorizontal: 20,
  },

  // Seed List Item Styles
  seedContainer: {
    marginBottom: 10,
  },
  seedItem: {
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

  // FlatList Content
  flatListContent: {
    paddingBottom: 20,
  },

  // Seed Detail Screen Styles
  detailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20, // Simplified marginTop and marginBottom
  },
  detailImage: {
    width: width * 0.8, // Responsive width (80% of screen width)
    height: width * 0.8, // Maintain aspect ratio
    borderRadius: 8,
    backgroundColor: '#ccc', // Placeholder background
  },
  infoTable: {
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: width * 0.3, // Responsive width for labels
  },
  value: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
});