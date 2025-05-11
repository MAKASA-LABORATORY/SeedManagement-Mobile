// LogsScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLogs } from '../contexts/LogContext';
import { calculateHarvestDate } from './utils';
import { MaterialIcons } from '@expo/vector-icons';
import { logStyles } from './stylesL';
import BackgroundWrapper from '../components/BackgroundWrapper'; // Import the background wrapper

export default function LogsScreen() {
  const { logs } = useLogs();
  const [expandedLog, setExpandedLog] = useState(null);

  const handleLogClick = (log) => {
    setExpandedLog(expandedLog === log ? null : log);
  };

  return (
    <BackgroundWrapper overlay>
      <View style={logStyles.container}>
        <View style={logStyles.header}>
          <MaterialIcons name="history" size={24} color="black" style={logStyles.headerIcon} />
          <Text style={logStyles.title}>Logs</Text>
        </View>

        {logs.length === 0 ? (
          <Text style={logStyles.noLogsText}>No logs yet.</Text>
        ) : (
          logs.map((log, index) => (
            <View key={index} style={logStyles.logItem}>
              <TouchableOpacity onPress={() => handleLogClick(log)} style={logStyles.logTouchable}>
                <Text style={logStyles.logText}>{log.message}</Text>
                <MaterialIcons
                  name={expandedLog === log ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="black"
                  style={logStyles.icon}
                />
              </TouchableOpacity>
              {expandedLog === log && (
                <View style={logStyles.logExpandContainer}>
                  <Text style={logStyles.logExpandText}>
                    Expected harvest: {calculateHarvestDate(log.seed.timeOfGrowth)}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </BackgroundWrapper>
  );
}
