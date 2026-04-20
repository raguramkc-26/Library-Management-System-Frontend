import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow">
      
      <h2 className="font-semibold text-lg">Dashboard</h2>

      <div className="flex items-center gap-4">
        
        {/* Notification */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/dashboard/notifications")}
        >
          <Bell />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <span>{user?.name}</span>
          <div className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-full">
            {user?.name?.[0]}
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;