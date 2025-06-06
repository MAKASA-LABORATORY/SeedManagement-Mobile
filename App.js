import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ChangeUsername from './screens/ChangeUsername';
import ChangePassword from './screens/ChangePassword';
import Inventory from './screens/Inventory';
import Calendar from './screens/Calendar';
import Logs from './screens/Logs';
import Settings from './screens/Settings';
import WikiScreen from './screens/WikiScreen';          // <-- new
import { LogProvider } from './contexts/LogContext';
import { MusicProvider } from './contexts/MusicContext';
import { supabase } from './config/supabaseClient';
import WelcomeScreen from './screens/WelcomeScreen';
import SeedDetailScreen from './screens/SeedDetailScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);
    };

    initializeSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <MusicProvider>
      <LogProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ChangeUsername" component={ChangeUsername} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="Inventory" component={Inventory} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="Logs" component={Logs} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Wiki" component={WikiScreen} />
            <Stack.Screen name="SeedDetail" component={SeedDetailScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LogProvider>
    </MusicProvider>
  );
}
