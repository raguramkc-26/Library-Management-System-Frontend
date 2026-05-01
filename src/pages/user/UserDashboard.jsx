import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyBorrowings } from "../../services/bookService";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import StatCard from "../../components/ui/StatCard";

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    returned: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user]);

  const fetchData = async () => {
    try {
      setDataLoading(true);

      const res = await getMyBorrowings();
      const data = res?.data?.data || [];

      setBooks(data);

      const now = new Date();

      setStats({
        active: data.filter((b) => b.status === "borrowed").length,
        overdue: data.filter(
          (b) =>
            b.status === "borrowed" &&
            new Date(b.dueDate) < now
        ).length,
        returned: data.filter((b) => b.status === "returned").length,
      });

    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setDataLoading(false);
    }
  };

  if (authLoading || dataLoading) return <Loader />;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Active Books" value={stats.active} color="from-indigo-500 to-indigo-700" />
        <StatCard title="Overdue" value={stats.overdue} color="from-red-500 to-red-700" />
        <StatCard title="Returned" value={stats.returned} color="from-green-500 to-green-700" />
      </div>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">My Books</h2>

        {books.length === 0 ? (
          <p className="text-gray-400 text-center">No books found</p>
        ) : (
          books.map((b) => (
            <div key={b._id} className="flex justify-between py-3 border-b">

              <div>
                <p>{b.book?.title}</p>
                <p className="text-sm text-gray-400">
                  Due: {new Date(b.dueDate).toLocaleDateString()}
                </p>
              </div>

              <span className="text-sm">{b.status}</span>

            </div>
          ))
        )}
      </Card>

    </div>
  );
};

export default UserDashboard;