import { useEffect, useState } from "react";
import instance from "../instances/instance";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";

const BorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrowed();
  }, []);

  const fetchBorrowed = async () => {
    try {
      const res = await instance.get("/borrow/me");
      setBooks(res?.data?.data || []);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (books.length === 0)
    return <EmptyState title="No borrowed books yet" />;

  return (
    <div className="p-6 space-y-4">
      {books.map((b) => (
        <Card key={b._id} className="flex justify-between items-center p-4">

          <div className="flex gap-4 items-center">
            <img
              src={b.book?.image || "https://via.placeholder.com/100"}
              className="w-14 h-20 rounded object-cover"
            />

            <div>
              <h3 className="font-semibold">{b.book?.title}</h3>
              <p className="text-sm text-gray-500">
                Due: {new Date(b.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs ${
            b.status === "returned"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {b.status}
          </span>

        </Card>
      ))}
    </div>
  );
};

export default BorrowedBooks;