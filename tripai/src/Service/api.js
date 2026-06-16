const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const saveToken = (token) => localStorage.setItem("tripai_token", token);
export const getToken = () => localStorage.getItem("tripai_token");
export const removeToken = () => localStorage.removeItem("tripai_token");

export const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export default API_BASE;