import axios from "axios";

export const userInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

userInstance.interceptors.request.use((config) => {
  let token;
  if (window.location.pathname.includes("/manager")) {
    token = localStorage.getItem("managerToken");
  } else {
    token = localStorage.getItem("token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});