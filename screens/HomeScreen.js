import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AsyncStorage.getItem('currentUser');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUsername(parsedUser.username);
        } else {
          setUsername(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    const focus = navigation.addListener('focus', loadUser);
    return focus;
  }, [navigation]);

  const handleLogOut = async () => {
    await AsyncStorage.removeItem('currentUser');
    setUsername(null);
    setModalVisible(false);
    Alert.alert('Logged out successfully.');
    navigation.navigate('Login');
  };

  const handleChangeUsername = () => {
    setModalVisible(false);
    navigation.navigate('ChangeUsername');
  };

  const handleChangePassword = () => {
    setModalVisible(false);
    navigation.navigate('ChangePassword');
  };

  return (
    <ImageBackground
      source={require('../assets/seeds-bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={styles.signInContainer}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="person-circle-outline" size={24} color="black" />
        <Text style={styles.signInText}>{username ? username : 'Sign In'}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {username ? `Hello, ${username}` : 'Not signed in'}
            </Text>

            {username ? (
              <>
                <TouchableOpacity
                  style={[styles.modalButton, styles.greenButton]}
                  onPress={handleChangeUsername}
                >
                  <Text style={styles.modalButtonText}>Change Username</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.greenButton]}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.modalButtonText}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.logOutButton]}
                  onPress={handleLogOut}
                >
                  <Text style={styles.modalButtonText}>Log Out</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('Login');
                }}
              >
                <Text style={styles.modalButtonText}>Sign In</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#4682B4',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  logOutButton: {
    backgroundColor: '#B22222',
  },
  cancelButton: {
    backgroundColor: '#eee',
    marginTop: 15,
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  greenButton: {
    backgroundColor: '#32CD32',
  },
});
