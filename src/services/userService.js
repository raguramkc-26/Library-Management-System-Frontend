import instance from "../instances/instance";

// GET ALL USERS (admin)
export const getUsers = async () => {
  try {
    const res = await instance.get("/admin/users");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch users" };
  }
};

// UPDATE USER ROLE (admin)
export const updateUserRole = async (id, role) => {
  try {
    const res = await instance.put(`/admin/users/${id}`, { role });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update role" };
  }
};

// DELETE USER (admin)
export const deleteUser = async (id) => {
  try {
    const res = await instance.delete(`/admin/users/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete user" };
  }
};