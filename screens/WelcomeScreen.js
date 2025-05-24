import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import * as Animatable from 'react-native-animatable';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { welcomeStyles } from '../styles/stylesW';

export default function WelcomeScreen({ navigation }) {
  const welcomeTextRef = useRef(null);
  const loadingBarWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate loading bar width once from 0 to 100%
    Animated.timing(loadingBarWidth, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      // After animation completes, navigate to Home screen
      navigation.replace('Home');
    });

    return () => {
      loadingBarWidth.stopAnimation();
    };
  }, [loadingBarWidth, navigation]);

  // Interpolate loading bar width from 0 to full width (100%)
  const loadingBarAnimatedStyle = {
    width: loadingBarWidth.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };

  return (
    <BackgroundWrapper overlay>
      <View style={welcomeStyles.container}>
        <Animatable.Text
          ref={welcomeTextRef}
          animation="fadeIn"
          duration={1000} // Fade in over 1 second
          style={welcomeStyles.welcomeText}
        >
          Welcome to SeedM
        </Animatable.Text>
        <View style={welcomeStyles.loadingBarContainer}>
          <Animated.View style={[welcomeStyles.loadingBarFill, loadingBarAnimatedStyle]} />
        </View>
      </View>
    </BackgroundWrapper>
  );
}
