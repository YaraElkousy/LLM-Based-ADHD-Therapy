import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ChatBot from '../components/chatbot'; 
import TaskForm from '../components/task'; 
import { useAuth } from '../auth/authContext'

const Home = () => {
  const [selectedTab, setSelectedTab] = useState('chat'); // Default tab
  const { token, logout } = useAuth();

  const handleLogout = async () => {
    await logout(); 
    // navigation.navigate('GuestHome'); 
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab('chat')} style={styles.tabButton}>
          <Text style={styles.tabButtonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('tasks')} style={styles.tabButton}>
          <Text style={styles.tabButtonText}>Tasks</Text>
        </TouchableOpacity>
      </View>

      {/* Render Tab Content */}
      <View style={styles.contentArea}>
        {selectedTab === 'chat' && <ChatBot token={token} />}
        {selectedTab === 'tasks' && <TaskForm token={token}/>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
    backgroundColor: '#A7C7E7',
    margin: 5,
    borderRadius: 5,
  },
  tabButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentArea: {
    padding: 10,
  },
  logoutButton: {
    backgroundColor: '#4A4A4A', 
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end', 
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Home;
