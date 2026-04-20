import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Books", path: "/books" },
    { name: "Profile", path: "/profile" },
    { name: "Admin", path: "/admin/dashboard" },
    { name: "Reviews", path: "/admin/reviews" },
  ];

  return (
    <div className="w-64 bg-indigo-600 text-white p-5">
      <h1 className="text-xl font-bold mb-6">📚 LMS</h1>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`block p-2 rounded mb-2 ${
            pathname === item.path
              ? "bg-white text-indigo-600"
              : "hover:bg-indigo-500"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;