import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import ChatBot from '../components/chatbot'; 
import TaskForm from '../components/task'; 
import { useAuth } from '../auth/authContext';
import SmartwatchInterface from '../components/smartwatch';

const Home = () => {
  const [selectedTab, setSelectedTab] = useState('chat'); // Default tab
  const { token, logout } = useAuth();

  const handleLogout = async () => {
    await logout(); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Thryve</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            onPress={() => setSelectedTab('chat')} 
            style={[
              styles.tabButton, 
              selectedTab === 'chat' && styles.activeTabButton
            ]}
          >
            <Text 
              style={[
                styles.tabButtonText,
                selectedTab === 'chat' && styles.activeTabText
              ]}
            >
              Chat 
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setSelectedTab('tasks')} 
            style={[
              styles.tabButton, 
              selectedTab === 'tasks' && styles.activeTabButton
            ]}
          >
            <Text 
              style={[
                styles.tabButtonText,
                selectedTab === 'tasks' && styles.activeTabText
              ]}
            >
              Tasks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setSelectedTab('smartwatch')}
            style={[
              styles.tabButton,
              selectedTab === 'smartwatch' && styles.activeTabButton
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                selectedTab === 'smartwatch' && styles.activeTabText
              ]}
            >
              Heart Monitor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.contentArea}>
        {selectedTab === 'chat' && <ChatBot token={token} />}
        {selectedTab === 'tasks' && <TaskForm token={token}/>}
        {selectedTab === 'smartwatch' && <SmartwatchInterface />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2E3A59',
  },
  logoutButton: {
    backgroundColor: '#F7F9FC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  logoutText: {
    color: '#5D6B98',
    fontWeight: '500',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E3A59',
  },
  tabButtonText: {
    color: '#5D6B98',
    fontWeight: '500',
    fontSize: 16,
  },
  activeTabText: {
    color: '#2E3A59',
    fontWeight: '600',
  },
  contentArea: {
    flex: 1,
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
    flex: 1,
  },
});

export default Home;