import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangeUsername({ navigation }) {
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [storedUsername, setStoredUsername] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await AsyncStorage.getItem('currentUser');
        if (user) {
          const parsed = JSON.parse(user);
          setStoredUsername(parsed.username);
          setCurrentUsername(parsed.username);
        }
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    };
    loadCurrentUser();
  }, []);

  const handleChangeUsername = async () => {
    if (!currentUsername || !newUsername) {
      Alert.alert('Please fill in both fields.');
      return;
    }

    if (currentUsername !== storedUsername) {
      Alert.alert('Current username does not match logged-in user.');
      return;
    }

    if (currentUsername === newUsername) {
      Alert.alert('New username must be different.');
      return;
    }

    try {
      const usersJSON = await AsyncStorage.getItem('users');
      let users = usersJSON ? JSON.parse(usersJSON) : [];

      const usernameExists = users.some(u => u.username === newUsername);
      if (usernameExists) {
        Alert.alert('This new username is already taken.');
        return;
      }

      users = users.map(u =>
        u.username === currentUsername ? { ...u, username: newUsername } : u
      );

      await AsyncStorage.setItem('users', JSON.stringify(users));

      await AsyncStorage.setItem(
        'currentUser',
        JSON.stringify({ username: newUsername })
      );

      Alert.alert('Username changed successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error changing username:', error);
      Alert.alert('An error occurred. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../assets/Login-bg.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Change Username</Text>

          <TextInput
            style={styles.input}
            placeholder="Current Username"
            value={currentUsername}
            onChangeText={setCurrentUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="New Username"
            value={newUsername}
            onChangeText={setNewUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity style={styles.button} onPress={handleChangeUsername}>
            <Text style={styles.buttonText}>Change Username</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    padding: 25,
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#bbb',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4682B4',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  cancelButtonText: {
    color: '#555',
  },
});
