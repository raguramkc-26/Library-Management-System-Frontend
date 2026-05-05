import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../../services/adminService";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res?.data?.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };
  
  const hasAdmin = users.some((u) => u.role === "admin");
  // ================= ROLE CHANGE =================
  const handleRoleChange = async (id, role) => {
    try {
      setActionLoading(id);

      await updateUserRole(id, role);

      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setActionLoading(id);

      await deleteUser(id);

      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/admin/dashboard");
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Users Management
        </h1>
        <p className="text-gray-500">
          Manage roles and users
        </p>
      </div>

      <Card className="p-6 rounded-2xl shadow-md">

        {!users.length ? (
          <EmptyState title="No users found" />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* NAME */}
                    <td className="py-3 px-2 font-medium text-gray-800">
                      {u.name}
                    </td>

                    {/* EMAIL */}
                    <td className="py-3 px-2 text-gray-500">
                      {u.email}
                    </td>

                    {/* ROLE */}
                    <td className="py-3 px-2">
                      <select
                        value={u.role}
                        disabled={
                          u._id === currentUserId ||
                          actionLoading === u._id
                        }
                        onChange={(e) =>
                          handleRoleChange(u._id, e.target.value)
                        }
                        className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3 px-2">
                      {u._id === currentUserId ? (
                        <span className="text-gray-400 text-sm font-medium">
                          Not allowed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDelete(u._id)}
                          disabled={actionLoading === u._id}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-50"
                        >
                          {actionLoading === u._id ? "..." : "Delete"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </Card>

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="px-3 py-2 bg-gray-200 rounded"
      >
        Back
      </button>

    </div>
  );
};

export default AdminUsers;