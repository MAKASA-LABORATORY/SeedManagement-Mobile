import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  ImageBackground,
} from 'react-native';

export default function LoadingScreen({ navigation, route }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate loading bar
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      // After animation, navigate to Home and pass user if needed
      const user = route.params?.user;
      navigation.replace('Home', { user });
    });
  }, [navigation, progress, route.params]);

  const loadingBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ImageBackground
      source={require('../assets/Login-bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome!</Text>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingBarBackground}>
            <Animated.View
              style={[styles.loadingBar, { width: loadingBarWidth }]}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 60,
  },
welcomeText: {
  fontSize: 32,
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#FFFFFF', // white text
  textShadowColor: '#000000', // black outline
  textShadowOffset: { width: 1.5, height: 1.5 },
  textShadowRadius: 2,
},

  loadingContainer: {
    justifyContent: 'flex-end',
  },
  loadingBarBackground: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  loadingBar: {
    height: 6,
    backgroundColor: '#4682B4',
  },
});
