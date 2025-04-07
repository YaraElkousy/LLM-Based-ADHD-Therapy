import React, { useState } from 'react';
import { TextInput, Button, View, Text } from 'react-native';
import { register } from '../auth/authService'; 


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
      <Button title="Register" onPress={handleRegister} color="#A7C7E7"/>
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default Register;
