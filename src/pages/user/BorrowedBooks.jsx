import { useEffect, useState } from "react";
import { getMyBorrowings, returnBook } from "../../services/borrowService";
import { createOrder, verifyPayment } from "../../services/paymentService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getMyBorrowings();
      setBooks(res?.data?.data || []);
    } catch {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  // PAYMENT HANDLER
  const handlePayment = async (borrowId) => {
    try {
      setPayingId(borrowId);

      const { data } = await createOrder(borrowId);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Library System",
        description: "Fine Payment",

        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful");
            fetchData();

          } catch {
            toast.error("Verification failed");
          } finally {
            setPayingId(null);
          }
        },

        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            setPayingId(null);
          },
        },

        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setPayingId(null);
      toast.error(err?.response?.data?.message || "Payment failed");
    }
  };

  // RETURN BOOK
  const handleReturn = async (borrowId) => {
    try {
      await returnBook(borrowId);
      toast.success("Book returned");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Return failed");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">My Borrowed Books</h1>

      {books.length === 0 ? (
        <p className="text-gray-400">No borrowed books</p>
      ) : (
        books.map((b) => {
          const isOverdue =
            b.status === "borrowed" &&
            new Date(b.dueDate) < new Date();

          return (
            <div
              key={b._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">

                <img
                  src={b.book?.image || "https://via.placeholder.com/60"}
                  className="w-12 h-16 rounded object-cover"
                />

                <div>
                  <p className="font-semibold">{b.book?.title}</p>

                  <p className="text-sm text-gray-400">
                    Due: {new Date(b.dueDate).toLocaleDateString()}
                  </p>

                  {/* STATUS */}
                  <div className="flex gap-2 mt-1">

                    {isOverdue && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        Overdue
                      </span>
                    )}

                    {b.finePaid && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        Paid
                      </span>
                    )}

                  </div>

                  {/* FINE */}
                  {b.fineAmount > 0 && !b.finePaid && (
                    <p className="text-red-500 text-sm mt-1">
                      Fine: ₹{b.fineAmount}
                    </p>
                  )}
                </div>

              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex gap-2">

                {/* RETURN */}
                {b.status === "borrowed" && (
                  <button
                    onClick={() => handleReturn(b._id)}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    Return
                  </button>
                )}

                {/* PAYMENT */}
                {b.fineAmount > 0 && !b.finePaid && (
                  <button
                    onClick={() => handlePayment(b._id)}
                    disabled={payingId === b._id}
                    className="bg-indigo-600 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    {payingId === b._id
                      ? "Processing..."
                      : `Pay ₹${b.fineAmount}`}
                  </button>
                )}
                <button onClick={() => navigate(-1)}>Back</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default BorrowedBooks;