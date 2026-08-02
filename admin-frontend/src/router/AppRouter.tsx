import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";

import NowShowing from "../pages/user/NowShowing";
import MovieDetails from "../pages/user/MovieDetails";
import SelectScreening from "../pages/user/SelectScreening";
import SeatPicker from "../pages/user/SeatPicker";
import Payment from "../pages/user/Payment";
import Profile from "../pages/user/Profile";
import BookingHistory from "../pages/user/BookingHistory";

import Overview from "../pages/admin/Overview";
import MovieManagement from "../pages/admin/MovieManagement";
import ShowtimeManager from "../pages/admin/ShowtimeManager";
import BookingLog from "../pages/admin/BookingLog";
import Users from "../pages/admin/Users";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <NowShowing /> },
      { path: "movies/:movieId", element: <MovieDetails /> },
      { path: "movies/:movieId/screening", element: <SelectScreening /> },
      { path: "booking/:screeningId/seats", element: <SeatPicker /> },
      { path: "booking/:screeningId/payment", element: <Payment /> },
      { path: "profile", element: <Profile /> },
      { path: "profile/history", element: <BookingHistory /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: "movies", element: <MovieManagement /> },
      { path: "showtimes", element: <ShowtimeManager /> },
      { path: "bookings", element: <BookingLog /> },
      { path: "users", element: <Users /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}