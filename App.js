import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { LogProvider } from './contexts/LogContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MusicProvider } from './contexts/MusicContext'; // Add this

export default function App() {
  return (
    <LogProvider>
      <ThemeProvider>
        <MusicProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </MusicProvider>
      </ThemeProvider>
    </LogProvider>
  );
}
