import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://jobpulse-server.up.railway.app/api",
  withCredentials: true,
});

export default API;