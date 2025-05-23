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
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const [fullName, setFullName] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error.message);
            setFullName(null);
          } else {
            setFullName(data?.full_name || session.user.email.split('@')[0]);
          }
        } else {
          setFullName(null);
        }
      } catch (error) {
        console.error('Error loading user:', error.message);
        setFullName(null);
      }
    };

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching profile:', error.message);
              setFullName(null);
            } else {
              setFullName(data?.full_name || session.user.email.split('@')[0]);
            }
          });
      } else {
        setFullName(null);
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
        setFullName(null);
        setModalVisible(false);
        Alert.alert('Logged out successfully.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
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
    <SafeAreaView style={styles.safeArea}>
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
          <Text style={styles.signInText}>{fullName ? fullName : 'Sign In'}</Text>
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
                {fullName ? `Hello, ${fullName}` : 'Not signed in'}
              </Text>

              {fullName ? (
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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