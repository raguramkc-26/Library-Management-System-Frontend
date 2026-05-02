import api from "./api";

// ================= USERS =================
export const getUsers = () =>
  api.get("/admin/users");

export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role });

export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);


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