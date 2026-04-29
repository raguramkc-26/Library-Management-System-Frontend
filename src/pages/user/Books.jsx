import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../instances/instance";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

const Books = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const result = books.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setPage(1);
  }, [search, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/books");
      const data = res?.data?.books || res?.data || [];
      setBooks(data);
      setFiltered(data);
    } catch {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (filtered.length === 0) {
    return (
      <div className="p-6">
        <EmptyState title="No books found" subtitle="Try another search" />
      </div>
    );
  }

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="p-6 space-y-6">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {paginated.map((b) => (
          <Card key={b._id} className="hover:shadow-lg transition">

            <img
              src={b.image || "https://via.placeholder.com/150"}
              className="w-full h-44 object-cover rounded"
            />

            <div className="mt-3">
              <h2 className="font-semibold">{b.title}</h2>
              <p className="text-sm text-gray-500">{b.author}</p>

              <span className={`text-xs font-bold px-2 py-1 rounded ${
                b.status === "Available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {b.status}
              </span>
            </div>

            <div className="mt-3">
              <Button onClick={() => navigate(`/book/${b._id}`)}>
                View Details
              </Button>
            </div>

          </Card>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-6">

  <button
    onClick={() => setPage((p) => Math.max(p - 1, 1))}
    disabled={page === 1}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Prev
  </button>

  <span className="text-sm font-medium">
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
    disabled={page === totalPages}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Next
  </button>

</div>

    </div>
  );
};

export default Books;