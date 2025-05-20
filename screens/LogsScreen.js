import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLogs } from '../contexts/LogContext';
import { calculateHarvestDate } from './utils';
import { MaterialIcons } from '@expo/vector-icons';
import { logStyles } from './stylesL';
import BackgroundWrapper from '../components/BackgroundWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_SEEDS = '@seed_data';

export default function LogsScreen() {
  const { logs } = useLogs();
  const [expandedLog, setExpandedLog] = useState(null);
  const [savedSeeds, setSavedSeeds] = useState([]);

  // Load saved seeds from AsyncStorage on mount
  useEffect(() => {
    const loadSeeds = async () => {
      try {
        const savedSeedsString = await AsyncStorage.getItem(STORAGE_KEY_SEEDS);
        let parsedSeeds = savedSeedsString ? JSON.parse(savedSeedsString) : [];
        // Migrate old seed data
        parsedSeeds = parsedSeeds.map(seed => {
          if (seed.timeOfGrowth && !seed.minGrowthTime) {
            const [min, max] = seed.timeOfGrowth.split('-').map(s => s.replace(' days', '').trim());
            return {
              ...seed,
              minGrowthTime: `${min} days`,
              maxGrowthTime: `${max || min} days`,
              timeOfGrowth: undefined,
            };
          }
          return {
            ...seed,
            minGrowthTime: seed.minGrowthTime || '60 days',
            maxGrowthTime: seed.maxGrowthTime || seed.minGrowthTime || '60 days',
          };
        });
        setSavedSeeds(parsedSeeds);
      } catch (error) {
        console.error('Failed to load seeds in LogsScreen:', error);
      }
    };
    loadSeeds();
  }, []);

  // Helper to get full seed info by id from savedSeeds
  const getSeedById = (id) => {
    return savedSeeds.find((seed) => seed.id === id) || null;
  };

  const handleLogClick = (log) => {
    setExpandedLog(expandedLog === log ? null : log);
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
          logs.map((log, index) => {
            const fullSeed = getSeedById(log.seed.id) || log.seed;

            return (
              <View key={index} style={logStyles.logItem}>
                <TouchableOpacity
                  onPress={() => handleLogClick(log)}
                  style={logStyles.logTouchable}
                >
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
                      Expected harvest:{' '}
                      {fullSeed.minGrowthTime && fullSeed.maxGrowthTime && log.date
                        ? calculateHarvestDate(fullSeed.minGrowthTime, fullSeed.maxGrowthTime, log.date)
                        : 'Invalid or missing data'}
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