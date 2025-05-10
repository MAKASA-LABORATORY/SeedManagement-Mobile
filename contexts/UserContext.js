import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  const login = async (username) => {
    setUsername(username);
    await AsyncStorage.setItem('loggedInUser', username);
  };

  const logout = async () => {
    setUsername(null);
    await AsyncStorage.removeItem('loggedInUser');
  };

  useEffect(() => {
    AsyncStorage.getItem('loggedInUser').then((u) => {
      if (u) setUsername(u);
    });
  }, []);

  return (
    <UserContext.Provider value={{ username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
