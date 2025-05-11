import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUsername(parsedUser.username);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    const focus = navigation.addListener('focus', loadUser);
    return focus;
  }, [navigation]);

  const handlePress = () => {
    if (username) {
      Alert.alert(
        `Logged in as ${username}`,
        'Do you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            onPress: async () => {
              await AsyncStorage.removeItem('user');
              setUsername(null);
              Alert.alert('Logged out successfully.');
            },
          },
        ]
      );
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/seeds-bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.signInContainer} onPress={handlePress}>
        <Ionicons name="person-circle-outline" size={24} color="black" />
        <Text style={styles.signInText}>{username ? username : 'Sign In'}</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inventory')}>
          <Text style={styles.text}>INVENTORY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Calendar')}>
          <Text style={styles.text}>CALENDAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Logs')}>
          <Text style={styles.text}>LOGS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.text}>SETTINGS</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  signInContainer: {
    position: 'absolute',
    top: 50,
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
    padding: 20,
  },
  button: {
    backgroundColor: '#6EC1E4',
    padding: 20,
    marginVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
