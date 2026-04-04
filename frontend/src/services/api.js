import axios from "axios";

// create instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export default api;
