import { useEffect, useState } from "react";
import instance from "../instances/instance";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await instance.get("/reviews/pending");
    setReviews(res.data.data);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleAction = async (id, action) => {
    await instance.patch(`/reviews/${id}/${action}`);
    fetchReviews();
  };

  return (
    <div className="p-6">
      <h2 className="font-bold mb-4">Pending Reviews</h2>
      {reviews.map(r => (
        <div key={r._id} className="border p-3 mb-2">
          <p>{r.book?.title} - {r.user?.name}</p>
          <p>{r.comment}</p>

          <button onClick={() => handleAction(r._id, "approve")}>Approve</button>
          <button onClick={() => handleAction(r._id, "reject")}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default AdminReviews;