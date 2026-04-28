import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "../instances/instance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [bookRes, reviewRes] = await Promise.all([
        instance.get(`/books/${id}`),
        instance.get(`/reviews/${id}`),
      ]);

      setBook(bookRes?.data);
      setReviews(reviewRes?.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  // BORROW
  const handleBorrow = async () => {
    if (!user) return toast.error("Login required");

    try {
      setActionLoading(true);

      await instance.post(`/borrow`, { bookId: id }); // FIXED

      toast.success("Book borrowed");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Borrow failed");
    } finally {
      setActionLoading(false);
    }
  };

  // RESERVE
  const handleReserve = async () => {
    try {
      setActionLoading(true);

      await instance.post(`/reservation`, { bookId: id });

      toast.success("Book reserved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reserve failed");
    } finally {
      setActionLoading(false);
    }
  };

  // REVIEW
  const handleReview = async () => {
    if (!user) return toast.error("Login required");
    if (!rating) return toast.error("Select rating");
    if (!comment.trim()) return toast.error("Write comment");

    try {
      setActionLoading(true);

      await instance.post(`/reviews`, {
        bookId: id,
        rating,
        comment,
      });

      toast.success("Review submitted");
      setRating(0);
      setComment("");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Review failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  if (!book) {
    return <p className="p-10 text-center text-gray-500">Book not found</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* BOOK CARD */}
      <div className="bg-white p-6 rounded-xl shadow grid md:grid-cols-3 gap-6">

        <img
          src={book.image || "https://via.placeholder.com/150"}
          onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          className="w-40 h-60 object-cover rounded"
        />

        <div className="md:col-span-2 space-y-3">

          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-500">{book.author}</p>

          <p className="text-sm text-gray-600">
            Genre: {book.genre || "N/A"}
          </p>

          <p>{book.description}</p>

          <p>
            Status:
            <span
              className={`ml-2 font-semibold ${
                book.status === "Available"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {book.status}
            </span>
          </p>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-4 flex-wrap">

            {book.status === "Available" ? (
              <button
                onClick={handleBorrow}
                disabled={actionLoading}
                className="bg-green-600 text-white px-5 py-2 rounded disabled:bg-gray-400"
              >
                {actionLoading ? "Processing..." : "Borrow"}
              </button>
            ) : (
              <button
                onClick={handleReserve}
                disabled={actionLoading}
                className="bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                Reserve
              </button>
            )}

          </div>
        </div>
      </div>

      {/* REVIEW FORM */}
      {user && (
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Add Review</h2>

          <div className="flex gap-2 text-xl mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className={s <= rating ? "text-yellow-400" : "text-gray-300"}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="Write review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          <button
            onClick={handleReview}
            disabled={actionLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      )}

      {/* REVIEWS */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center">No reviews</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border-b py-3">
              <p className="font-medium">{r.user?.name}</p>
              <p className="text-yellow-500">
                {"★".repeat(r.rating)}
              </p>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default BookDetails;