import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useMusic } from '../contexts/MusicContext'; // Import music context
import { useLogs } from '../contexts/LogContext'; // Import LogContext
import { settingsStyles } from '../screens/stylesS'; // Import styles
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons for Settings icon

export default function SettingsScreen() {
  const { isMusicPlaying, toggleMusic } = useMusic(); // Use music context
  const { clearLogs } = useLogs(); // Use clearLogs function from LogContext

  return (
    <View style={settingsStyles.container}>
      <View style={settingsStyles.header}>
        <MaterialIcons name="settings" size={30} color="black" />
        <Text style={settingsStyles.title}>Settings</Text>
      </View>

      {/* Music Toggle */}
      <View style={settingsStyles.toggleContainer}>
        <Text style={settingsStyles.toggleLabel}>Music</Text>
        <Switch value={isMusicPlaying} onValueChange={toggleMusic} />
      </View>

      {/* Clear Logs Button */}
      <TouchableOpacity style={settingsStyles.clearLogsButton} onPress={clearLogs}>
        <Text style={settingsStyles.clearLogsText}>Clear Logs</Text>
      </TouchableOpacity>
    </View>
  );
}
