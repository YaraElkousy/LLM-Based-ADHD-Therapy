import axios from "axios";

const API_URL = "http://192.168.100.195:8000"; //IP

// Function to add a task and get a suggested focus strategy
// export const addTask = async (taskName) => {
//   try {
//     const response = await axios.post(`${API_URL}/add_task/`, null, {
//       params: { task_name: taskName },
//     });

//     return response.data; // { message: "...", suggested_strategy: "..." }
//   } catch (error) {
//     throw new Error("Failed to add task. Please try again.");
//   }
// };

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

