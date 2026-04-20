import { useEffect, useState } from "react";
import instance from "../instances/instance";

const Profile = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get("/borrow/me");
        setBooks(res.data.books);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>No borrowed books</p>
      ) : (
        <div className="space-y-4">
          {books.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">
                {item.book?.title}
              </h2>
              <p>{item.book?.author}</p>
              <p>Status: {item.status}</p>
              <p>
                Due:{" "}
                {new Date(item.dueDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;