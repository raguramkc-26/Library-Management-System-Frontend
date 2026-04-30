import api from "./api";

export const getPendingReviews = () => api.get("/reviews/pending");

export const approveReview = (id) =>
  api.patch(`/reviews/${id}/approve`);

export const rejectReview = (id) =>
  api.patch(`/reviews/${id}/reject`);