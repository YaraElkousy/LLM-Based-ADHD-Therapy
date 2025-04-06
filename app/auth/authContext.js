import React, { createContext, useState, useEffect } from 'react';
import { isLoggedIn, logout, login } from './authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await isLoggedIn();
      setAuthenticated(loggedIn);
    };
    checkLogin();
  }, []);

  const handleLogin = async (username, password) => {
    const success = await login(username, password);
    setAuthenticated(success);
    return success;
  };

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
