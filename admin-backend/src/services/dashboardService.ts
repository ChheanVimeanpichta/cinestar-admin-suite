// Dashboard data service.
// NOTE: The backend has no DB tables for bookings/movies/theaters yet, so the
// dashboard endpoints serve representative seed data matching the admin
// frontend contracts. Swap these functions for real Prisma queries once the
// Booking/Movie/Theater models exist.

export interface DashboardStats {
  totalRevenue: number;
  revenueChangePct: number;
  activeBookings: number;
  theaterOccupancyPct: number;
}

export interface WeeklySalesPoint {
  day: string;
  revenue: number;
}

export interface TrendingMovie {
  id: string;
  title: string;
  posterUrl: string;
  format: string;
  occupancyPct: number;
  revenue: string;
  changePct: string;
  positive: boolean;
}

export interface FeedEntry {
  id: string;
  timestamp: string;
  action: string;
  targetEntity: string;
  userName: string;
  userInitials: string;
  status: 'success' | 'updated' | 'pending' | 'failed';
}

const stats: DashboardStats = {
  totalRevenue: 128_540,
  revenueChangePct: 12.4,
  activeBookings: 342,
  theaterOccupancyPct: 78,
};

const weeklySales: WeeklySalesPoint[] = [
  { day: 'Mon', revenue: 18400 },
  { day: 'Tue', revenue: 15200 },
  { day: 'Wed', revenue: 17100 },
  { day: 'Thu', revenue: 19900 },
  { day: 'Fri', revenue: 26300 },
  { day: 'Sat', revenue: 31200 },
  { day: 'Sun', revenue: 28400 },
];

const trendingMovies: TrendingMovie[] = [
  {
    id: 'mv-neon-dusk',
    title: 'Neon Dusk',
    posterUrl: 'https://picsum.photos/seed/neon-dusk/120/180',
    format: 'IMAX',
    occupancyPct: 92,
    revenue: '$24,380',
    changePct: '+8.2%',
    positive: true,
  },
  {
    id: 'mv-starlight',
    title: 'Starlight Heist',
    posterUrl: 'https://picsum.photos/seed/starlight-heist/120/180',
    format: '4DX',
    occupancyPct: 84,
    revenue: '$19,740',
    changePct: '+4.6%',
    positive: true,
  },
  {
    id: 'mv-quiet-harbor',
    title: 'Quiet Harbor',
    posterUrl: 'https://picsum.photos/seed/quiet-harbor/120/180',
    format: '2D',
    occupancyPct: 67,
    revenue: '$12,150',
    changePct: '-2.1%',
    positive: false,
  },
  {
    id: 'mv-clockwork',
    title: 'Clockwork Crown',
    posterUrl: 'https://picsum.photos/seed/clockwork-crown/120/180',
    format: 'DOLBY',
    occupancyPct: 71,
    revenue: '$14,920',
    changePct: '+1.8%',
    positive: true,
  },
];

const liveFeed: FeedEntry[] = [
  {
    id: '1',
    timestamp: '12:44:21',
    action: 'BOOKING_CONFIRMED',
    targetEntity: 'Ticket #CS-9901',
    userName: 'Jane Doe',
    userInitials: 'JD',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '12:43:05',
    action: 'SHOWTIME_MODIFIED',
    targetEntity: 'Neon Dusk (Hall 1)',
    userName: 'System Admin',
    userInitials: 'SA',
    status: 'updated',
  },
  {
    id: '3',
    timestamp: '12:41:59',
    action: 'REFUND_PROCESSED',
    targetEntity: 'Ticket #CS-8722',
    userName: 'Mike Tech',
    userInitials: 'MT',
    status: 'pending',
  },
  {
    id: '4',
    timestamp: '12:40:12',
    action: 'BOOKING_CONFIRMED',
    targetEntity: 'Ticket #CS-9897',
    userName: 'Sara Lin',
    userInitials: 'SL',
    status: 'success',
  },
  {
    id: '5',
    timestamp: '12:38:47',
    action: 'PAYMENT_FAILED',
    targetEntity: 'Booking #BK-5541',
    userName: 'Alex Kim',
    userInitials: 'AK',
    status: 'failed',
  },
];

export const getDashboardStats = async (): Promise<DashboardStats> => stats;

export const getWeeklySales = async (): Promise<WeeklySalesPoint[]> => weeklySales;

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => trendingMovies;

export const getLiveFeed = async (): Promise<FeedEntry[]> => liveFeed;
