import { useEffect, useState } from "react";
import { getMyBorrowings } from "../services/libraryServices";
import instance from "../instances/instance";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getMyBorrowings();
      const borrows = res.data?.data || [];

      setBorrowings(Array.isArray(borrows) ? borrows : []);

      const resv = await instance.get("/reservation/me");
      setReservations(resv.data?.data || []);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  const active = borrowings.filter(b => b.status === "borrowed").length;

  const overdue = borrowings.filter(
    b =>
      b.status === "borrowed" &&
      new Date(b.dueDate) < new Date()
  ).length;

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Welcome back 👋
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Stat title="Active Borrowed" value={active} color="blue" />
        <Stat title="Overdue" value={overdue} color="red" />
        <Stat title="Total Borrowed" value={borrowings.length} color="green" />
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* MY BOOKS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">My Books</h2>

          {borrowings.map((b) => (
            <div key={b._id} className="flex justify-between border-b py-3">
              <div>
                <p className="font-medium">{b.book?.title}</p>
                <p className="text-sm text-gray-500">{b.book?.author}</p>
              </div>

              <div className="text-right">
                <p className="text-sm">
                  {new Date(b.dueDate).toLocaleDateString()}
                </p>

                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600">
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* RESERVATIONS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Reservations</h2>

          {reservations.map((r) => (
            <div key={r._id} className="flex justify-between border-b py-3">
              <div>
                <p className="font-medium">{r.book?.title}</p>
                <p className="text-sm text-gray-500">{r.book?.author}</p>
              </div>

              <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-600">
                {r.status}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// STAT CARD
const Stat = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>

      <div className={`p-3 rounded-full ${colors[color]}`}>
        ●
      </div>
    </div>
  );
};

export default UserDashboard;