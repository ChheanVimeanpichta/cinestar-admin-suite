export interface DashboardSummary {
  revenue: number;
  activeBookings: number;
  occupancy: number;
  topMovies: Array<{ title: string; revenue: number }>;
  recentBookings: Array<{ transactionId: string; customer: string; total: number }>;
}
