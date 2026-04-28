import { useEffect, useState } from "react";
import instance from "../instances/instance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth(); // MUST exist in context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await instance.get("/auth/me");

      const data = res?.data?.user;

      if (!data) throw new Error("Invalid profile response");

      setUser(data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  if (!user) return <p className="p-6 text-red-500">No user data</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Profile</h1>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
};

export default Profile;