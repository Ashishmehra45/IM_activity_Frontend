import axios from "axios";
import toast from "react-hot-toast";

// 1. Check if local or production
const isLocalhost = 
  window.location.hostname === "localhost" || 
  window.location.hostname === "127.0.0.1";

// 2. Base URL Setup
export const API_BASE_URL = isLocalhost 
  ? "http://localhost:5000/api"                                 
  : "https://im-activity-backend.onrender.com/api";                    

// 🔥 3. GLOBAL AXIOS INTERCEPTOR (Auto Logout on Token Expiry)
axios.interceptors.response.use(
  (response) => {
    return response; // Sab theek hai toh data aage jaane do
  },
  (error) => {
    // Agar backend ne 401 (Unauthorized/Expired) bheja
    if (error.response && error.response.status === 401) {
      
      // LocalStorage saaf karo
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // User ko warning do
      toast.error("Session expired! Please login again. 🕒");
      
      // Zabardasti Login page par bhej do
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default API_BASE_URL;