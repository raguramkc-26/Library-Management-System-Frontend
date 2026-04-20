import instance from "../instances/instance";

export const userLoader = async () => {
  try {
    const res = await instance.get("/borrow/me");
    return {
      borrowings: res.data.data || [],
    };
  } catch (err) {
    console.error("Loader error:", err);
    return { borrowings: [] };
  }
};

export const adminLoader = async () => {
  try {
    const res = await instance.get("/admin/books");
    return {
      borrowings: res.data.data || [],
    };
  } catch (err) {
    console.error("Loader error:", err);
    return { borrowings: [] };
  }
};