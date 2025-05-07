import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { LogProvider } from './contexts/LogContext';
import { MusicProvider } from './contexts/MusicContext'; // Add this

export default function App() {
  return (
    <LogProvider>
        <MusicProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </MusicProvider>
    </LogProvider>
  );
}
