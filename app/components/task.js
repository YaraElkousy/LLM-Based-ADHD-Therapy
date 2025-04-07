import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native";
import { addTask, getTasks } from "../api/task";
import { useAuth } from '../auth/authContext';

const TaskForm = () => {
  const [taskName, setTaskName] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const fetchedTasks = await getTasks(token);
        setTasks(fetchedTasks.tasks);
        setLoading(false);
      } catch (err) {
        setError("Failed to load tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const handleSubmit = async () => {
    if (!taskName.trim()) return;

    try {
      const data = await addTask(taskName, token);
      setResponse(data.suggested_strategy);
      setError(null);
      const updatedTasks = await getTasks(token);
      setTasks(updatedTasks.tasks);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Task Input Form */}
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* Display Suggested Focus Strategy */}
      {response && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Suggested Focus Strategy:</Text>
          <Text style={styles.resultText}>{response}</Text>
        </View>
      )}

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Loading indicator */}
      {loading && <Text>Loading tasks...</Text>}

      {/* Display saved tasks */}
      <View style={styles.savedTasksContainer}>
        <Text style={styles.savedTasksHeader}>Saved Tasks:</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Manually mapping tasks */}
          {tasks.map((item, index) => (
            <View key={`${item.task}-${index}`} style={styles.taskItem}>
              <Text style={styles.taskName}>{item.task}</Text>
              <Text style={styles.taskStrategy}>{item.details}</Text> 
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxHeight: 800,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 14,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  savedTasksContainer: {
    marginTop: 20,
    maxHeight: 400,
  },
  savedTasksHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskItem: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginVertical: 5,
  },
  taskName: {
    fontSize: 16,
  },
  taskStrategy: {
    fontSize: 14,
    color: "#555",
  },
});

export default TaskForm;