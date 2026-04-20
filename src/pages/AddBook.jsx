import { useState } from "react";
import instance from "../instances/instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await instance.post("/books", form);
      toast.success("Book added successfully");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Add Book</h1>

      <input name="title" placeholder="Title" onChange={handleChange} className="input" />
      <input name="author" placeholder="Author" onChange={handleChange} className="input" />
      <input name="genre" placeholder="Genre" onChange={handleChange} className="input" />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="input" />

      <button onClick={handleSubmit} className="btn-blue mt-4">
        Add Book
      </button>
    </div>
  );
};

export default AddBook;