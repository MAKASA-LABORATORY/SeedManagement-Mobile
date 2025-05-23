import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { logStyles } from '../styles/stylesL';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { supabase } from '../config/supabaseClient';
import { calculateHarvestDate } from '../utils/utils';

export default function LogsScreen() {
  const [logs, setLogs] = useState([]);
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => {
    const fetchLogsWithSeeds = async () => {
      try {
        const { data, error } = await supabase
          .from('logs')
          .select(`
            id,
            date,
            message,
            seed_id,
            seeds (
              id,
              name,
              min_growth_time,
              max_growth_time
            )
          `)
          .order('date', { ascending: false });

        if (error) throw error;

        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch logs from Supabase:', err.message);
      }
    };

    fetchLogsWithSeeds();
  }, []);

  const handleLogClick = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  return (
    <BackgroundWrapper overlay>
      <View style={logStyles.container}>
        <View style={logStyles.header}>
          <MaterialIcons
            name="history"
            size={24}
            color="black"
            style={logStyles.headerIcon}
          />
          <Text style={logStyles.title}>Logs</Text>
        </View>

        {logs.length === 0 ? (
          <Text style={logStyles.noLogsText}>No logs yet.</Text>
        ) : (
          logs.map((log) => {
            const seed = log.seeds;
            const harvestDateText =
              seed?.min_growth_time && seed?.max_growth_time && log.date
                ? calculateHarvestDate(seed.min_growth_time, seed.max_growth_time, log.date)
                : 'Missing seed data';

            return (
              <View key={log.id} style={logStyles.logItem}>
                <TouchableOpacity
                  onPress={() => handleLogClick(log.id)}
                  style={logStyles.logTouchable}
                >
                  <Text style={logStyles.logText}>{log.message}</Text>
                  <MaterialIcons
                    name={expandedLog === log.id ? 'expand-less' : 'expand-more'}
                    size={24}
                    color="black"
                    style={logStyles.icon}
                  />
                </TouchableOpacity>
                {expandedLog === log.id && (
                  <View style={logStyles.logExpandContainer}>
                    <Text style={logStyles.logExpandText}>
                      Expected harvest: {harvestDateText}
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    </BackgroundWrapper>
  );
}
