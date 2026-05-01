import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">

      <div>
        <h2 className="text-lg font-semibold">
          Welcome, {user?.name || "User"}
        </h2>
        <p className="text-sm text-gray-500">
          Library Dashboard
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
          {user?.name?.charAt(0)}
        </div>
      </div>

    </div>
  );
};

export default Topbar;