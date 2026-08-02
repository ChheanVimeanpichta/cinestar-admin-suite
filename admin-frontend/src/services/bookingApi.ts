import { Booking, Seat, PaymentMethod } from "../types";
import { apiGet, apiPost } from "./api";

export function fetchSeatsForScreening(screeningId: string): Promise<Seat[]> {
  return apiGet<Seat[]>(`/screenings/${screeningId}/seats`);
}

export function confirmBooking(
  screeningId: string,
  seatIds: string[],
  paymentMethod: PaymentMethod
): Promise<Booking> {
  return apiPost<Booking>(`/screenings/${screeningId}/book`, { seatIds, paymentMethod });
}

export function fetchMyBookings(): Promise<Booking[]> {
  return apiGet<Booking[]>("/bookings/me");
}

export function fetchAllBookings(): Promise<Booking[]> {
  return apiGet<Booking[]>("/bookings");
}