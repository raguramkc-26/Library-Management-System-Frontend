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
import instance from "../instances/instance";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Browse Books", path: "/dashboard/books", icon: Book },
    { name: "My Borrowed Books", path: "/dashboard/borrowed", icon: Book },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: BookOpen },
    { name: "Add Book", path: "/admin/add-book", icon: PlusCircle },
    { name: "Notify All", action: "notify", icon: Bell },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  const handleNotify = async () => {
    const message = prompt("Enter notification message");
    if (!message) return;

    try {
      await instance.post("/admin/notify-all", { message });
      toast.success("Notification sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white border-r p-5 flex flex-col">

      {/* LOGO */}
      <div className="p-5 border-b border-indigo-500">
        <h1 className="text-xl font-bold">📚 LMS</h1>
        <p className="text-xs text-indigo-200 mt-1">
          {user?.role === "admin" ? "Admin Panel" : "User Panel"}
        </p>
      </div>

      {/* USER INFO */}
      <div className="px-5 py-4 border-b border-indigo-500">
        <p className="text-sm">Welcome</p>
        <p className="font-semibold truncate">{user?.name}</p>
      </div>

      {/* NAV LINKS */}
      <div className="flex-1 px-3 py-4 space-y-1">

        {links.map((link) => {
          const Icon = link.icon;

          if (link.action === "notify") {
            return (
              <button
                key={link.name}
                onClick={handleNotify}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-500 transition"
              >
                <Icon size={18} />
                {link.name}
              </button>
            );
          }

          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-white text-indigo-600 font-semibold shadow"
                    : "hover:bg-indigo-500"
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
      <div className="mt-auto">
        <button
          onClick={logout}
          className="w-full text-left p-3 rounded hover:bg-gravy-100 text-red-500"
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;