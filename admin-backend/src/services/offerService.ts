import { prisma } from '../config/db.js';

export interface OfferBullet {
  icon: string;
  text: string;
}

export interface OfferItem {
  id: string;
  title: string;
  caption?: string;
  badge?: string;
  tag?: string;
  image: string;
  icon?: string;
  validity?: string;
  description: string;
  bullets?: OfferBullet[];
  perks?: string[];
  publishDate?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_OFFERS: OfferItem[] = [
  {
    id: "student-special",
    title: "Student Cinema Special",
    caption: "Happy days for enjoying movies! 🎓",
    badge: "STUDENT PERK",
    tag: "40% OFF",
    validity: "Valid Mon – Thu",
    image: "https://i.pinimg.com/736x/b4/2b/ef/b42bef7ed6fe12ca729d1dbd0ca0590d.jpg",
    icon: "🎓",
    publishDate: "Aug 04, 2026",
    description: "Back to the big screen! Enjoy 40% off standard tickets and a complimentary small popcorn with any valid student ID.",
    bullets: [
      { icon: "✨", text: "Valid Monday through Thursday." },
      { icon: "🎓", text: "A valid student ID is required at the cinema." },
      { icon: "🍿", text: "Complimentary small butter popcorn included with any valid student ticket." },
    ],
    status: "Active",
  },
  {
    id: "bogo-popcorn",
    title: "Buy 1 Get 1 FREE Popcorn",
    caption: "Buy 1 Get 1 FREE! 🎉",
    badge: "CONCESSION",
    tag: "BOGO FREE",
    validity: "Limited Time",
    image: "https://tse2.mm.bing.net/th/id/OIP.DPQLRl96UnrsL1iMMOWGSgHaJQ?r=0&w=700&h=875&rs=1&pid=ImgDetMain&o=7&rm=3",
    icon: "🍿",
    publishDate: "Aug 04, 2026",
    description: "Enjoy our special Buy 1 Get 1 FREE offer on Large Popcorn Boxes. Freshly popped cinema butter or sweet caramel.",
    bullets: [
      { icon: "✨", text: "Get 2 Large Popcorn Boxes for only $3.50." },
      { icon: "🗓️", text: "Promotion period: 1–15 August 2026." },
      { icon: "📱", text: "Order now on Foodpanda or at the cinema counter and enjoy delicious, freshly popped popcorn! 🍿💛" },
    ],
    status: "Active",
  },
  {
    id: "combo-deal",
    title: "Signature Feast Snack Combo",
    caption: "Snack Combo — $8.50 🍗",
    badge: "SNACKS & DRINKS",
    tag: "$8.50 ONLY",
    validity: "Everyday In-Cinema",
    image: "https://m.media-amazon.com/images/I/71Jwq+AaNmL._SL1500_.jpg",
    icon: "🥤",
    publishDate: "Aug 04, 2026",
    description: "Fuel up before the lights go down with our signature snack combo available at all concession stands.",
    bullets: [
      { icon: "✨", text: "1x Large popcorn, 1x crunchy tenders, 2x soft drinks." },
      { icon: "🗓️", text: "Available every day, in-cinema only." },
      { icon: "🎬", text: "Show this offer at the concessions counter to redeem." },
    ],
    status: "Active",
  },
  {
    id: "movie-night-deal",
    title: "Night Owl Movie Special",
    caption: "Enjoy a movie night with special pricing! 🎬",
    badge: "TICKET DEAL",
    tag: "UP TO 30% OFF",
    validity: "Select Screenings",
    image: "https://m.media-amazon.com/images/I/81F7FAqTakL._AC_.jpg",
    icon: "🎬",
    publishDate: "Aug 04, 2026",
    description: "Make it a night out with friends or family at special rates on prime evening screenings after 9:00 PM.",
    bullets: [
      { icon: "✨", text: "Discounted standard tickets on select nights." },
      { icon: "🗓️", text: "Check showtimes for eligible screenings." },
    ],
    status: "Active",
  },
  {
    id: "movie-night-combo",
    title: "All-In-One Movie & Meal Ticket",
    caption: "Enjoy a movie with combo meals! 🎬",
    badge: "COMBO BUNDLE",
    tag: "SAVE $5.00",
    validity: "All Standard Shows",
    image: "https://i.pinimg.com/736x/c2/90/85/c2908591164ebc5e588855bb521ab466.jpg",
    icon: "🎬",
    publishDate: "Aug 04, 2026",
    description: "Pair your ticket directly with a delicious meal combo bundled into one easy transaction.",
    bullets: [
      { icon: "✨", text: "1x ticket, 1x popcorn, 1x drink in a single bundle." },
      { icon: "🎬", text: "Available for any standard screening." },
    ],
    status: "Active",
  },
  {
    id: "movie-night-popcorn",
    title: "Cinema Popcorn Ticket Add-On",
    caption: "Enjoy a movie with popcorn! 🍿",
    badge: "ADD-ON PERK",
    tag: "$2.50 UPGRADE",
    validity: "Daily at Counter",
    image: "https://tse4.mm.bing.net/th/id/OIP.M4_ooM3tSc6oEeYED_TZvAHaJQ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    icon: "🍿",
    publishDate: "Aug 04, 2026",
    description: "Every great movie deserves delicious cinema popcorn. Add a large popcorn to your ticket during booking or check-in.",
    bullets: [
      { icon: "✨", text: "Add a large popcorn to any ticket at a discounted price." },
      { icon: "🗓️", text: "Valid every day, while supplies last." },
    ],
    status: "Active",
  },
];

function parseBullets(raw: string | null | undefined): OfferBullet[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => {
        if (typeof item === 'string') {
          return { icon: '✨', text: item };
        }
        return {
          icon: item.icon || '✨',
          text: item.text || String(item),
        };
      });
    }
  } catch {
    // If stored as newline separated strings
    return raw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text) => ({ icon: '✨', text }));
  }
  return [];
}

