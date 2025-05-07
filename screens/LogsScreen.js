import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLogs } from '../contexts/LogContext'; // Import LogContext
import { calculateHarvestDate } from './utils'; // Assuming you create a utility to calculate harvest dates
import { MaterialIcons } from '@expo/vector-icons'; // Import this if you're using Material Icons
import { logStyles } from './stylesL'; // Import the styles from stylesL.js

export default function LogsScreen() {
  const { logs } = useLogs();
  const [expandedLog, setExpandedLog] = useState(null);

  const handleLogClick = (log) => {
    setExpandedLog(expandedLog === log ? null : log); // Toggle expand/collapse
  };

  return (
    <View style={logStyles.container}>
      <Text style={logStyles.title}>Logs</Text>
      {logs.length === 0 ? (
        <Text style={logStyles.noLogsText}>No logs yet.</Text>
      ) : (
        logs.map((log, index) => (
          <View key={index} style={logStyles.logItem}>
            <TouchableOpacity onPress={() => handleLogClick(log)}>
              <Text style={logStyles.logText}>{log.message}</Text>
              <MaterialIcons name={expandedLog === log ? 'expand-less' : 'expand-more'} size={24} color="black" />
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
