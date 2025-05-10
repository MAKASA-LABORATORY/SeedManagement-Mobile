import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext'; // Assumes you're using a UserContext

export default function HomeScreen() {
  const navigation = useNavigation();
  const { username } = useUser();

  return (
    <ImageBackground
      source={require('../assets/seeds-bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Sign In Container */}
      <TouchableOpacity
        style={styles.signInContainer}
        onPress={() => navigation.navigate(username ? 'Home' : 'SignUp')}
      >
        <Ionicons name="person-circle-outline" size={24} color="black" />
        <Text style={styles.signInText}>{username ? username : 'Sign In'}</Text>
      </TouchableOpacity>

      {/* Center Menu */}
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
