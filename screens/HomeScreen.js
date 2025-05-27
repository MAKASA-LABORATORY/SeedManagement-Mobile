import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .maybeSingle(); // <-- changed here

          if (error) {
            console.error('Error fetching profile:', error.message);
            setUsername(null);
          } else if (data) {
            setUsername(data.username || session.user.email.split('@')[0]);
          } else {
            // no profile found, fallback to email username
            setUsername(session.user.email.split('@')[0]);
          }
        } else {
          setUsername(null);
        }
      } catch (error) {
        console.error('Error loading user:', error.message);
        setUsername(null);
      }
    };

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .maybeSingle()  // <-- changed here too
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching profile:', error.message);
              setUsername(null);
            } else if (data) {
              setUsername(data.username || session.user.email.split('@')[0]);
            } else {
              setUsername(session.user.email.split('@')[0]);
            }
          });
      } else {
        setUsername(null);
      }
    });

    const focus = navigation.addListener('focus', loadUser);

    return () => {
      authListener.subscription.unsubscribe();
      focus();
    };
  }, [navigation]);

  const handleLogOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        Alert.alert('Error', 'Failed to log out. Please try again.');
      } else {
        setUsername(null);
        Alert.alert('Logged out successfully.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/seeds-bg.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.signInContainer}
          onPress={() => {
            if (username) {
              navigation.navigate('Profile');
            } else {
              navigation.navigate('Login');
            }
          }}
        >
          <Ionicons name="person-circle-outline" size={24} color="black" />
          <Text style={styles.signInText}>{username ? username : 'Sign In'}</Text>
        </TouchableOpacity>

        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Inventory')}
          >
            <Text style={styles.text}>INVENTORY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Text style={styles.text}>CALENDAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Logs')}
          >
            <Text style={styles.text}>LOGS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.text}>SETTINGS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Wiki')}
          >
            <Text style={styles.text}>WIKI</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  signInContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffcc',
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
    elevation: 2,
  },
  signInText: {
    color: 'black',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 50,
  },
  button: {
    backgroundColor: '#6EC1E4',
    padding: 20,
    marginVertical: 8,
    borderRadius: 30,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
