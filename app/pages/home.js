import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ChatBot from '../components/chatbot'; // Assuming you already have the Chat component
import TaskForm from '../components/task'; // Assuming you have a Tasks component

const Home = () => {
  const [selectedTab, setSelectedTab] = useState('chat'); // Default tab

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, User!</Text>
      
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
        {selectedTab === 'chat' && <ChatBot />}
        {selectedTab === 'tasks' && <TaskForm />}
      </View>
    </View>
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
    backgroundColor: '#007BFF',
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
});

export default Home;
