import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  // Load logs from AsyncStorage on mount
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem('logs');
        if (storedLogs) setLogs(JSON.parse(storedLogs));
      } catch (error) {
        console.error('Failed to load logs:', error);
      }
    };

    loadLogs();
  }, []);

  const addLog = async (log) => {
    const updatedLogs = [...logs, log];
    setLogs(updatedLogs);

    try {
      await AsyncStorage.setItem('logs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  };

  const clearLogs = async () => {
    try {
      await AsyncStorage.removeItem('logs');
      await AsyncStorage.removeItem('plantedDates'); // Also clear planted dates for Calendar
      setLogs([]);
    } catch (error) {
      console.error('Failed to clear logs and planted dates:', error);
    }
  };

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => useContext(LogContext);
