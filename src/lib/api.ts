import axios from "axios";

const API_URL = "http://localhost:5000";

// Add default headers configuration for axios
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    // Store the token in localStorage when login is successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Set the default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Add a function to set the auth token (useful when app initializes)
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, 
      { username, email, password }
    );
    // Store the token in localStorage when registration is successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const generateBlogPost = async (topic: string, style: string, keywords?: string) => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post(`${API_URL}/generate`, { topic, style, keywords });
    return response.data;
  } catch (error) {
    console.error("Blog post generation failed:", error);
    throw error;
  }
};

export const saveBlogPost = async (postData: any) => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post(`${API_URL}/post/save`, postData);
    return response.data;
  } catch (error) {
    console.error("Blog post saving failed:", error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, postData: any) => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.put(`${API_URL}/post/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error("Blog post updating failed:", error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.delete(`${API_URL}/post/${id}`);
    return response.data;
  } catch (error) {
    console.error("Blog post deletion failed:", error);
    throw error;
  }
};

export const getBlogPost = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/post/${id}`);
    return response.data;
  } catch (error) {
    console.error("Blog post fetching failed:", error);
    throw error;
  }
};

export const getBlogPostsByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/post/all/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Blog post fetching failed:", error);
    throw error;
  }
};

export const getAllBlogPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/post/all`);
    return response.data;
  } catch (error) {
    console.error("Blog post fetching failed:", error);
    throw error;
  }
};
