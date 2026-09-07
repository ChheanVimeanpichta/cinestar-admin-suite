import { prisma } from '../config/db.js';
import { getSecurityStream as getFallbackMockEvents } from './mockDataService.js';

export type SecurityTone = 'alert' | 'neutral' | 'warning';
export type SecurityCategory = 'all' | 'booking' | 'auth' | 'security' | 'system';

export interface SecurityStreamEvent {
  id: string;
  timeAgo: string;
  message: string;
  highlight?: string;
  tone: SecurityTone;
  category?: SecurityCategory;
  timestamp: string;
  user?: string;
}

export interface RecordSecurityEventInput {
  id?: string;
  message: string;
  highlight?: string;
  tone?: SecurityTone;
  category?: SecurityCategory;
  timestamp?: string | Date;
  user?: string;
}

// In-memory buffer of live real-time events triggered during runtime
const liveEvents: SecurityStreamEvent[] = [];
const MAX_LIVE_EVENTS = 100;

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - d.getTime());
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 15) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hr${diffHour > 1 ? 's' : ''} ago`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
}

/**
 * Record a new real-time security or customer activity event
 */
export function recordSecurityEvent(input: RecordSecurityEventInput): SecurityStreamEvent {
  const ts = input.timestamp
    ? typeof input.timestamp === 'string'
      ? input.timestamp
      : input.timestamp.toISOString()
    : new Date().toISOString();

  const event: SecurityStreamEvent = {
    id: input.id || `sec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    message: input.message,
    highlight: input.highlight,
    tone: input.tone || 'neutral',
    category: input.category || 'system',
    timestamp: ts,
    timeAgo: formatTimeAgo(ts),
    user: input.user,
  };

  liveEvents.unshift(event);
  if (liveEvents.length > MAX_LIVE_EVENTS) {
    liveEvents.length = MAX_LIVE_EVENTS;
  }

  return event;
}

/**
 * Fetch dynamic security stream combining:
 * 1. Live runtime events (customer logins, registrations, bookings)
 * 2. Real records from MySQL DB (recent bookings & registered customers)
 * 3. Fallback baseline system events if fresh database
 */
export async function getDynamicSecurityStream(): Promise<SecurityStreamEvent[]> {
  const validLive = liveEvents.filter(
    (e) => !e.id.includes('bk-seed') && !e.message.includes('bk-seed')
  );
  const combined: SecurityStreamEvent[] = [...validLive];
  const recordedIds = new Set(validLive.map((e) => e.id));

  try {
    // 1. Fetch recent bookings from MySQL DB
    const dbBookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    for (const b of dbBookings) {
      const syntheticId = `bkg-evt-${b.id.replace(/[^a-zA-Z0-9]/g, '')}`;
      const alreadyExists =
        recordedIds.has(syntheticId) ||
        combined.some((e) => e.id.includes(b.id) || e.message.includes(b.id));

      if (!alreadyExists) {
        let seatCount = 1;
        try {
          const parsed = JSON.parse(b.seats);
          if (Array.isArray(parsed)) seatCount = parsed.length;
        } catch {
          if (b.seats && b.seats.includes(',')) {
            seatCount = b.seats.split(',').length;
          }
        }

        const method = b.paymentMethod || 'ABA Pay';
        const name = b.customerName || 'Customer';

        combined.push({
          id: syntheticId,
          category: 'booking',
          tone: 'neutral',
          message: `Booking ${b.id.startsWith('#') ? b.id : `#${b.id}`} verified via ${method} for ${name} (${b.movieTitle}, ${seatCount} seat${seatCount > 1 ? 's' : ''})`,
          highlight: `verified via ${method}`,
          timestamp: b.createdAt.toISOString(),
          timeAgo: formatTimeAgo(b.createdAt),
          user: name,
        });
        recordedIds.add(syntheticId);
      }
    }

    // 2. Fetch recent registered customers from MySQL DB
    const dbCustomers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    for (const c of dbCustomers) {
      const syntheticId = `cust-reg-${c.id}`;
      if (!recordedIds.has(syntheticId)) {
        combined.push({
          id: syntheticId,
          category: 'auth',
          tone: 'neutral',
          message: `Customer account registered: ${c.name} (${c.email}) joined CineStar`,
          highlight: 'Customer account registered',
          timestamp: c.createdAt.toISOString(),
          timeAgo: formatTimeAgo(c.createdAt),
          user: c.name,
        });
        recordedIds.add(syntheticId);
      }
    }
  } catch (err: any) {
    console.warn('[securityService] Failed to query MySQL for activity events, using memory cache:', err?.message || err);
  }

  // 3. Fallback: if we have fewer than 3 events, augment with standard system events
  if (combined.length < 3) {
    const mockEvents = await getFallbackMockEvents();
    for (const me of mockEvents) {
      if (!recordedIds.has(me.id)) {
        combined.push({
          ...me,
          category: me.message.includes('Booking')
            ? 'booking'
            : me.message.includes('login') || me.message.includes('auth')
            ? 'auth'
            : 'security',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        });
        recordedIds.add(me.id);
      }
    }
  }

  // 4. Sort strictly descending by timestamp
  combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // 5. Re-compute relative timeAgo based on the exact instant of the request
  return combined.map((evt) => ({
    ...evt,
    timeAgo: formatTimeAgo(evt.timestamp),
  }));
}
