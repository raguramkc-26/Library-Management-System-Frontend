import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../services/libraryServices";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    search: "",
    genre: "",
    availability: "",
    author: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async (filters = searchParams) => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...filters,
      };

      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const response = await getAllBooks(params);
      setBooks(response.books || []);
      setTotalPages(response.totalPages || 1);
    } catch {
      toast.error("Failed to fetch the book catalog.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const handleBookClick = (bookId) => {
    // Admin can view but not act
    navigate(`/book/${bookId}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      Available: "bg-green-100 text-green-800",
      Borrowed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-indigo-700 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-2">
          Discover Your Next Great Read
        </h1>

        <p className="text-indigo-100">
          Browse books, explore knowledge, and manage your library.
        </p>

        {/* 🔥 ADMIN MODE INDICATOR */}
        {user?.role === "admin" && (
          <p className="mt-3 text-yellow-300 font-semibold">
            Admin Mode (Read-only)
          </p>
        )}
      </div>

      {/* SEARCH */}
      <div className="container mx-auto px-4 py-6">
        <form
          onSubmit={handleSearch}
          className="bg-white p-4 rounded shadow flex flex-wrap gap-3"
        >
          <input
            placeholder="Search..."
            value={searchParams.search}
            onChange={(e) =>
              setSearchParams({ ...searchParams, search: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Author"
            value={searchParams.author}
            onChange={(e) =>
              setSearchParams({ ...searchParams, author: e.target.value })
            }
            className="border p-2 rounded"
          />

          <select
            value={searchParams.genre}
            onChange={(e) =>
              setSearchParams({ ...searchParams, genre: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
          </select>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </form>
      </div>

      {/* BOOKS */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <p>Loading...</p>
        ) : books.length === 0 ? (
          <p>No books found</p>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                onClick={() => handleBookClick(book._id)}
                className={`bg-white p-4 rounded shadow transition ${
                  user?.role === "admin"
                    ? "cursor-default"
                    : "cursor-pointer hover:shadow-lg"
                }`}
              >
                <h3 className="font-bold">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>

                <span
                  className={`text-xs px-2 py-1 rounded mt-2 inline-block ${getStatusColor(
                    book.status
                  )}`}
                >
                  {book.status}
                </span>

                {/* 🔥 ADMIN BADGE */}
                {user?.role === "admin" && (
                  <p className="text-xs text-indigo-500 mt-2">
                    Admin View
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;