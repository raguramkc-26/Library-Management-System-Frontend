import { useEffect, useState } from "react";
import instance from "../instances/instance";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await instance.get("/borrow/me");

      const data = res?.data?.data || [];

      setBooks(data);

      const now = new Date();

      setStats({
        active: data.filter((b) => b.status === "borrowed").length,
        overdue: data.filter(
          (b) =>
            b.status === "borrowed" &&
            b.dueDate &&
            new Date(b.dueDate) < now
        ).length,
        total: data.length,
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Welcome back 👋
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card title="Active Borrowed" value={stats.active} />
        <Card title="Overdue" value={stats.overdue} />
        <Card title="Total Borrowed" value={stats.total} />
      </div>

      {/* BOOKS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="mb-4 font-semibold">My Books</h2>

        {books.length === 0 ? (
          <p className="text-gray-400 text-center">
            No borrowed books
          </p>
        ) : (
          books.map((b) => (
            <div key={b._id} className="flex gap-4 py-3 border-b">

              <img
                src={b.book?.image || "https://via.placeholder.com/40"}
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/40")
                }
                className="w-10 h-14 rounded"
                alt="book"
              />

              <div className="flex-1">
                <p className="font-medium">
                  {b.book?.title || "Unknown"}
                </p>

                <p className="text-sm text-gray-500">
                  Due:{" "}
                  {b.dueDate
                    ? new Date(b.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <span
                className={`px-2 py-1 text-xs rounded ${
                  b.status === "returned"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {b.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-xl font-bold">{value || 0}</h2>
  </div>
);

export default UserDashboard;