import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_URL = 'http://your-api-url.com'; // Replace with your actual API URL

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/token`, { username, password });
    const token = response.data.access_token;

    await SecureStore.setItemAsync('accessToken', token);
    return true;
  } catch (err) {
    console.error('Login failed:', err);
    return false;
  }
};

export const logout = async () => {
  await SecureStore.deleteItemAsync('accessToken');
};

export const getAccessToken = async () => {
  return await SecureStore.getItemAsync('accessToken');
};

export const isLoggedIn = async () => {
  const token = await getAccessToken();
  return !!token;
};
