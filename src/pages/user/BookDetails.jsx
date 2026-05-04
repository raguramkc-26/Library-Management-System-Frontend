import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

import { getBookById } from "../../services/bookService";
import {
  borrowBook,
  reserveBook,
  returnBook,
  getMyBorrowings
} from "../../services/borrowService";

import {
  getReviews,
  getAverageRating,
  addReview
} from "../../services/reviewService";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useNavigate } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [borrowRecord, setBorrowRecord] = useState(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [bookRes, reviewRes, avgRes] = await Promise.all([
        getBookById(id),
        getReviews(id),
        getAverageRating(id)
      ]);

      const bookData = bookRes?.data?.data;

      setBook(bookData);
      setReviews(reviewRes?.data?.data || []);
      setAvgRating(avgRes?.data?.data?.avgRating || 0);

      if (user) {
        const borrowRes = await getMyBorrowings();

        const record = (borrowRes?.data?.data || []).find(
          (b) => b.book?._id === id && b.status === "borrowed"
        );

        setBorrowRecord(record || null);
      } else {
        setBorrowRecord(null);
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  // ================= SAFE FLAGS =================

  const status = book?.status?.toLowerCase();
  const isAvailable = status === "available";
  const isBorrowed = status === "borrowed";

  const canBorrow = user && isAvailable && !borrowRecord;
  const canReserve = user && isBorrowed && !borrowRecord;
  const canReturn = !!borrowRecord;

  // ================= ACTIONS =================

  const handleBorrow = async () => {
    if (!user) return toast.error("Login required");

    if (!isAvailable) {
      return toast.error("Book is no longer available");
    }

    if (borrowRecord) {
      return toast.error("You already borrowed this book");
    }

    try {
      setActionLoading(true);
      await borrowBook(id);
      toast.success("Book borrowed");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Borrow failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!user) return toast.error("Login required");

    if (!isBorrowed) {
      return toast.error("Book is not borrowed");
    }

    try {
      setActionLoading(true);
      await reserveBook(id);
      toast.success("Book reserved");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reserve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!borrowRecord?._id) return;

    try {
      setActionLoading(true);
      await returnBook(borrowRecord._id);
      toast.success("Book returned");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Return failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async () => {
    if (!user) return toast.error("Login required");
    if (!rating) return toast.error("Select rating");
    if (!comment.trim()) return toast.error("Write comment");

    try {
      setReviewLoading(true);

      await addReview(id, { rating, comment });

      toast.success("Review submitted");

      const [reviewRes, avgRes] = await Promise.all([
        getReviews(id),
        getAverageRating(id)
      ]);

      setReviews(reviewRes?.data?.data || []);
      setAvgRating(avgRes?.data?.data?.avgRating || 0);

      setRating(0);
      setComment("");

    } catch (err) {
      toast.error(err?.response?.data?.message || "Review failed");
    } finally {
      setReviewLoading(false);
    }
  };

  const navigate = useNavigate();

  // ================= UI =================

  if (loading) return <Loader />;
  if (!book) return <EmptyState title="Book not found" />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* BOOK DETAILS */}
      <Card className="p-6 flex flex-col md:flex-row gap-6 shadow-lg rounded-2xl">

        <img
          src={book.image || "https://via.placeholder.com/150"}
          alt={book.title}
          className="w-40 h-56 object-cover rounded-xl"
        />

        <div className="flex-1 space-y-4">

          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-500">{book.author}</p>

          <p className="text-yellow-500 font-medium">
            ⭐ {avgRating.toFixed(1)} ({reviews.length} reviews)
          </p>

          <p className="text-sm text-gray-400">
            Status:{" "}
            <span className="font-semibold text-indigo-600">
              {book.status}
            </span>
          </p>

          {/* DESCRIPTION */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-700">
              Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {book.description || "No description available"}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-3">

            {canBorrow && (
              <Button onClick={handleBorrow} disabled={actionLoading}>
                {actionLoading ? "Processing..." : "Borrow"}
              </Button>
            )}

            {canReserve && (
              <Button onClick={handleReserve} disabled={actionLoading}>
                Reserve
              </Button>
            )}

            {canReturn && (
              <Button
                onClick={handleReturn}
                className="bg-red-500 hover:bg-red-600"
              >
                Return
              </Button>
            )}

          </div>

        </div>
      </Card>

      {/* ADD REVIEW */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add Review</h2>

        <div className="flex gap-2">
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer text-2xl ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <Button onClick={handleReview} disabled={reviewLoading}>
          {reviewLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </Card>

      {/* REVIEWS */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border-b pb-3">
              <div className="flex justify-between">
                <p className="font-semibold">{r.user?.name}</p>
                <span className="text-yellow-500">
                  {"★".repeat(r.rating)}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{r.comment}</p>
            </div>
          ))
        )}
        <button onClick={() => navigate(-1)}>Back</button>
      </Card>

    </div>
  );
};

export default BookDetails;