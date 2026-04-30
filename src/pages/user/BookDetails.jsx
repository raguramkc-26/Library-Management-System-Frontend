import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

import {
  getBookById,
  borrowBook,
  reserveBook,
  returnBook,
  getMyBorrowings
} from "../../services/bookService";

import {
  getReviews,
  getAverageRating,
  addReview
} from "../../services/reviewService";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

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
      }

    } catch {
      toast.error("Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!user) return toast.error("Login required");

    if (book.status !== "Available") {
      toast.error("Book not available");
      return;
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

    try {
      setActionLoading(true);
      await reserveBook(id);
      toast.success("Book reserved");
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

  if (loading) return <Loader />;

  if (!book)
    return <EmptyState title="Book not found" />;

  const isAvailable = book.status === "Available";
  const isBorrowed = book.status === "Borrowed";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      <Card>
        <h1 className="text-2xl font-bold">{book.title}</h1>
        <p className="text-gray-500">{book.author}</p>

        <p className="text-yellow-500">
          ⭐ {avgRating} ({reviews.length})
        </p>

        <div className="flex gap-3 mt-4">

          {isAvailable && !borrowRecord && (
            <Button onClick={handleBorrow}>
              Borrow
            </Button>
          )}

          {isBorrowed && !borrowRecord && (
            <Button onClick={handleReserve}>
              Reserve
            </Button>
          )}

          {borrowRecord && (
            <Button onClick={handleReturn}>
              Return
            </Button>
          )}

        </div>
      </Card>

      {/* Review Section stays same */}

    </div>
  );
};

export default BookDetails;