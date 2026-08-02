// Shared domain types used across user + admin pages

export type ScreeningFormat = "IMAX" | "4DX" | "STANDARD" | "DOLBY" | "2D";

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  bannerUrl?: string;
  synopsis: string;
  genre: string[];
  durationMins: number;
  rating: string; // e.g. PG-13
  releaseDate: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
}

export interface Screening {
  id: string;
  movieId: string;
  theaterId: string;
  date: string;      // ISO date
  time: string;       // e.g. "18:30"
  format: ScreeningFormat;
  hall: string;
  price: number;
}

export type SeatStatus = "available" | "selected" | "occupied";

export interface Seat {
  id: string;         // e.g. "F7"
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
}

export type PaymentMethod = "ABA" | "ACLEDA" | "WING";

export interface Booking {
  id: string;
  userId: string;
  movieTitle: string;
  screening: Screening;
  seats: Seat[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "customer" | "admin";
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChangePct: number;
  activeBookings: number;
  theaterOccupancyPct: number;
}