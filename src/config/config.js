
const isLocalhost = 
  window.location.hostname === "localhost" || 
  window.location.hostname === "127.0.0.1";

// 2. Base URL set karo (Local vs Production)
export const API_BASE_URL = isLocalhost 
  ? "http://localhost:5000/api"                                 // 💻 LOCAL BACKEND URL
  : "https://your-live-backend-url.com/api";                    // 🌐 LIVE BACKEND URL (Isko apne asli backend URL se replace kar dena)


export default API_BASE_URL;