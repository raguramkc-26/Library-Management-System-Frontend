import instance from "../instances/instance";

export const getMyNotifications = async () => {
  const res = await instance.get("/notifications/me");
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await instance.put(`/notifications/${id}/read`);
  return res.data;
};