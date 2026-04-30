import api from "./api"

// ADMIN STATS
export const getAdminStats = async () => {
  try {
    const res = await api.get("/admin/stats");

    if (!res.data) {
      throw new Error("Invalid stats response");
    }

    return res.data;
  } catch (err) {
    console.error("getAdminStats error:", err.response?.data || err.message);
    throw err;
  }
};

// MONTHLY STATS
export const getMonthlyStats = async () => {
  try {
    const res = await api.get("/admin/stats/monthly");

    // backend must return array
    if (!Array.isArray(res.data)) {
      console.error("Monthly stats wrong format:", res.data);
      return res.data.data || []; // prevent crash
    }

    return res.data;
  } catch (err) {
    console.error("getMonthlyStats error:", err.response?.data || err.message);
    return []; // fallback to avoid UI crash
  }
};

// NOTIFY ALL USERS
export const notifyAll = async (message) => {
  try {
    if (!message || message.trim() === "") {
      throw new Error("Message cannot be empty");
    }

    const res = await api.post("/admin/notify-all", { message });

    return res.data;
  } catch (err) {
    console.error("notifyAll error:", err.response?.data || err.message);
    throw err;
  }
};