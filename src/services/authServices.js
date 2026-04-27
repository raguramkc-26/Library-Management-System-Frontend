import instance from "../instances/instance";

export const registerUser = async (userData) => {
  const res = await instance.post("/auth/register", userData);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await instance.post("/auth/login", data);
  return res.data; // IMPORTANT: always return data
};

export const getMe = async () => {
  const res = await instance.get("/auth/me");
  return res.data;
};

export const logoutUser = async () => {
  const res = await instance.post("/auth/logout");
  return res.data;
};