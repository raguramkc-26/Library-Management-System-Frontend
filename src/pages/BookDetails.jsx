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
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const fetchData = async () => {
    try {
      const [bookRes, reviewRes] = await Promise.all([
        instance.get(`/books/${id}`),
        instance.get(`/reviews/${id}`),
      ]);

      setBook(bookRes.data);
      setReviews(reviewRes.data.reviews || []);
    } catch {
      toast.error("Failed to load book");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBorrow = async () => {
    try {
      await instance.post(`/borrow/${id}`);
      toast.success("Book borrowed");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message);
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
    if (!rating || !comment) {
      return toast.error("Rating and comment required");
    }

    try {
      await instance.post(`/reviews/${id}`, {
        rating: Number(rating),
        comment,
      });

      toast.success("Review submitted");
      setRating("");
      setComment("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    }
  };

  if (!book) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* BOOK SECTION */}
        <div className="bg-white rounded-2xl shadow-lg p-6 grid md:grid-cols-3 gap-6">

          {/* IMAGE */}
          <div>
            <img
              src={book.image || "https://via.placeholder.com/200x300"}
              alt={book.title}
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>

          {/* DETAILS */}
          <div className="md:col-span-2 space-y-3">
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <p className="text-gray-600">{book.author}</p>

            <p className="text-gray-700">{book.description}</p>

            <p className="text-sm">
              <span className="font-semibold">Genre:</span> {book.genre}
            </p>

            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                  book.status === "Available"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {book.status}
              </span>
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mt-4">
              {book.status === "Available" ? (
                <button
                  onClick={handleBorrow}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Borrow
                </button>
              ) : (
                <button
                  onClick={handleReserve}
                  className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Reserve
                </button>
              )}
            </div>
          </div>
        </div>

        {/* REVIEW FORM */}
        {user && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="font-semibold mb-4 text-lg">Add Review</h2>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Rating</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} ⭐
                  </option>
                ))}
              </select>

              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                className="p-2 border rounded"
              />
            </div>

            <button
              onClick={handleReview}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Submit Review
            </button>
          </div>
        )}

        {/* REVIEWS */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="font-semibold mb-4 text-lg">Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="border-b py-3">
                <p className="font-semibold">{r.user?.name}</p>
                <p className="text-yellow-500 text-sm">⭐ {r.rating}</p>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default BookDetails;