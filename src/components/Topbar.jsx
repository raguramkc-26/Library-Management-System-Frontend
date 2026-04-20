import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      
      <h2 className="font-semibold text-lg">Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-sm">{user?.name}</span>

        <button className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;