const mapDbOffer = (o: any): OfferItem => {
  const bullets = parseBullets(o.bullets);
  const perks = bullets.map((b) => b.text);
  return {
    id: o.id,
    title: o.title,
    caption: o.caption || undefined,
    badge: o.badge || 'SPECIAL OFFER',
    tag: o.tag || 'EXCLUSIVE',
    image: o.image,
    icon: o.icon || '🍿',
    validity: o.validity || 'Limited Time',
    description: o.description || '',
    bullets,
    perks,
    publishDate: o.publishDate || (o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Aug 04, 2026'),
    status: o.status || 'Active',
    createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : undefined,
    updatedAt: o.updatedAt ? new Date(o.updatedAt).toISOString() : undefined,
  };
};

const inMemoryOffers: Map<string, OfferItem> = new Map(
  DEFAULT_OFFERS.map((o) => [o.id.toLowerCase(), o])
);

const withTimeout = <T>(promise: Promise<T>, ms = 4000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('DATABASE_TIMEOUT')), ms)
    ),
  ]);
};

let hasInitialDbSync = false;
let lastSyncTime = 0;

const sortByCreatedAtDesc = (a: OfferItem, b: OfferItem) => {
  const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  return timeB - timeA;
};

// Asynchronously pre-populate inMemoryOffers from Prisma
const syncOffersFromDb = async (): Promise<void> => {
  try {
    const dbOffers = await withTimeout(
      prisma.offer.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      4000
    );
    if (dbOffers && dbOffers.length > 0) {
      // Retain memory additions and sync all DB offers
      for (const o of dbOffers) {
        const mapped = mapDbOffer(o);
        inMemoryOffers.set(mapped.id.toLowerCase(), mapped);
      }
      hasInitialDbSync = true;
      lastSyncTime = Date.now();
    }
  } catch {
    // Database busy or offline - memory fallbacks in place
  }
};

// Kick off initial sync
syncOffersFromDb();

// Periodic sync every 15s in background
setInterval(() => {
  syncOffersFromDb().catch(() => {});
}, 15000);

export const seedDefaultOffersIfEmpty = async (): Promise<void> => {
  try {
    const count = await withTimeout(prisma.offer.count(), 2000);
    if (count === 0) {
      for (const def of DEFAULT_OFFERS) {
        await prisma.offer.create({
          data: {
            id: def.id,
            title: def.title,
            caption: def.caption || null,
            badge: def.badge || null,
            tag: def.tag || null,
            image: def.image,
            icon: def.icon || null,
            validity: def.validity || null,
            description: def.description,
            bullets: JSON.stringify(def.bullets || []),
            publishDate: def.publishDate || null,
            status: def.status || 'Active',
          },
        });
      }
    }
  } catch {
    // Seed check skipped when database busy or offline
  }
};

