import api from "./axios";

export const canReviewComplex = (complexId) =>
  api.get(`/reviews/can-review/${complexId}`);
export const createReview = (data) => api.post("/reviews", data);
export const updateReview = (id, data) => api.patch(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const getComplexReviews = (complexId) =>
  api.get(`/reviews/complex/${complexId}`);
export const getOwnerReviews = () => api.get("/reviews/owner");
