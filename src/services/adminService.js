import api from "./api";

// USERS (YOU MISSED THIS)
export const getUsers = () =>
  api.get("/admin/users");

// STATS
export const getAdminStats = () =>
  api.get("/admin/stats");

// MONTHLY STATS
export const getMonthlyStats = () =>
  api.get("/admin/stats/monthly");

// NOTIFY ALL
export const notifyAll = (message) =>
  api.post("/admin/notify-all", { message });

//Top Books
export const getTopBooks = () =>
  api.get("/admin/top-books");