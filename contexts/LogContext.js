// contexts/LogContext.js
import React, { createContext, useState, useContext } from 'react';

const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  const addLog = (log) => {
    setLogs((prevLogs) => [...prevLogs, log]);
  };

  return (
    <LogContext.Provider value={{ logs, addLog }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => useContext(LogContext);
