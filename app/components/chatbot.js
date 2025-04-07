import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  Platform,
   
} from "react-native";
import { fetchChatResponse,fetchChatHistory } from "../api/chat";

const ChatBot = ( {token} ) => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const MAX_LENGTH = 500;

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const data = await fetchChatHistory(token);
        setMessages(data); 
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };
    loadChatHistory();
  }, [token]); // Fetch chat history when the component is first loaded

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);


    try {
      const data = await fetchChatResponse(userInput, "casual", token);
      // Add the assistant's response to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", text: data.response },
      ]);

    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", text: "Error fetching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };


  // Function to render each message item in the FlatList
  const renderItem = ({ item }) => {
    return (
      <View style={[styles.messageContainer, item.role === "user" ? styles.userMessage : styles.assistantMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };
  // Add this ref
const flatListRef = React.useRef(null);

// Modify the useEffect to safely check for messages
useEffect(() => {
  if (messages && messages.length > 0) {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  }
}, [messages]);

// Add this function before the return statement
const scrollToBottom = () => {
  if (flatListRef.current && messages && messages.length > 0) {
    flatListRef.current.scrollToEnd({ animated: true });
  }
};

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.chatList}
        />

      {/* Input and Send Button */}
      <View style={styles.inputContainer}>
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
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,  //upon removing this i can now see the text inuput and button a bit better
  },
  chatList: {
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: "80%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007BFF",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}
);

export default ChatBot;