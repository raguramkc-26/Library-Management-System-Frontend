import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(user?.role === "admin" ? "/admin/dashboard" : "/dashboard");
    }
  }

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </button>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
          </h2>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.name}
          </p>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow">
          {user?.name?.charAt(0)}
        </div>

      </div>
    </div>
  );
};

export default Topbar;