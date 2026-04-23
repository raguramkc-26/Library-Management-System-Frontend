import { NavLink } from "react-router-dom";
import { Home, Book, LayoutDashboard, User, Bell, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const userLinks = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Books", path: "/dashboard/books", icon: Book },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: Book },
  ];

  const links = user && user.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="w-64 bg-indigo-600 text-white min-h-screen p-5">
      <h1 className="text-xl font-bold mb-6">📚 LMS</h1>

      <div className="space-y-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded ${
                  isActive ? "bg-white text-indigo-600" : "hover:bg-indigo-500"
                }`
              }
            >
              <Icon size={18} />
              {link.name}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;