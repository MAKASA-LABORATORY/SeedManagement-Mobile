import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import BackgroundWrapper from '../components/BackgroundWrapper';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError) throw profileError;

          setUserData({
            email: user.email,
            username: profile?.username || user.email.split('@')[0],
            avatar_url: profile?.avatar_url || 'https://via.placeholder.com/100',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchAvatars = async () => {
    const { data, error } = await supabase.from('avatars').select('*');
    if (error) {
      console.error('Failed to fetch avatars:', error.message);
    } else {
      setAvatarOptions(data);
    }
  };

  const handleAvatarPress = () => {
    setAvatarModalVisible(true);
    fetchAvatars();
  };

  const handleAvatarSelect = async (avatarUrl) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;

      setUserData(prev => ({ ...prev, avatar_url: avatarUrl }));
      setAvatarModalVisible(false);
    } catch (err) {
      console.error('Error updating avatar:', err.message);
      Alert.alert('Error', 'Failed to update avatar.');
    }
  };

  const handleLogOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        Alert.alert('Error', 'Failed to log out. Please try again.');
      } else {
        Alert.alert('Logged out successfully.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <BackgroundWrapper overlay={true}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Profile</Text>
        </View>

        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleAvatarPress}>
            <Image
              source={{ uri: userData?.avatar_url || 'https://via.placeholder.com/100' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{userData?.username || 'User'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userData?.email || 'N/A'}</Text>

          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{userData?.username || 'N/A'}</Text>

          <Text style={styles.label}>Password</Text>
          <Text style={styles.value}>******</Text>
        </View>

        <TouchableOpacity style={styles.logOutButton} onPress={handleLogOut}>
          <Text style={styles.logOutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Avatar Picker Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={avatarModalVisible}
          onRequestClose={() => setAvatarModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select an Avatar</Text>
              <ScrollView horizontal>
                {avatarOptions.map((avatar) => (
                  <TouchableOpacity key={avatar.id} onPress={() => handleAvatarSelect(avatar.url)}>
                    <Image source={{ uri: avatar.url }} style={styles.modalAvatar} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
                <Text style={styles.modalClose}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#1f2937',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#60a5fa',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#1f2937',
    marginTop: 2,
    paddingLeft: 4,
  },
  logOutButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  logOutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  modalClose: {
    marginTop: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ProfileScreen;
