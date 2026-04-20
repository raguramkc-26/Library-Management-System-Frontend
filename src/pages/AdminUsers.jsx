import { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  updateUserRole,
} from "../services/userService";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;

    try {
      await deleteUser(id);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Role update failed");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">User Management</h1>

      <div className="bg-white p-4 rounded shadow">
        {users.map((u) => (
          <div key={u._id} className="flex justify-between items-center border-b py-3">

            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>

            <div className="flex items-center gap-3">

              {/* ROLE DROPDOWN */}
              <select
                value={u.role}
                onChange={(e) =>
                  handleRoleChange(u._id, e.target.value)
                }
                className="border p-1 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              {/* DELETE */}
              <button
                onClick={() => handleDelete(u._id)}
                className="text-red-500"
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;