import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../instances/instance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Books = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [genre, setGenre] = useState("");
  const [available, setAvailable] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(fetchBooks, 400);
    return () => clearTimeout(delay);
  }, [keyword, genre, available, page]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/books", {
        params: { keyword, genre, available, page },
      });

      setBooks(res.data.books || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this book?")) return;

    try {
      await instance.delete(`/admin/books/${id}`);
      toast.success("Book deleted");
      fetchBooks();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/admin/edit-book/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Books</h1>

        {isAdmin && (
          <button
            onClick={() => navigate("/admin/add-book")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + Add Book
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          placeholder="Search..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
        </select>

        <select
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="true">Available</option>
          <option value="false">Borrowed</option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-400">No books found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {books.map((b) => (
            <div
              key={b._id}
              onClick={() => navigate(`/book/${b._id}`)}
              className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer"
            >
              <img
                src={b.image || "https://via.placeholder.com/150"}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <h3 className="font-bold">{b.title}</h3>
              <p className="text-sm text-gray-500">{b.author}</p>

              <span
                className={`text-xs font-semibold ${
                  b.status === "Available"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {b.status}
              </span>

              {isAdmin && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => handleEdit(b._id, e)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => handleDelete(b._id, e)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Books;