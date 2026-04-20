import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,                 // cookies
});

// Optional: global error handling
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // you can also emit an event or redirect here
      console.warn("Unauthorized (401)");
    }
    return Promise.reject(err);
  }
);

export default instance;