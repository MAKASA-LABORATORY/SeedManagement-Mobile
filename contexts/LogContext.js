import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthChecked(true);
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!isAuthChecked) {
        setIsAuthChecked(true);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let subscription;

    const loadLogs = async () => {
      if (!user) {
        console.log('No user authenticated, skipping log load.');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('logs')
          .select('id, seed_id, date, message')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        const transformedLogs = data.map(log => ({
          id: log.id,
          seed: { id: log.seed_id },
          date: log.date,
          message: log.message,
        }));

        setLogs(transformedLogs);
      } catch (error) {
        console.error('Failed to load logs:', error.message);
      }
    };

    if (isAuthChecked && user) {
      loadLogs();

      // Set up real-time subscription
      subscription = supabase
        .channel('logs-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'logs',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            loadLogs();
          }
        )
        .subscribe();
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [user, isAuthChecked]);

  const addLog = async (log) => {
    if (!user) {
      console.error('User not authenticated when adding log.');
      return;
    }

    try {
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

      setLogs(prevLogs => [...prevLogs, newLog]);
    } catch (error) {
      console.error('Failed to add log:', error.message);
    }
  };

  const clearLogs = async () => {
    if (!user) {
      console.error('User not authenticated when clearing logs.');
      return;
    }

    try {
      const { error: logError } = await supabase
        .from('logs')
        .delete()
        .eq('user_id', user.id);

      if (logError) {
        throw new Error(logError.message);
      }

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