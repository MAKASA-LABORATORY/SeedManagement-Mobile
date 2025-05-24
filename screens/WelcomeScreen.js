import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { welcomeStyles } from '../styles/stylesW';

export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      // Fade out animation
      if (welcomeTextRef.current) {
        welcomeTextRef.current.fadeOut(1000).then(() => {
          navigation.replace('Home'); // Navigate after fade out
        });
      }
    }, 2000); // Wait 2 seconds (1s fade in + 1s visible) before fading out

    return () => clearTimeout(fadeOutTimer);
  }, [navigation]);

  let welcomeTextRef = React.useRef(null);

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
      </View>
    </BackgroundWrapper>
  );
}