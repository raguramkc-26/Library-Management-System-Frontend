import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const protectedInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default protectedInstance;