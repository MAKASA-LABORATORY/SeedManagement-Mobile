import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { LogProvider } from './contexts/LogContext';
import { MusicProvider } from './contexts/MusicContext';
import { UserProvider } from './contexts/UserContext';

export default function App() {
  return (
    <UserProvider>
      <LogProvider>
        <MusicProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </MusicProvider>
      </LogProvider>
    </UserProvider>
  );
}
