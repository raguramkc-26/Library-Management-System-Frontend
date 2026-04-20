import instance from "../instances/instance";

export const getUsers = async () => {
  const res = await instance.get("/user/admin");
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await instance.put(`/user/${id}`, { role });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await instance.delete(`/user/admin/${id}`);
  return res.data;
};