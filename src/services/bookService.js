import api from "./api";

export const getAllBooks = (params) =>
  api.get("/books", { params });

export const getBookById = (id) =>
  api.get(`/books/${id}`);

export const createBook = (data) =>
  api.post("/books", data);

export const updateSingleBook = (id, data) =>
  api.put(`/books/${id}`, data);

export const deleteBook = (id) =>
  api.delete(`/books/${id}`);

export const borrowBook = (id) =>
  api.post(`/borrow/${id}`);

export const returnBook = (id) =>
  api.put(`/borrow/${id}/return`);

export const reserveBook = (id) =>
  api.post(`/reservation/${id}`);

export const getMyBorrowings = () =>
  api.get("/borrow/me");