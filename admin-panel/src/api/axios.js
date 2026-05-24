import axios from "axios";

const API = axios.create({
  baseURL: "https://arogya-sahayak-n7c6.onrender.com/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;