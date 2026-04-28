import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// AUTH
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// USER
import UserDashboard from "./pages/user/UserDashboard";
import Books from "./pages/user/Books";
import Profile from "./pages/user/Profile";
import Notifications from "./pages/user/Notifications";
import BorrowedBooks from "./pages/user/BorrowedBooks";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import AddBook from "./pages/admin/AddBook";
import EditBook from "./pages/admin/EditBook";

// COMMON
import BookDetails from "./pages/common/BookDetails";

// LAYOUTS & ROUTES
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// UTILS
import ErrorBoundary from "./components/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // PUBLIC 
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
    errorElement: <ErrorBoundary />,
  },

  // PROTECTED (USER + COMMON) 
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/book/:id",
        element: <BookDetails />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <UserDashboard /> },
          { path: "books", element: <Books /> },
          { path: "profile", element: <Profile /> },
          { path: "borrowed", element: <BorrowedBooks /> },
          { path: "notifications", element: <Notifications /> },
        ],
      },
    ],
  },

  // ADMIN
  {
    element: <AdminRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "reviews", element: <AdminReviews /> },
          { path: "add-book", element: <AddBook /> },
          { path: "edit-book/:id", element: <EditBook /> },
        ],
      },
    ],
  },

  // 404 
  {
    path: "*",
    element: (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <p className="text-gray-500 text-lg">
          The page you’re looking for doesn’t exist
        </p>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>
    ),
  },
]);

const App = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </ErrorBoundary>
  );
};

export default App;