import React, { createContext, useState, useContext, useEffect } from 'react';
import { isLoggedIn, logout, login, getAccessToken, register } from './authService';

export const AuthContext = createContext();

export const useAuth = () => React.useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await isLoggedIn();
      setAuthenticated(loggedIn);
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await getAccessToken();
      if (storedToken) {
        setToken(storedToken);
      }
    };
    checkToken();
  }, []);


  const handleRegister = async (username, password) => {
    const success = await register(username, password);
    if (success) {
      setAuthenticated(true);  
      setToken(await getAccessToken());  
    }
    return success;
  };

  const handleLogin = async (username, password) => {
    const success = await login(username, password);
    setAuthenticated(success);
    if (success) {
        setToken(await getAccessToken());  // Get the token after login
    }
    return success;
  };

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated, token,register: handleRegister, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
