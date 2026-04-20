import instance from "../instances/instance";

export const searchBooks = async (params) => {
  const query = new URLSearchParams(params).toString();
  const res = await instance.get(`/books?${query}`);
  return res.data;
};