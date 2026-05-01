import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  LayoutDashboard,
  User,
  Bell,
  Users,
  PlusCircle,
  LogOut,
  Bookmark,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Browse Books", path: "/dashboard/books", icon: Bookmark },
    { name: "My Books", path: "/dashboard/borrowed", icon: BookOpen },
    { name: "Profile", path: "/dashboard/profile", icon: User },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: BookOpen },
    { name: "Add Book", path: "/admin/add-book", icon: PlusCircle },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">

      {/* HEADER */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">📚 LMS</h1>
        <p className="text-xs text-gray-400 mt-1">
          {user?.role === "admin" ? "Admin Panel" : "User Panel"}
        </p>
      </div>

      {/* NAV */}
      <div className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <Icon size={18} />
              {link.name}
            </NavLink>
          );
        })}
      </div>

      {/* LOGOUT */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;