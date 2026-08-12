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
  poster: string;
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
    id: 'avenger',
    title: 'Avengers: Endgame',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10',
    format: 'IMAX',
    occupancyPct: 92,
    revenue: '$24,380',
    changePct: '+8.2%',
    positive: true,
  },
  {
    id: 'fairy-secret',
    title: 'The Fairy Secret',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdLMFblwS4y1QbzHFKs9g150scJslcAsSxTcdJMwid4w&s=10',
    format: '4DX',
    occupancyPct: 84,
    revenue: '$19,740',
    changePct: '+4.6%',
    positive: true,
  },
  {
    id: 'jurrasic-echoes',
    title: 'Jurrasic Echoes',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVj1jwI4fGAbXd6dOf3emm0PzHhQj9-ZK6nv13pb5dQ&s=10',
    format: '2D',
    occupancyPct: 67,
    revenue: '$12,150',
    changePct: '-2.1%',
    positive: false,
  },
  {
    id: 'princes',
    title: 'The 12 dancing princesses',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtWdSsPc3Lf9zMSAufsmKPEQ-aAiFwWyIVXNghzTx5UA&s=10',
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

export interface InventoryStats {
  liveScreens: number;
  avgOccupancyPct: number;
  nextShowTime: string;
}

const inventoryStats: InventoryStats = {
  liveScreens: 8,
  avgOccupancyPct: 64,
  nextShowTime: '14:30',
};

export const getDashboardStats = async (): Promise<DashboardStats> => stats;

export const getInventoryStatsData = async (): Promise<InventoryStats> => inventoryStats;

export const getWeeklySales = async (): Promise<WeeklySalesPoint[]> => weeklySales;

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => trendingMovies;

export const getLiveFeed = async (): Promise<FeedEntry[]> => liveFeed;
