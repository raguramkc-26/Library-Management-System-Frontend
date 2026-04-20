import { useEffect, useState } from "react";
import { getAdminStats, getMonthlyStats } from "../services/adminService";
import { toast } from "react-toastify";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await getAdminStats();
      const monthlyRes = await getMonthlyStats();

      setStats(statsRes || {});
      setMonthly(Array.isArray(monthlyRes) ? monthlyRes : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin dashboard");
    }
  };

  const pieData = [
    { name: "Available", value: stats.availableBooks || 0 },
    { name: "Borrowed", value: stats.borrowedBooks || 0 },
    { name: "Overdue", value: stats.overdueBooks || 0 },
  ];

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <Card title="Books" value={stats.totalBooks} />
        <Card title="Users" value={stats.totalUsers} />
        <Card title="Borrowed" value={stats.borrowedBooks} />
        <Card title="Overdue" value={stats.overdueBooks} />
        <Card title="Revenue" value={`₹${stats.revenue || 0}`} />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="mb-4 font-semibold">Library Overview</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
                <Cell fill="#6366f1" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="mb-4 font-semibold">Monthly Borrowings</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

// CARD COMPONENT
const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-xl font-bold">{value || 0}</h2>
  </div>
);

export default AdminDashboard;