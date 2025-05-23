// components/BackgroundWrapper.js
import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

export default function BackgroundWrapper({ children, overlay }) {
  return (
    <ImageBackground
      source={require('../assets/seeds-bg.jpg')} // Ensure it's .jpg
      style={styles.background}
      resizeMode="cover"
    >
      {overlay && <View style={styles.overlay} />}
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // White overlay with opacity
  },
});
