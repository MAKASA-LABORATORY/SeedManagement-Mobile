import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../config/supabaseClient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangeUsername({ navigation }) {
  const [newUsername, setNewUsername] = useState('');

  const handleChangeUsername = async () => {
    try {
      if (!newUsername) {
        Alert.alert('Error', 'Please enter a new username.');
        return;
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error(authError?.message || 'No user logged in.');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: newUsername })
        .eq('id', user.id);

      if (profileError) {
        throw new Error(profileError.message);
      }

      Alert.alert('Success', 'Username updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Change username error:', error.message);
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Change Username</Text>
        <TextInput
          style={styles.input}
          placeholder="New Username"
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleChangeUsername}>
          <Text style={styles.buttonText}>Update Username</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fafafa',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4682B4',
    borderRadius: 10,
    paddingVertical: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#4682B4',
    fontSize: 16,
  },
});