import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLogs } from '../contexts/LogContext'; // Import LogContext
import { calculateHarvestDate } from './utils'; // Assuming you create a utility to calculate harvest dates
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons
import { logStyles } from './stylesL'; // Import the styles from stylesL.js

export default function LogsScreen() {
  const { logs } = useLogs();
  const [expandedLog, setExpandedLog] = useState(null);

  const handleLogClick = (log) => {
    setExpandedLog(expandedLog === log ? null : log); // Toggle expand/collapse
  };

  return (
    <View style={logStyles.container}>
      {/* Logs header with icon */}
      <View style={logStyles.header}>
        <MaterialIcons name="history" size={24} color="black" style={logStyles.headerIcon} />
        <Text style={logStyles.title}>Logs</Text>
      </View>

      {/* Check if there are no logs */}
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
  );
}
