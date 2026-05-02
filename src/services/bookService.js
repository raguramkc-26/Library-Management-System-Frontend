import api from "./api";

// BOOKS ONLY
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