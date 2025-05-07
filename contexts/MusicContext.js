import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    loadMusic();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadMusic = async () => {
    const { sound: loadedSound } = await Audio.Sound.createAsync(
      require('../assets/music.mp3'), // path to your music file
      { shouldPlay: false, isLooping: true }
    );
    setSound(loadedSound);
  };

  const toggleMusic = async () => {
    if (!sound) return;

    if (isMusicPlaying) {
      await sound.pauseAsync();
      setIsMusicPlaying(false);
    } else {
      await sound.playAsync();
      setIsMusicPlaying(true);
    }
  };

  return (
    <MusicContext.Provider value={{ isMusicPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
