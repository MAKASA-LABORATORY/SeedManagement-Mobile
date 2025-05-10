import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('All fields are required.');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      console.log('Stored user data:', userData); // Debug output

      const user = userData ? JSON.parse(userData) : null;

      if (
        user &&
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
      ) {
        setErrorMsg('');
        navigation.replace('Home');
      } else {
        setErrorMsg('Wrong credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Something went wrong. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log In</Text>
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Log In" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  link: { color: 'blue', marginTop: 10, textAlign: 'center' },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
});
