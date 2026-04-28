import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ active: 0, overdue: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance.get("/borrow/me").then((res) => {
      const data = res?.data?.data || [];
      setBooks(data);

      const now = new Date();

      setStats({
        active: data.filter((b) => b.status === "borrowed").length,
        overdue: data.filter(
          (b) => b.status === "borrowed" && new Date(b.dueDate) < now
        ).length,
        total: data.length,
      });

      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p>Active</p>
          <h2 className="text-green-600 text-xl">{stats.active}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p>Overdue</p>
          <h2 className="text-red-500 text-xl">{stats.overdue}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p>Total</p>
          <h2 className="text-xl">{stats.total}</h2>
        </Card>
      </div>

      {/* BOOKS */}
      <Card>
        <h2 className="mb-3">My Books</h2>

        {books.length === 0 ? (
          <EmptyState title="No books borrowed" />
        ) : (
          books.map((b) => (
            <div key={b._id} className="flex justify-between border-b py-2">
              <p>{b.book?.title}</p>
              <span>{b.status}</span>
            </div>
          ))
        )}
      </Card>

    </div>
  );
};

export default UserDashboard;