import api from "./api";

export const createOrder = (borrowId) =>
  api.post(`/payments/${borrowId}/create-order`);

export const verifyPayment = (data) =>
  api.post("/payments/verify", data);

export const getPaymentHistory = () =>
  api.get("/payments/history");