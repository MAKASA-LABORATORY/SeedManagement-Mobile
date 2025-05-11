import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';  // Import StackNavigator
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogProvider } from './contexts/LogContext';
import { MusicProvider } from './contexts/MusicContext';
import { UserProvider } from './contexts/UserContext';

export default function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username);
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <UserProvider>
      <LogProvider>
        <MusicProvider>
          <NavigationContainer>
            <StackNavigator username={username} />
          </NavigationContainer>
        </MusicProvider>
      </LogProvider>
    </UserProvider>
  );
}