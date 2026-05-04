import api from "./api";

// ================= USERS =================
export const getUsers = () =>
  api.get("/users");

export const updateUserRole = (id, role) =>
  api.put(`/users/${id}`, { role });

export const deleteUser = (id) =>
  api.delete(`/users/${id}`);


// ================= STATS =================
export const getAdminStats = () =>
  api.get("/admin/stats");

export const getMonthlyStats = () =>
  api.get("/admin/stats/monthly");

export const getTopBooks = () =>
  api.get("/admin/top-books");


// ================= NOTIFICATIONS =================
export const notifyAll = (message) =>
  api.post("/admin/notify-all", { message });