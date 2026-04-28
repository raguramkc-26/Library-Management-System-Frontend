import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

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

      setBook(bookRes?.data?.data || null);
      setReviews(reviewRes?.data?.data || []);
    } catch (err) {
      toast.error("Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!user) return toast.error("Login required");

    try {
      setBorrowLoading(true);
      await instance.post(`/borrow/${id}`);
      toast.success("Book borrowed");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Borrow failed");
    } finally {
      setBorrowLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!user) return toast.error("Login required");

    try {
      setBorrowLoading(true);
      await instance.post(`/reservation/${id}`);
      toast.success("Book reserved");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reserve failed");
    } finally {
      setBorrowLoading(false);
    }
  };

  const handleReview = async () => {
    if (!user) return toast.error("Login required");
    if (!rating) return toast.error("Select rating");
    if (!comment.trim()) return toast.error("Write comment");

    try {
      setReviewLoading(true);

      await instance.post(`/reviews`, {
        book: id,
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
      setReviewLoading(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  if (loading) return <Loader />;

  if (!book)
    return (
      <EmptyState
        title="Book not found"
        subtitle="Try another book"
      />
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* BOOK */}
      <Card>
        <div className="grid md:grid-cols-3 gap-6">

          <img
            src={book.image || "https://via.placeholder.com/200"}
            className="w-full max-w-xs h-72 object-cover rounded mx-auto"
          />

          <div className="space-y-4">

            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-gray-500">{book.author}</p>

            <p className="text-yellow-500 font-semibold">
              ⭐ {avgRating} ({reviews.length} reviews)
            </p>

            <p>{book.description}</p>

            <span className={`px-2 py-1 rounded text-sm ${
              book.status === "Available"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {book.status}
            </span>

            <div className="flex gap-3">
              {book.status === "Available" ? (
                <Button onClick={handleBorrow} loading={borrowLoading}>
                  Borrow
                </Button>
              ) : (
                <Button onClick={handleReserve} loading={borrowLoading}>
                  Reserve
                </Button>
              )}
            </div>

          </div>
        </div>
      </Card>

      {/* REVIEW FORM */}
      {user && (
        <Card>
          <h2 className="font-semibold mb-3">Write Review</h2>

          <div className="flex gap-2 text-2xl mb-3">
            {[1,2,3,4,5].map((s) => (
              <button key={s} onClick={() => setRating(s)}>
                {s <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          <Button onClick={handleReview} loading={reviewLoading}>
            Submit
          </Button>
        </Card>
      )}

      {/* REVIEWS */}
      <Card>
        <h2 className="font-semibold mb-4">Reviews</h2>

        {reviews.length === 0 ? (
          <EmptyState title="No reviews yet" />
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border-b py-3">
              <p className="font-medium">{r.user?.name}</p>
              <p>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</p>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </Card>

    </div>
  );
};

export default BookDetails;