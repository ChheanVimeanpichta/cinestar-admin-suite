import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ReactNode } from "react";
import AdminLayout from "../layout/AdminLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useAdminAuth } from "../context/AdminAuthContext";

import Overview from "../pages/admin/Overview";
import MovieManagement from "../pages/admin/MovieManagement";
import ShowtimeManager from "../pages/admin/ShowtimeManager";
import BookingLog from "../pages/admin/BookingLog";
import Users from "../pages/admin/Users";
import Theaters from "../pages/admin/Theaters";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface text-onSurfaceVariant font-mono text-sm uppercase tracking-widest">
        Loading...
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/users",
    element: <Navigate to="/admin/users" replace />,
  },
  {
    path: "/movies",
    element: <Navigate to="/admin/movies" replace />,
  },
  {
    path: "/showtimes",
    element: <Navigate to="/admin/showtimes" replace />,
  },
  {
    path: "/bookings",
    element: <Navigate to="/admin/bookings" replace />,
  },
  {
    path: "/theaters",
    element: <Navigate to="/admin/theaters" replace />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: "movies", element: <MovieManagement /> },
      { path: "showtimes", element: <ShowtimeManager /> },
      { path: "bookings", element: <BookingLog /> },
      { path: "users", element: <Users /> },
      { path: "theaters", element: <Theaters /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/admin" replace />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}