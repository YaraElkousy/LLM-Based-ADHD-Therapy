import axios from "axios";

const API_URL = "http://192.168.100.215:8000"; //IP

export const addTask = async (taskName, token) => {
  try {
    const response = await axios.post(`${API_URL}/add_task/`, null, {
      params: { task_name: taskName },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to add task:", error);
    throw new Error("Failed to add task. Please try again.");
  }
};
export const getTasks = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return { error: "Failed to load tasks" };
  }
};

