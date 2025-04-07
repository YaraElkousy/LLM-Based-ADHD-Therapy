import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import Login from '../components/login'; 
import Register from '../components/register'; 
import Relaxation from '../components/relax';

const GuestHome = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to Thryve</Text>
          <Text style={styles.subheaderText}>Your journey to wellness begins here</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sign In</Text>
          <View style={styles.componentWrapper}>
            <Login />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Create Account</Text>
          <View style={styles.componentWrapper}>
            <Register />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Try a Relaxation Exercise</Text>
          <Text style={styles.sectionDescription}>Take a moment to center yourself with this brief exercise</Text>
          <View style={styles.componentWrapper}>
            <Relaxation />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  headerContainer: {
    marginBottom: 36,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheaderText: {
    fontSize: 16,
    color: '#5D6B98',
    textAlign: 'center',
  },
  sectionContainer: {
    marginVertical: 16,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#5D6B98',
    marginBottom: 16,
  },
  componentWrapper: {
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E9F2',
    marginVertical: 24,
  },
});

export default GuestHome;