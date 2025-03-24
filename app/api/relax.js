import axios from "axios";

const API_URL = "http://192.168.100.195:8000"; // IP

export const fetchRelaxationExercise = async (feeling) => {
  try {
    const response = await axios.get(`${API_URL}/relaxation/`, {
      params: { feeling },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching relaxation exercise:", error);
    return { error: "Failed to fetch exercise." };
  }
};
