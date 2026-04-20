import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login"
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookDetails from "./pages/BookDetails";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { adminLoader, userLoader } from './loaders/roleLoader';
import DashboardLayout from "./layouts/DashBoardLayout";
import PaymentHistory from "./pages/PaymentHistory";
import authLoader from './loaders/authLoader';
import Books from "./pages/Books";
import AdminReviews from "./pages/AdminReviews";
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },

  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  { path: "/books", element: <Books /> },
  { path: "/book/:id", element: <BookDetails /> },

  { path: "/payments", element: <PaymentHistory /> },

  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <UserDashboard /> },
  ],
  },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [{ path: "dashboard", element: <AdminDashboard /> },
    ],
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer/>
    </>
  )
}

export default App;