import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  ScrollView 
} from "react-native";
import { addTask, getTasks } from "../api/task";
import { useAuth } from '../auth/authContext';

const TaskForm = ({ token }) => {
  const [taskName, setTaskName] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);
  
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const fetchedTasks = await getTasks(token);
        setTasks(fetchedTasks.tasks || []);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const handleSubmit = async () => {
    if (!taskName.trim()) return;

    setLoading(true);
    try {
      const data = await addTask(taskName, token);
      setResponse(data.suggested_strategy);
      setError(null);
      
      // Clear input after successful submission
      setTaskName("");
      
      // Refresh task list
      const updatedTasks = await getTasks(token);
      setTasks(updatedTasks.tasks || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ref={scrollViewRef}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
    >
      {/* Task Input Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>What would you like to focus on today?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a task or project"
          value={taskName}
          onChangeText={setTaskName}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
          disabled={loading || !taskName.trim()}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Add Task</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Display Suggested Focus Strategy */}
      {response && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Suggested Focus Strategy:</Text>
          <View style={styles.strategyCard}>
            <Text style={styles.resultText}>{response}</Text>
          </View>
        </View>
      )}

      {/* Display saved tasks */}
      <View style={styles.savedTasksContainer}>
        <Text style={styles.sectionHeader}>Your Tasks</Text>
        
        {loading && tasks.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2E3A59" />
          </View>
        ) : tasks.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No tasks yet. Add your first task to get started!
            </Text>
          </View>
        ) : (
          <View style={styles.taskListContainer}>
            {tasks.map((item, index) => (
              <View key={`${item.task}-${index}`} style={styles.taskItem}>
                <Text style={styles.taskName}>{item.task}</Text>
                {item.details && (
                  <Text style={styles.taskStrategy}>{item.details}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  formContainer: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2E3A59",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2E3A59",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  errorContainer: {
    backgroundColor: "#FFE8E8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#D83A52",
    fontSize: 14,
  },
  resultContainer: {
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 8,
  },
  strategyCard: {
    backgroundColor: "#F0F7FF",
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2E3A59",
  },
  resultText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5D6B98",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateContainer: {
    padding: 24,
    backgroundColor: "#F7F9FC",
    borderRadius: 8,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#5D6B98",
    fontSize: 15,
    textAlign: "center",
  },
  taskListContainer: {
    width: "100%",
  },
  taskItem: {
    padding: 16,
    backgroundColor: "#F7F9FC",
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#2E3A59",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2E3A59",
    marginBottom: 4,
  },
  taskStrategy: {
    fontSize: 14,
    color: "#5D6B98",
    lineHeight: 20,
  },
  savedTasksContainer: {
    marginTop: 8,
  },
});

export default TaskForm;