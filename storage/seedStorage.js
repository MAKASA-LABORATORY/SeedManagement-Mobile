// storage/seedStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
const SEED_STORAGE_KEY = 'userSeeds';

export const saveSeedsToStorage = async (seeds) => {
  try {
    const json = JSON.stringify(seeds);
    await AsyncStorage.setItem(SEED_STORAGE_KEY, json);
  } catch (e) {
    console.error('Error saving seeds:', e);
  }
};

export const loadSeedsFromStorage = async () => {
  try {
    const json = await AsyncStorage.getItem(SEED_STORAGE_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Error loading seeds:', e);
    return null;
  }
};
