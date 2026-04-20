import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});
console.log("ENV:", import.meta.env);
console.log("BASE URL:", import.meta.env.VITE_API_URL);
export default instance;