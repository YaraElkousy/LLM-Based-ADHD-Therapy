import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { fetchRelaxationExercise } from "../api/relax";

const Relaxation = () => {
  const [feeling, setFeeling] = useState("");
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feeling.trim()) return;

    setLoading(true);
    try {
      const data = await fetchRelaxationExercise(feeling);
      setExercise(data.exercise || "No exercise found.");
    } catch (error) {
      setExercise("Error fetching exercise.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="How are you feeling?"
        value={feeling}
        onChangeText={setFeeling}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Get Exercise</Text>}
      </TouchableOpacity>

      {exercise && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Suggestion:</Text>
          <Text style={styles.resultText}>{exercise}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#A7C7E7", 
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
});

export default Relaxation;
