import api from "./api";

// LOGIN
export const loginUser = (data) =>
  api.post("/auth/login", data);

// REGISTER
export const registerUser = (data) =>
  api.post("/auth/register", data);

// GET CURRENT USER
export const getMe = () =>
  api.get("/auth/me");

// FORGOT PASSWORD
export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

// RESET PASSWORD 
export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password });

// UPDATE PROFILE
export const updateProfile = (data) =>
  api.put("/auth/update-profile", data);