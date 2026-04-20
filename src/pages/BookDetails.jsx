import MainLayout from "../layouts/DashBoardLayout";
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
        instance.get(`/reviews/${id}`), // already filtered approved
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

  // BORROW
  const handleBorrow = async () => {
    try {
      await instance.post(`/borrow/${id}`);
      toast.success("Borrowed");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // RESERVE
  const handleReserve = async () => {
    try {
      await instance.post(`/reservation/${id}`);
      toast.success("Reserved");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // REVIEW
  const handleReview = async () => {
    try {
      await instance.post(`/reviews/${id}`, { rating, comment });
      toast.success("Review added");
      setRating("");
      setComment("");
      fetchData();
    } catch {
      toast.error("Failed to add review");
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-4xl mx-auto p-6">

        {/* BOOK */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-600">{book.author}</p>
          <p className="mt-2">{book.description}</p>

          <p className="mt-2 text-sm">Genre: {book.genre}</p>

          <p className="mt-2">
            Status:
            <span className="ml-2 font-semibold">
              {book.status}
            </span>
          </p>

          {/* ACTIONS */}
          <div className="mt-4 flex gap-3">
            {book.status === "Available" ? (
              <button onClick={handleBorrow} className="btn-green">
                Borrow
              </button>
            ) : (
              <button onClick={handleReserve} className="btn-yellow">
                Reserve
              </button>
            )}
          </div>
        </div>

        {/* REVIEW FORM */}
        {user && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-bold mb-2">Add Review</h2>

            <input
              placeholder="Rating (1-5)"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border p-2 mr-2"
            />

            <input
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2 mr-2"
            />

            <button onClick={handleReview} className="btn-blue">
              Submit
            </button>
          </div>
        )}

        {/* REVIEWS */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-4">Reviews</h2>

          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="border-b py-2">
                <p className="font-medium">{r.user?.name}</p>
                <p className="text-sm">⭐ {r.rating}</p>
                <p>{r.comment}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default BookDetails;