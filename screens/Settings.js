import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { settingsStyles } from '../styles/stylesS';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { supabase } from '../config/supabaseClient';
import { useMusic } from '../contexts/MusicContext';

export default function SettingsScreen() {
  const { isMusicPlaying, toggleMusic } = useMusic();

  const clearLogs = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      const { error: logError } = await supabase
        .from('logs')
        .delete()
        .eq('user_id', user.id);

      if (logError) throw logError;

      const { error: plantedError } = await supabase
        .from('planted_dates')
        .delete()
        .eq('user_id', user.id);

      if (plantedError) throw plantedError;

      Alert.alert('Success', 'Logs and calendar events cleared!');
    } catch (error) {
      console.error('Failed to clear data:', error.message);
      Alert.alert('Error', 'Failed to clear logs and calendar events.');
    }
  };

  return (
    <BackgroundWrapper overlay>
      <View style={settingsStyles.container}>
        <View style={settingsStyles.header}>
          <MaterialIcons name="settings" size={24} color="black" style={settingsStyles.headerIcon} />
          <Text style={settingsStyles.title}>Settings</Text>
        </View>

        <View style={settingsStyles.buttonContainer}>
          <TouchableOpacity style={settingsStyles.button} onPress={clearLogs}>
            <Text style={settingsStyles.buttonText}>Clear Logs & Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={settingsStyles.button} onPress={toggleMusic}>
            <View style={settingsStyles.buttonContent}>
              <Text style={settingsStyles.buttonText}>Music</Text>
              <MaterialIcons
                name={isMusicPlaying ? 'volume-up' : 'volume-off'}
                size={20}
                color="#fff"
                style={settingsStyles.musicIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </BackgroundWrapper>
  );
}