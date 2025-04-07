import axios from "axios";

const API_URL = "http://192.168.100.195:8000"; // IP


export const fetchChatResponse = async (userInput, style, token) => {
  try {
    const response = await axios.get(`${API_URL}/chat/`, {
      params: { user_input: userInput, style: style },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat response:", error);
    throw error;
  }
};

export const fetchChatHistory = async (token) => {
  //console.log(token)
  try {
    const response = await axios.get(`${API_URL}/chat_history/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.messages; //response contains an array of messages?
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

