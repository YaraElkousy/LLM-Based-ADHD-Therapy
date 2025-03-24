import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView 
} from "react-native";
import { fetchChatResponse } from "../api/chat";

const ChatBot = () => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const MAX_LENGTH = 500;

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    try {
      const data = await fetchChatResponse(userInput, "casual");
      setResponse(data.response);
    } catch (error) {
      setResponse("Error fetching response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ask something..."
        value={userInput}
        onChangeText={setUserInput}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Ask</Text>}
      </TouchableOpacity>

      {response && (
        <ScrollView style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Bot Response:</Text>
          <Text style={styles.responseText}>
            {showFull || response.length <= MAX_LENGTH
              ? response
              : `${response.substring(0, MAX_LENGTH)}...`}
          </Text>

          {response.length > MAX_LENGTH && (
            <TouchableOpacity onPress={() => setShowFull(!showFull)}>
              <Text style={styles.showMore}>
                {showFull ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  responseContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  responseText: {
    fontSize: 16,
  },
  showMore: {
    color: "#007BFF",
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default ChatBot;
