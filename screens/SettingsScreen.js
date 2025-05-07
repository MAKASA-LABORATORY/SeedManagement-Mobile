import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useMusic } from '../contexts/MusicContext'; // Import music context

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isMusicPlaying, toggleMusic } = useMusic(); // Use music context

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Settings</Text>

      {/* Dark Mode Toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 18, marginRight: 10 }}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      {/* Music Toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginRight: 10 }}>Music</Text>
        <Switch value={isMusicPlaying} onValueChange={toggleMusic} />
      </View>
    </View>
  );
}
