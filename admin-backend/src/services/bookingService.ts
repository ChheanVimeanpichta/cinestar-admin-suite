import { prisma } from '../config/db.js';
import {
  BookingLedgerEntry,
  BookingLogStats,
  getBookingLedger as getFallbackLedger,
  getBookingLogStats as getFallbackStats,
} from './mockDataService.js';
import { recordSecurityEvent } from './securityService.js';

let cachedLedger: BookingLedgerEntry[] | null = null;
let lastLedgerFetchTime = 0;
const CACHE_TTL_MS = 2000;

export interface CreateBookingInput {
  id?: string;
  userId?: string;
  customerName?: string;
  movieTitle: string;
  screeningId?: string;
  screeningDate?: string;
  screeningTime?: string;
  seats: string[] | string;
  totalPrice: number;
  paymentMethod?: string;
  status?: string;
}

function extractInitials(name?: string): string {
  if (!name) return 'CU';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function parseSeats(seatsRaw: any): string[] {
  if (Array.isArray(seatsRaw)) return seatsRaw;
  if (typeof seatsRaw === 'string') {
    try {
      const parsed = JSON.parse(seatsRaw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // not json, split by comma or return single
      if (seatsRaw.includes(',')) {
        return seatsRaw.split(',').map((s) => s.trim());
      }
      return [seatsRaw];
    }
  }
  return [];
}

export const getBookingLedgerFromDb = async (): Promise<BookingLedgerEntry[]> => {
  const now = Date.now();
  if (cachedLedger && now - lastLedgerFetchTime < CACHE_TTL_MS) {
    return cachedLedger;
  }

  try {
    const dbBookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    if (dbBookings && dbBookings.length > 0) {
      const mapped: BookingLedgerEntry[] = dbBookings.map((b) => {
        const seats = parseSeats(b.seats);
        const name = b.customerName || 'Customer';
        const initials = extractInitials(name);

        const dateStr =
          b.screeningDate ||
          new Date(b.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

        const timeStr =
          b.screeningTime ||
          new Date(b.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

        return {
          id: b.id.startsWith('#') ? b.id : `#${b.id}`,
          customerName: name,
          customerInitials: initials,
          movieTitle: b.movieTitle,
          screeningDate: dateStr,
          screeningTime: timeStr,
          seats,
          totalPrice: b.totalPrice,
          paymentMethod: b.paymentMethod || 'ABA Pay',
          status: b.status || 'confirmed',
          createdAt: b.createdAt.toISOString(),
        } as BookingLedgerEntry;
      });

      cachedLedger = mapped;
      lastLedgerFetchTime = now;
      return mapped;
    }
  } catch (err: any) {
    console.warn('[bookingService] Error fetching bookings from MySQL DB, using fallback:', err?.message || err);
    if (cachedLedger) return cachedLedger;
  }

  const fallback = await getFallbackLedger();
  cachedLedger = fallback;
  return fallback;
};

export const getBookingLogStatsFromDb = async (): Promise<BookingLogStats> => {
  try {
    const allBookings = await prisma.booking.findMany({
      select: { totalPrice: true, status: true, createdAt: true },
    });

    if (allBookings.length > 0) {
      // Calculate today's sales
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const todayBookings = allBookings.filter(
        (b) => new Date(b.createdAt) >= startOfToday
      );

      const todayTotal = todayBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      const allTimeTotal = allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      // If no sales today, show all time or today's amount
      const salesDisplay = todayTotal > 0 ? todayTotal : allTimeTotal;

      const activeBookings = allBookings.filter(
        (b) => b.status === 'confirmed' || b.status === 'Active'
      ).length;

      const pendingValidation = allBookings.filter(
        (b) => b.status === 'pending' || b.status === 'Pending'
      ).length;

      return {
        totalSalesToday: `$${salesDisplay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        activeBookings: activeBookings || allBookings.length,
        pendingValidation,
      };
    }
  } catch (err: any) {
    console.warn('[bookingService] Error calculating booking stats from DB, using fallback:', err?.message || err);
  }

  return getFallbackStats();
};

export const getOccupiedSeatsFromDb = async (query: {
  movieTitle?: string;
  screeningDate?: string;
  screeningTime?: string;
  screeningId?: string;
}): Promise<string[]> => {
  try {
    const whereClause: any = {
      status: { notIn: ['cancelled', 'refunded'] },
    };
    if (query.movieTitle) {
      whereClause.movieTitle = { contains: query.movieTitle };
    }
    if (query.screeningDate) {
      whereClause.screeningDate = query.screeningDate;
    }
    if (query.screeningTime) {
      whereClause.screeningTime = query.screeningTime;
    }
    if (query.screeningId) {
      whereClause.screeningId = query.screeningId;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      select: { seats: true },
    });

    const seatSet = new Set<string>();
    for (const b of bookings) {
      const parsed = parseSeats(b.seats);
      for (const s of parsed) {
        if (s) seatSet.add(s.trim().toUpperCase());
      }
    }

    return Array.from(seatSet);
  } catch (err: any) {
    console.warn('[bookingService] Error getting occupied seats from DB:', err?.message || err);
    return [];
  }
};

export const getBookingsByCustomer = async (identifier: string) => {
  try {
    const cleanId = identifier.trim();
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: cleanId.toLowerCase() },
          { id: cleanId },
          { name: cleanId },
        ],
      },
    });

    const conditions: any[] = [
      { userId: cleanId },
      { userId: cleanId.toLowerCase() },
      { customerName: cleanId },
    ];

    if (customer) {
      conditions.push({ userId: customer.id });
      conditions.push({ userId: customer.email });
      conditions.push({ customerName: customer.name });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        OR: conditions,
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => ({
      id: b.id.startsWith('#') ? b.id : `#${b.id}`,
      movieTitle: b.movieTitle,
      date: b.screeningDate || new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: b.screeningTime || new Date(b.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      seats: parseSeats(b.seats),
      ticketCount: parseSeats(b.seats).length,
      total: b.totalPrice,
      paymentMethod: b.paymentMethod,
      status: b.status,
      cinema: b.screeningId ? `Screen ${b.screeningId}` : 'CineStar Cinema',
      createdAt: b.createdAt.toISOString(),
    }));
  } catch (err: any) {
    console.warn('[bookingService] Error getting bookings by customer:', err?.message || err);
    return [];
  }
};

export const createBookingInDb = async (data: CreateBookingInput) => {
  try {
    const requestedSeats = parseSeats(data.seats);
    const seatsStr = Array.isArray(data.seats) ? JSON.stringify(data.seats) : String(data.seats);

    // Conflict Check: Prevent double-booking on same movie session
    if (data.movieTitle && requestedSeats.length > 0) {
      const conflictWhere: any = {
        status: { notIn: ['cancelled', 'refunded'] },
        movieTitle: data.movieTitle,
      };
      if (data.screeningDate) {
        conflictWhere.screeningDate = data.screeningDate;
      }
      if (data.screeningTime) {
        conflictWhere.screeningTime = data.screeningTime;
      }

      const existing = await prisma.booking.findMany({
        where: conflictWhere,
        select: { seats: true },
      });

      const alreadyOccupied = new Set<string>();
      for (const eb of existing) {
        for (const s of parseSeats(eb.seats)) {
          alreadyOccupied.add(s.toUpperCase().trim());
        }
      }

      const conflicting = requestedSeats.filter((s) => alreadyOccupied.has(s.toUpperCase().trim()));
      if (conflicting.length > 0) {
        const err = new Error(`SEAT_CONFLICT: Seat(s) ${conflicting.join(', ')} are already booked for this session.`);
        (err as any).status = 409;
        (err as any).conflictingSeats = conflicting;
        throw err;
      }
    }

    const bookingId =
      data.id ||
      `#CS-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

    const created = await prisma.booking.create({
      data: {
        id: bookingId,
        userId: data.userId || 'guest-user',
        customerName: data.customerName || 'Guest Customer',
        movieTitle: data.movieTitle,
        screeningId: data.screeningId || null,
        screeningDate: data.screeningDate || new Date().toISOString().slice(0, 10),
        screeningTime: data.screeningTime || '20:00',
        seats: seatsStr,
        totalPrice: Number(data.totalPrice) || 0,
        paymentMethod: data.paymentMethod || 'ABA Pay',
        status: data.status || 'confirmed',
      },
    });

    // Also increment customer's bookingCount if they match a customer account
    if (data.userId || data.customerName) {
      try {
        await prisma.customer.updateMany({
          where: {
            OR: [
              ...(data.userId ? [{ id: data.userId }, { email: data.userId.toLowerCase() }] : []),
              ...(data.customerName ? [{ name: data.customerName }, { email: data.customerName.toLowerCase() }] : []),
            ],
          },
          data: {
            bookingCount: { increment: 1 },
          },
        });
      } catch (custErr) {
        console.warn('[bookingService] Could not update customer bookingCount:', custErr);
      }
    }

    const seatList = parseSeats(seatsStr);
    recordSecurityEvent({
      id: `bkg-evt-${created.id.replace(/[^a-zA-Z0-9]/g, '')}`,
      category: 'booking',
      tone: 'neutral',
      message: `Booking ${created.id} verified via ${created.paymentMethod} for ${created.customerName} (${created.movieTitle}, ${seatList.length} seat${seatList.length > 1 ? 's' : ''})`,
      highlight: `verified via ${created.paymentMethod}`,
      timestamp: created.createdAt,
      user: created.customerName || undefined,
    });

    cachedLedger = null;
    return created;
  } catch (err: any) {
    if (err?.status !== 409) {
      console.error('[bookingService] Error creating booking in DB:', err);
    }
    throw err;
  }
};

export const getBookingByIdFromDb = async (id: string) => {
  try {
    const cleanId = id.startsWith('#') ? id.slice(1) : id;
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id }, { id: cleanId }, { id: `#${cleanId}` }],
      },
    });
    return booking;
  } catch (err: any) {
    console.warn('[bookingService] Error finding booking by id in DB:', err?.message || err);
    return null;
  }
};
