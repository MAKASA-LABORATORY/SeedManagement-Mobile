// SettingsScreen.js
import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useMusic } from '../contexts/MusicContext';
import { useLogs } from '../contexts/LogContext';
import { settingsStyles } from '../screens/stylesS';
import { MaterialIcons } from '@expo/vector-icons';
import BackgroundWrapper from '../components/BackgroundWrapper'; // Import the background wrapper

export default function SettingsScreen() {
  const { isMusicPlaying, toggleMusic } = useMusic();
  const { clearLogs } = useLogs();

  return (
    <BackgroundWrapper overlay>
      <View style={settingsStyles.container}>
        <View style={settingsStyles.header}>
          <MaterialIcons name="settings" size={30} color="black" />
          <Text style={settingsStyles.title}>Settings</Text>
        </View>

        <View style={settingsStyles.toggleContainer}>
          <Text style={settingsStyles.toggleLabel}>Music</Text>
          <Switch value={isMusicPlaying} onValueChange={toggleMusic} />
        </View>

        <TouchableOpacity style={settingsStyles.clearLogsButton} onPress={clearLogs}>
          <Text style={settingsStyles.clearLogsText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>
    </BackgroundWrapper>
  );
}
