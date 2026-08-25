import { FeedEntry } from "../components/admin/SystemLiveFeed";

export const mockLiveFeed: FeedEntry[] = [
  {
    id: "1",
    timestamp: "12:44:21",
    action: "BOOKING_CONFIRMED",
    targetEntity: "Ticket #CS-9901",
    userName: "Jane Doe",
    userInitials: "JD",
    status: "success",
  },
  {
    id: "2",
    timestamp: "12:43:05",
    action: "SHOWTIME_MODIFIED",
    targetEntity: "Neon Dusk (Hall 1)",
    userName: "Admin",
    userInitials: "SA",
    status: "updated",
  },
  {
    id: "3",
    timestamp: "12:41:59",
    action: "REFUND_PROCESSED",
    targetEntity: "Ticket #CS-8722",
    userName: "Mike Tech",
    userInitials: "MT",
    status: "pending",
  },
];
