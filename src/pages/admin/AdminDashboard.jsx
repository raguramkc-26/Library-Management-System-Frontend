import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance.get("/admin/dashboard").then((res) => {
      setData(res?.data?.data || {});
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-4">

        <Card className="p-4 text-center">
          <p>Books</p>
          <h2 className="text-xl">{data.books}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p>Users</p>
          <h2 className="text-xl">{data.users}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p>Borrowed</p>
          <h2 className="text-xl">{data.borrowed}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p>Overdue</p>
          <h2 className="text-red-500 text-xl">{data.overdue}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p>Revenue</p>
          <h2 className="text-green-600 text-xl">₹{data.revenue}</h2>
        </Card>

      </div>

      {/* SUMMARY */}
      <Card className="p-6">
        <p className="text-gray-500 text-sm">
          System overview of library performance
        </p>
      </Card>

    </div>
  );
};

export default AdminDashboard;