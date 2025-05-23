import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    // Load the music when component mounts
    loadMusic();

    // Cleanup when unmounting
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Load sound async function
  const loadMusic = async () => {
    try {
      const { sound: loadedSound } = await Audio.Sound.createAsync(
        require('../assets/Pvs.mp3'), // update path if needed
        { shouldPlay: false, isLooping: true }
      );
      setSound(loadedSound);
    } catch (error) {
      console.log('Error loading sound:', error);
    }
  };

  // Toggle play/pause music
  const toggleMusic = async () => {
    if (!sound) return;

    try {
      if (isMusicPlaying) {
        await sound.pauseAsync();
        setIsMusicPlaying(false);
      } else {
        await sound.playAsync();
        setIsMusicPlaying(true);
      }
    } catch (error) {
      console.log('Error toggling music:', error);
    }
  };

  return (
    <MusicContext.Provider value={{ isMusicPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
