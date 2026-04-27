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
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [bookRes, reviewRes] = await Promise.all([
        instance.get(`/books/${id}`),
        instance.get(`/reviews/${id}`),
      ]);

      setBook(bookRes.data);
      setReviews(reviewRes.data.data || []);
    } catch {
      toast.error("Failed to load book");
    }
  };

  const handleBorrow = async () => {
    try {
      setBorrowing(true);
      await instance.post(`/borrow/${id}`);
      toast.success("Book borrowed");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Borrow failed");
    } finally {
      setBorrowing(false);
    }
  };

  const handleReserve = async () => {
    try {
      await instance.post(`/reservation/${id}`);
      toast.success("Book reserved");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleReview = async () => {
    if (!rating) return toast.error("Select rating");
    if (!comment.trim()) return toast.error("Write comment");

    try {
      await instance.post(`/reviews/${id}`, { rating, comment });
      toast.success("Review submitted (waiting for approval)");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  if (!book) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* BOOK */}
      <div className="bg-white p-6 rounded-xl shadow-sm border grid md:grid-cols-3 gap-6">

        <img
          src={book.image || "https://via.placeholder.com/150"}
          onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          className="w-40 h-60 object-cover rounded"
        />

        <div className="md:col-span-2 space-y-3">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-500">{book.author}</p>

          <p className="text-sm">Genre: {book.genre}</p>
          <p>{book.description}</p>

          <p>
            Status:
            <span className="ml-2 font-semibold">
              {book.status}
            </span>
          </p>

          {/* ACTIONS */}
          {user?.role === "user" ? (
            book.status === "Available" ? (
              <button
                onClick={handleBorrow}
                disabled={borrowing}
                className="bg-green-600 text-white px-5 py-2 rounded"
              >
                {borrowing ? "Borrowing..." : "Borrow Book"}
              </button>
            ) : (
              <button
                onClick={handleReserve}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Reserve
              </button>
            )
          ) : (
            <p className="text-red-500 text-sm">
              Only users can borrow books
            </p>
          )}
        </div>
      </div>

      {/* REVIEW */}
      {user && (
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="font-semibold mb-2">Add Review</h2>

          <p className="text-sm text-gray-500 mb-2">
            Reviews appear after admin approval
          </p>

          <div className="flex gap-2 mb-2">
            {[1,2,3,4,5].map((s) => (
              <button key={s} onClick={() => setRating(s)}>
                ★
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 mb-2"
          />

          <button
            onClick={handleReview}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* REVIEWS */}
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="font-semibold mb-3">Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center">
            No reviews yet
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border-b py-3">
              <p className="font-medium">{r.user?.name}</p>
              <p>{"★".repeat(r.rating)}</p>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookDetails;