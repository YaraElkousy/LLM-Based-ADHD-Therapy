import React, { useState } from 'react';
import { TextInput, Button, View, Text } from 'react-native';
import { register } from '../api/authService'; 

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    const success = await register(username, password);
    if (success) {
      navigation.navigate('Home'); 
    } else {
      setError('Registration failed. Please try again.');
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
      <Button title="Register" onPress={handleRegister} />
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default Register;
