import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../services/authServices";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { setUser } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Email and password are required");
    }

    try {
      setLoading(true);

      const res = await loginUser(formData);

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);

      setUser(user);

      toast.success("Login successful");

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login Error:", err);

      toast.error(
        err.response?.data?.message || err.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6">

        {/* LOGO */}
        <div className="text-center">
          <Link to="/" className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">LMS</span>
            </div>
          </Link>

          <h2 className="text-2xl font-bold">Sign in to your account</h2>

          <p className="text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              create a new account
            </Link>
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            className="w-full border p-2 rounded"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-blue-600">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-sm text-blue-600">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;