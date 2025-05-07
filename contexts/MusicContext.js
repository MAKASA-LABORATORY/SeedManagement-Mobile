import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const toggleMusic = async () => {
    if (isMusicPlaying) {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsMusicPlaying(false);
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/music.mp3')
      );
      soundRef.current = sound;
      await sound.setIsLoopingAsync(true);
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
