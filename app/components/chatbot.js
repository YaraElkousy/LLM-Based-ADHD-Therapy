import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { fetchChatResponse, fetchChatHistory } from "../api/chat";
import CatAnimation from "./cat"; 

const ChatBot = ({ token }) => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const catAnimationRef = useRef();

  // Animation for cat appearing/disappearing
  const catOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const data = await fetchChatHistory(token);
        // Make sure we're handling the data correctly
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading chat history:", error);
        setMessages([]);
      }
    };
    loadChatHistory();
    
    // Fade in the cat animation
    Animated.timing(catOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const data = await fetchChatResponse(userInput, "casual", token);
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

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Cat animation in the top-right corner */}
      {/* <Animated.View style={[styles.catContainer, { opacity: catOpacity }]}>
        <CatAnimation ref={catAnimationRef} style={styles.cat} />
      </Animated.View> */}
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatScrollView}
        contentContainerStyle={styles.chatContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages && messages.length > 0 ? (
          messages.map((item, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                item.role === "user" ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              <Text style={[
                styles.messageText,
                item.role === "user" && styles.userMessageText
              ]}>
                {item.text}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              Start a conversation with your wellness assistant...
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={userInput}
          onChangeText={setUserInput}
          multiline={false}
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
    backgroundColor: "transparent",
  },
  catContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  cat: {
    width: 80,
    height: 80,
  },
  chatScrollView: {
    flex: 1,
  },
  chatContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    paddingTop: 60, // Add some padding at the top to make space for the cat
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: "85%",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2E3A59",
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F7F9FC",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#5D6B98",
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyStateText: {
    textAlign: "center",
    color: "#A0A9C0",
    fontSize: 14,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: "#E4E9F2",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
    backgroundColor: "#F7F9FC",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2E3A59",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 44,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ChatBot;