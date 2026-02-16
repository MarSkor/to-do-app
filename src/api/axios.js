import axios from "axios";
import { BACKEND_BASE_URL } from "../constants";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: BACKEND_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // rate limit
      if (status === 429) {
        toast.error(data.message);
        return Promise.reject(error);
      }

      // bot / security shield
      if (status === 403 && data.message) {
        if (
          data.message.includes("blocked") ||
          data.message.includes("Automated")
        ) {
          console.error("Security Block:", data.message);
          toast.error("Security Alert: " + data.message);
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
