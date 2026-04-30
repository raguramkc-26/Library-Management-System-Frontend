import { useEffect, useState } from "react";
import instance from "../instances/instance";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    instance.get("/notifications").then((res) => {
      setNotifications(res.data.data || []);
    });
  }, []);

  if (notifications.length === 0)
    return <EmptyState title="No notifications yet" />;

  return (
    <div className="p-6 space-y-3">
      {notifications.map((n) => (
        <Card key={n._id}>
          <p>📢 {n.message}</p>
          <span className="text-xs text-gray-400">
            {new Date(n.createdAt).toLocaleString()}
          </span>
        </Card>
      ))}
    </div>
  );
};

export default Notifications;