// contexts/SeedsContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SeedsContext = createContext();

export const SeedsProvider = ({ children }) => {
  const [seeds, setSeeds] = useState([]);

  // Load seeds from AsyncStorage on mount
  useEffect(() => {
    const loadSeeds = async () => {
      try {
        const storedSeeds = await AsyncStorage.getItem('seeds');
        setSeeds(storedSeeds ? JSON.parse(storedSeeds) : []);
      } catch (e) {
        console.error('Failed to load seeds', e);
      }
    };
    loadSeeds();
  }, []);

  // Update seeds both in state and AsyncStorage
  const updateSeeds = async (newSeeds) => {
    try {
      setSeeds(newSeeds);
      await AsyncStorage.setItem('seeds', JSON.stringify(newSeeds));
    } catch (e) {
      console.error('Failed to save seeds', e);
    }
  };

  return (
    <SeedsContext.Provider value={{ seeds, updateSeeds }}>
      {children}
    </SeedsContext.Provider>
  );
};
