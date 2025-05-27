import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../config/supabaseClient';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    setErrorMessage(''); // Reset error
    setModalVisible(true); // Show modal

    try {
      if (!email || !password) {
        setErrorMessage('Please enter both email and password.');
        setModalVisible(false);
        return;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(), // Normalize email to lowercase
        password,
      });

      if (loginError) {
        setErrorMessage('Invalid email or password.');
        setModalVisible(false);
        return;
      }

      // Successful login
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Home');
      }, 2000);
    } catch (error) {
      console.error('Login error:', error.message);
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setModalVisible(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/backl.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.welcome}>Welcome Back 👋</Text>
          <Text style={styles.title}>Log In</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={(text) => setEmail(text.trim())} // Trim whitespace
            autoCapitalize="none"
          />

          {errorMessage !== '' && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#4682B4" />
              <Text style={styles.modalText}>Logging In</Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 25,
    elevation: 5,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorMessage: {
    color: '#c0392b',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4682B4',
    borderRadius: 10,
    paddingVertical: 14,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  signupLink: {
    marginTop: 12,
    alignItems: 'center',
  },
  signupText: {
    color: '#4682B4',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4682B4',
  },
});