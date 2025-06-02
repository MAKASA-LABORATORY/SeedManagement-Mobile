import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

export default function BackgroundWrapper({ children, overlay }) {
  console.log('BackgroundWrapper rendering with overlay:', overlay); // Debugging log
  return (
    <ImageBackground
      source={require('../assets/seedbg.jpg')} // Adjust path if needed
      style={styles.background}
      resizeMode="cover"
      onError={(error) => console.log('ImageBackground error:', error.nativeEvent.error)} // Error handling
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