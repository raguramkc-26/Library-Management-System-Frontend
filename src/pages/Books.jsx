import MainLayout from "../layouts/DashBoardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../instances/instance";
import { toast } from "react-toastify";

const Books = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await instance.get("/books/search", {
        params: { q: query, genre, page },
      });

      setBooks(res.data.data || []);
    } catch {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [query, genre, page]);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-4">Books</h1>

        {/* FILTERS */}
        <div className="flex gap-4 mb-6">
          <input
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
          </select>
        </div>

        {/* BOOK LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : books.length === 0 ? (
          <p>No books found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {books.map((b) => (
              <div
                key={b._id}
                className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md"
                onClick={() => navigate(`/book/${b._id}`)}
              >
                <h3 className="font-bold">{b.title}</h3>
                <p className="text-sm text-gray-600">{b.author}</p>
                <p className="text-xs mt-2">{b.genre}</p>

                <span
                  className={`text-xs mt-2 inline-block ${
                    b.status === "Available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex gap-3 mt-6">
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
            Prev
          </button>
          <span>Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Books;