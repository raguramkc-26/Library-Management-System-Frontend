import api from "./api";

// GET REVIEWS FOR BOOK
export const getReviews = (bookId) =>
  api.get(`/reviews/${bookId}`);

// GET AVERAGE RATING
export const getAverageRating = (bookId) =>
  api.get(`/reviews/${bookId}/average`);

// ADD REVIEW
export const addReview = (bookId, data) =>
  api.post(`/reviews/${bookId}`, data);

// ADMIN - GET PENDING REVIEWS (optional)
export const getPendingReviews = () =>
  api.get("/reviews/pending");