export const getAllOffers = async (includeInactive = false): Promise<OfferItem[]> => {
  // If not yet synced on cold boot, wait once for DB sync
  if (!hasInitialDbSync) {
    await syncOffersFromDb();
  } else if (Date.now() - lastSyncTime > 10000) {
    // Background non-blocking sync if older than 10s
    syncOffersFromDb().catch(() => {});
  }

  const all = Array.from(inMemoryOffers.values());
  const filtered = includeInactive ? all : all.filter((o) => o.status !== 'Inactive');
  return filtered.sort(sortByCreatedAtDesc);
};

export const getOfferById = async (id: string): Promise<OfferItem | null> => {
  const normalizedId = String(id).trim().toLowerCase();

  // 1. Fast check from memory cache
  const mem = inMemoryOffers.get(normalizedId);
  if (mem) {
    return mem;
  }

  // 2. Query Prisma database with timeout
  try {
    const o = await withTimeout(
      prisma.offer.findFirst({
        where: {
          OR: [
            { id: id },
            { id: normalizedId },
          ],
        },
      }),
      4000
    );
    if (o) {
      const mapped = mapDbOffer(o);
      inMemoryOffers.set(mapped.id.toLowerCase(), mapped);
      return mapped;
    }
  } catch {
    // Database busy or offline
  }

  return DEFAULT_OFFERS.find((item) => item.id.toLowerCase() === normalizedId) || null;
};

export const createOffer = async (payload: {
  id?: string;
  title: string;
  caption?: string;
  badge?: string;
  tag?: string;
  image: string;
  icon?: string;
  validity?: string;
  description: string;
  bullets?: OfferBullet[] | string[];
  publishDate?: string;
  status?: string;
}): Promise<OfferItem> => {
  const normalizedId = payload.id && payload.id.trim() ? payload.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') : undefined;
  
  let formattedBullets = '[]';
  if (Array.isArray(payload.bullets)) {
    const parsed = payload.bullets.map((b) => {
      if (typeof b === 'string') return { icon: '✨', text: b };
      return { icon: b.icon || '✨', text: b.text || '' };
    });
    formattedBullets = JSON.stringify(parsed);
  } else if (typeof payload.bullets === 'string') {
    formattedBullets = payload.bullets;
  }

  const created = await prisma.offer.create({
    data: {
      id: normalizedId,
      title: payload.title,
      caption: payload.caption || null,
      badge: payload.badge || 'SPECIAL OFFER',
      tag: payload.tag || 'EXCLUSIVE',
      image: payload.image,
      icon: payload.icon || '🍿',
      validity: payload.validity || 'Limited Time',
      description: payload.description,
      bullets: formattedBullets,
      publishDate: payload.publishDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: payload.status || 'Active',
    },
  });

  const mapped = mapDbOffer(created);
  inMemoryOffers.set(mapped.id.toLowerCase(), mapped);
  return mapped;
};

export const updateOffer = async (
  id: string,
  payload: Partial<{
    title: string;
    caption: string;
    badge: string;
    tag: string;
    image: string;
    icon: string;
    validity: string;
    description: string;
    bullets: OfferBullet[] | string[];
    publishDate: string;
    status: string;
  }>
): Promise<OfferItem> => {
  let formattedBullets: string | undefined = undefined;
  if (payload.bullets !== undefined) {
    if (Array.isArray(payload.bullets)) {
      const parsed = payload.bullets.map((b) => {
        if (typeof b === 'string') return { icon: '✨', text: b };
        return { icon: b.icon || '✨', text: b.text || '' };
      });
      formattedBullets = JSON.stringify(parsed);
    } else {
      formattedBullets = String(payload.bullets);
    }
  }

  const updated = await prisma.offer.update({
    where: { id },
    data: {
      title: payload.title,
      caption: payload.caption,
      badge: payload.badge,
      tag: payload.tag,
      image: payload.image,
      icon: payload.icon,
      validity: payload.validity,
      description: payload.description,
      bullets: formattedBullets,
      publishDate: payload.publishDate,
      status: payload.status,
    },
  });

  const mapped = mapDbOffer(updated);
  inMemoryOffers.set(mapped.id.toLowerCase(), mapped);
  return mapped;
};

export const deleteOffer = async (id: string): Promise<boolean> => {
  try {
    await prisma.offer.delete({
      where: { id },
    });
  } catch {}
  inMemoryOffers.delete(id.toLowerCase());
  return true;
};
