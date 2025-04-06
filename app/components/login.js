import React, { useState } from 'react';
import { TextInput, Button, View, Text } from 'react-native';
import { useAuth } from '../auth/authContext'; 


const Login = ({ navigation }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    } else {
      navigation.navigate('Home'); 
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default Login;
