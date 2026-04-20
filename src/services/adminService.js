import protectedInstance from "../instances/protectedInstance";

export const getAdminStats = async () => {
  const res = await protectedInstance.get("/admin/stats");
  return res.data;
};

export const getMonthlyStats = async () => {
  const res = await protectedInstance.get("admin/stats/monthly");
  return res.data;
}