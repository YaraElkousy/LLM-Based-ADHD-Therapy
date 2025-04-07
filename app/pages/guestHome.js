import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Login from '../components/login'; 
import Register from '../components/register'; 
import Relaxation from '../components/relax'; 

const GuestHome = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>

      {/* Login Component */}
      <Text style={styles.sectionTitle}>Login</Text>
      <Login />

      {/* Register Component */}
      <Text style={styles.sectionTitle}>Register</Text>
      <Register />

      {/* Relaxation Component */}
      <Text style={styles.sectionTitle}>Relaxation Exercise</Text>
      <Relaxation />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default GuestHome;
