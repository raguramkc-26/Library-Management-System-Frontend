import { useEffect, useState } from "react";
import { getAdminStats } from "../../services/adminService";
import Loader from "../../components/ui/Loader";
import StatCard from "../../components/ui/StatCard";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await getAdminStats();
    setStats(res?.data?.data || {});
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Books" value={stats.books} color="from-indigo-500 to-indigo-700" />
        <StatCard title="Users" value={stats.users} color="from-blue-500 to-blue-700" />
        <StatCard title="Borrowed" value={stats.borrowed} color="from-yellow-500 to-yellow-700" />
        <StatCard title="Revenue" value={`₹${stats.revenue}`} color="from-green-500 to-green-700" />
      </div>

    </div>
  );
};

export default AdminDashboard;