import { Booking, Seat, PaymentMethod, BookingLedgerEntry, SecurityStreamEvent } from "../types";
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

export function fetchBookingLogStats(): Promise<{
  totalSalesToday: string;
  activeBookings: number;
  pendingValidation: number;
}> {
  return apiGet<{
    totalSalesToday: string;
    activeBookings: number;
    pendingValidation: number;
  }>("/bookings/log-stats").catch(() => ({
    totalSalesToday: "$14,280.50",
    activeBookings: 342,
    pendingValidation: 18,
  }));
}

export function fetchTransactionLedger(): Promise<BookingLedgerEntry[]> {
  return apiGet<BookingLedgerEntry[]>("/bookings/ledger").catch(() => mockLedger);
}

export function fetchSecurityStream(): Promise<SecurityStreamEvent[]> {
  return apiGet<SecurityStreamEvent[]>("/security/stream").catch(() => mockSecurityEvents);
}

const mockLedger: BookingLedgerEntry[] = [
  {
    id: "#CS-9921-X",
    customerName: "Sophia Laurent",
    customerInitials: "SL",
    movieTitle: "Avengers: Endgame",
    screeningDate: "Today",
    screeningTime: "21:00",
    seats: ["H-12", "H-13"],
    totalPrice: 28.0,
    paymentMethod: "ABA Pay",
    status: "confirmed",
  },
  {
    id: "#CS-9920-R",
    customerName: "Marcus Chen",
    customerInitials: "MC",
    movieTitle: "The Fairy Secret",
    screeningDate: "Today",
    screeningTime: "19:15",
    seats: ["D-05"],
    totalPrice: 14.0,
    paymentMethod: "ACLEDA",
    status: "confirmed",
  },
  {
    id: "#CS-9919-Q",
    customerName: "Elena Rodriguez",
    customerInitials: "ER",
    movieTitle: "Jurrasic Echoes",
    screeningDate: "Yesterday",
    screeningTime: "16:45",
    seats: ["F-08", "F-09"],
    totalPrice: 28.0,
    paymentMethod: "Wing",
    status: "confirmed",
  },
  {
    id: "#CS-9918-P",
    customerName: "James O'Brien",
    customerInitials: "JO",
    movieTitle: "SPIDER-MAN: INTO THE SPIDER-VERSE 2",
    screeningDate: "Yesterday",
    screeningTime: "18:30",
    seats: ["A-01", "A-02", "A-03"],
    totalPrice: 42.0,
    paymentMethod: "Card",
    status: "confirmed",
  },
];

const mockSecurityEvents: SecurityStreamEvent[] = [
  {
    id: "sec-1",
    timeAgo: "2 mins ago",
    message: "Suspicious login attempt blocked for user j.doe@email.com",
    highlight: "blocked",
    tone: "alert",
  },
  {
    id: "sec-2",
    timeAgo: "12 mins ago",
    message: "Booking #CS-9921 payment verified via ABA gateway",
    highlight: "verified",
    tone: "neutral",
  },
  {
    id: "sec-3",
    timeAgo: "28 mins ago",
    message: "Multiple failed auth attempts from IP 192.168.4.22 — rate limit engaged",
    highlight: "rate limit engaged",
    tone: "warning",
  },
  {
    id: "sec-4",
    timeAgo: "46 mins ago",
    message: "Admin user channa.tech performed batch seat release",
    highlight: "batch seat release",
    tone: "neutral",
  },
  {
    id: "sec-5",
    timeAgo: "1 hr ago",
    message: "SSL certificate renewed for *.cinestar.io — no downtime detected",
    highlight: "no downtime",
    tone: "neutral",
  },
];
