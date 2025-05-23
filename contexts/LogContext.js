import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  // Load logs from Supabase on mount
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User not authenticated when loading logs.');
          return;
        }

        const { data, error } = await supabase
          .from('logs')
          .select('id, seed_id, date, message')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        // Transform logs to match the expected format
        const transformedLogs = data.map(log => ({
          id: log.id,
          seed: { id: log.seed_id }, // Minimal seed object; full seed data fetched in LogsScreen
          date: log.date,
          message: log.message,
        }));

        setLogs(transformedLogs);
      } catch (error) {
        console.error('Failed to load logs:', error.message);
      }
    };

    loadLogs();

    // Optional: Set up a subscription to listen for changes to logs (real-time updates)
    const subscription = supabase
      .channel('logs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'logs',
          filter: `user_id=eq.${supabase.auth.getUser().then(({ data: { user } }) => user?.id)}`,
        },
        (payload) => {
          loadLogs(); // Refresh logs on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const addLog = async (log) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated when adding log.');
        return;
      }

      const logData = {
        user_id: user.id,
        seed_id: log.seed.id,
        date: log.date,
        message: log.message,
      };

      const { data, error } = await supabase
        .from('logs')
        .insert(logData)
        .select('id, seed_id, date, message')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const newLog = {
        id: data.id,
        seed: { id: data.seed_id },
        date: data.date,
        message: data.message,
      };

      const updatedLogs = [...logs, newLog];
      setLogs(updatedLogs);
    } catch (error) {
      console.error('Failed to add log:', error.message);
    }
  };

  const clearLogs = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated when clearing logs.');
        return;
      }

      // Clear logs for this user
      const { error: logError } = await supabase
        .from('logs')
        .delete()
        .eq('user_id', user.id);

      if (logError) {
        throw new Error(logError.message);
      }

      // Clear planted dates for this user (already stored in Supabase)
      const { error: plantedError } = await supabase
        .from('planted_dates')
        .delete()
        .eq('user_id', user.id);

      if (plantedError) {
        throw new Error(plantedError.message);
      }

      setLogs([]);
    } catch (error) {
      console.error('Failed to clear logs and planted dates:', error.message);
    }
  };

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => useContext(LogContext);