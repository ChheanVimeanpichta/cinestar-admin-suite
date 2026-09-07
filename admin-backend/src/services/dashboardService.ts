import { prisma } from '../config/db.js';
import { getTheaters as getFallbackTheaters } from './mockDataService.js';


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
    userName: 'Admin',
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

let cachedInventoryStats: InventoryStats | null = null;
let lastInventoryFetchTime = 0;
const INVENTORY_CACHE_TTL_MS = 5000; // 5 seconds cache to avoid DB exhaustion

let cachedDashboardStats: DashboardStats | null = null;
let lastDashboardFetchTime = 0;

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const now = Date.now();
  if (cachedDashboardStats && now - lastDashboardFetchTime < INVENTORY_CACHE_TTL_MS) {
    return cachedDashboardStats;
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { status: { not: 'cancelled' } },
    });
    const screenings = await prisma.screening.findMany();

    if (bookings.length > 0) {
      const totalRevenue = Math.round(bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0));
      const activeBookings = bookings.length;

      const totalCapacity = screenings.length * 64;
      let totalBookedSeats = 0;
      for (const b of bookings) {
        try {
          const parsed = JSON.parse(b.seats || '[]');
          totalBookedSeats += Array.isArray(parsed) ? parsed.length : 1;
        } catch {
          totalBookedSeats += 1;
        }
      }

      const theaterOccupancyPct = totalCapacity > 0 ? Math.round((totalBookedSeats / totalCapacity) * 100) : stats.theaterOccupancyPct;

      cachedDashboardStats = {
        totalRevenue: totalRevenue > 0 ? totalRevenue : stats.totalRevenue,
        revenueChangePct: stats.revenueChangePct,
        activeBookings: activeBookings > 0 ? activeBookings : stats.activeBookings,
        theaterOccupancyPct: theaterOccupancyPct > 0 ? theaterOccupancyPct : stats.theaterOccupancyPct,
      };
      lastDashboardFetchTime = now;
      return cachedDashboardStats;
    }
  } catch (err: any) {
    console.warn('[dashboardService] Error fetching dashboard stats from DB, serving seed stats:', err?.message || err);
    if (cachedDashboardStats) return cachedDashboardStats;
  }

  return stats;
};

export const getInventoryStatsData = async (): Promise<InventoryStats> => {
  const now = Date.now();
  if (cachedInventoryStats && now - lastInventoryFetchTime < INVENTORY_CACHE_TTL_MS) {
    return cachedInventoryStats;
  }

  try {
    // 1. Calculate live screens count from Active theaters
    const activeTheatersCount = await prisma.theater.count({
      where: { status: 'Active' },
    });

    // 2. Query screenings & bookings
    const screenings = await prisma.screening.findMany({
      include: { bookings: true },
    });

    let liveScreens = activeTheatersCount;
    if (liveScreens === 0 && screenings.length > 0) {
      const uniqueHalls = new Set(screenings.map((s) => s.theaterId || s.hall));
      liveScreens = uniqueHalls.size;
    }

    let avgOccupancyPct = 64;
    let nextShowTime = '14:30';

    if (screenings.length > 0) {
      let totalCapacity = 0;
      let totalBookedSeats = 0;
      const currentTimeStr = new Date().toTimeString().slice(0, 5); // "HH:MM"
      const upcomingTimes: string[] = [];

      for (const s of screenings) {
        const hallCapacity = 64; // Standard hall capacity
        totalCapacity += hallCapacity;

        let screeningBookedSeats = 0;
        for (const b of s.bookings) {
          if (b.status !== 'cancelled') {
            try {
              const parsed = JSON.parse(b.seats || '[]');
              screeningBookedSeats += Array.isArray(parsed) ? parsed.length : 1;
            } catch {
              screeningBookedSeats += 1;
            }
          }
        }
        totalBookedSeats += screeningBookedSeats;

        if (s.time) {
          upcomingTimes.push(s.time);
        }
      }

      if (totalCapacity > 0) {
        avgOccupancyPct = Math.round((totalBookedSeats / totalCapacity) * 100);
      }

      upcomingTimes.sort();
      const future = upcomingTimes.filter((t) => t >= currentTimeStr);
      if (future.length > 0) {
        nextShowTime = future[0];
      } else if (upcomingTimes.length > 0) {
        nextShowTime = upcomingTimes[0];
      }
    }

    if (liveScreens === 0) {
      const fallbackTheaters = await getFallbackTheaters();
      liveScreens = fallbackTheaters.length > 0 ? fallbackTheaters.length : 8;
    }

    cachedInventoryStats = {
      liveScreens,
      avgOccupancyPct: Math.min(100, Math.max(0, avgOccupancyPct)),
      nextShowTime,
    };
    lastInventoryFetchTime = now;
    return cachedInventoryStats;
  } catch (err: any) {
    console.warn('[dashboardService] Error fetching inventory stats from DB, using fallback:', err?.message || err);
    if (cachedInventoryStats) return cachedInventoryStats;
    return {
      liveScreens: 8,
      avgOccupancyPct: 64,
      nextShowTime: '14:30',
    };
  }
};

export const getWeeklySales = async (): Promise<WeeklySalesPoint[]> => weeklySales;

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => trendingMovies;

export const getLiveFeed = async (): Promise<FeedEntry[]> => liveFeed;
