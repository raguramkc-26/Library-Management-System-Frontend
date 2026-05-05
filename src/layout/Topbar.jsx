import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Topbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const path = location.pathname;
    const isMainPage = path === "/dashboard" || path === "/admin/dashboard";
    if (isMainPage) {
      return;
    }
    if (window.history.length > 1) {
      navigate(-1, { replace: true });
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
          onClick={handleBack}
          className="text-gray-600 hover:text-black flex items-center gap-1"
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