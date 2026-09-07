import { prisma } from '../config/db.js';
import {
  TheaterVenue,
  TheaterHall,
  getVenues as getFallbackVenues,
  getHallsForVenue as getFallbackHalls,
  getVenueStats as getFallbackStats,
} from './mockDataService.js';

let cachedVenues: TheaterVenue[] | null = null;
let lastVenuesFetchTime = 0;
const CACHE_TTL_MS = 3000;

export const getAllVenues = async (): Promise<TheaterVenue[]> => {
  const now = Date.now();
  if (cachedVenues && now - lastVenuesFetchTime < CACHE_TTL_MS) {
    return cachedVenues;
  }

  try {
    const dbVenues = await prisma.venue.findMany({
      include: { halls: true },
      orderBy: { createdAt: 'asc' },
    });

    if (dbVenues.length > 0) {
      cachedVenues = dbVenues.map((v) => ({
        id: v.id,
        name: v.name,
        address: v.address,
        imageUrl: v.imageUrl,
        status: (v.status as 'Active' | 'Maintenance') || 'Active',
        hallCount: v.halls.length,
        capacity: v.halls.reduce((sum, h) => sum + (h.capacity || 0), 0),
      }));
      lastVenuesFetchTime = now;
      return cachedVenues;
    }
  } catch (err: any) {
    console.warn('[venueService] Error fetching venues from DB, serving fallback:', err?.message || err);
    if (cachedVenues) return cachedVenues;
  }

  const fallback = await getFallbackVenues();
  cachedVenues = fallback;
  return fallback;
};

export const createVenueInDb = async (data: Partial<TheaterVenue>): Promise<TheaterVenue> => {
  try {
    const created = await prisma.venue.create({
      data: {
        id: data.id || `v-${Date.now()}`,
        name: data.name || 'New Venue',
        address: data.address || '',
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop',
        status: data.status || 'Active',
      },
      include: { halls: true },
    });

    cachedVenues = null;
    return {
      id: created.id,
      name: created.name,
      address: created.address,
      imageUrl: created.imageUrl,
      status: (created.status as 'Active' | 'Maintenance') || 'Active',
      hallCount: created.halls.length,
      capacity: created.halls.reduce((sum, h) => sum + (h.capacity || 0), 0),
    };
  } catch (err: any) {
    console.warn('[venueService] Error creating venue in DB, using in-memory store:', err?.message || err);
    const { createVenue: createFallback } = await import('./mockDataService.js');
    return createFallback(data);
  }
};

export const updateVenueInDb = async (id: string, data: Partial<TheaterVenue>): Promise<TheaterVenue> => {
  try {
    const updated = await prisma.venue.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
        ...(data.status ? { status: data.status } : {}),
      },
      include: { halls: true },
    });

    cachedVenues = null;
    return {
      id: updated.id,
      name: updated.name,
      address: updated.address,
      imageUrl: updated.imageUrl,
      status: (updated.status as 'Active' | 'Maintenance') || 'Active',
      hallCount: updated.halls.length,
      capacity: updated.halls.reduce((sum, h) => sum + (h.capacity || 0), 0),
    };
  } catch (err: any) {
    console.warn('[venueService] Error updating venue in DB, using in-memory store:', err?.message || err);
    const { updateVenue: updateFallback } = await import('./mockDataService.js');
    return updateFallback(id, data);
  }
};

export const deleteVenueInDb = async (id: string): Promise<boolean> => {
  try {
    await prisma.venue.delete({
      where: { id },
    });
    cachedVenues = null;
    return true;
  } catch (err: any) {
    console.warn('[venueService] Error deleting venue from DB, using in-memory store:', err?.message || err);
    const { deleteVenue: deleteFallback } = await import('./mockDataService.js');
    return deleteFallback(id);
  }
};

export const getHallsByVenueId = async (venueId: string): Promise<TheaterHall[]> => {
  try {
    const dbHalls = await prisma.theater.findMany({
      where: { venueId },
      orderBy: { name: 'asc' },
    });

    if (dbHalls.length > 0) {
      return dbHalls.map((h) => ({
        id: h.id,
        venueId: h.venueId || venueId,
        name: h.name,
        screenType: (h.screenType as any) || 'STANDARD',
        soundSystem: h.soundSystem || 'Dolby Atmos',
        capacity: h.capacity || 100,
        status: (h.status as any) || 'Active',
      }));
    }
  } catch (err: any) {
    console.warn('[venueService] Error fetching halls from DB, using fallback:', err?.message || err);
  }

  return getFallbackHalls(venueId);
};

export const createHallInDb = async (venueId: string, data: Partial<TheaterHall>): Promise<TheaterHall> => {
  try {
    const created = await prisma.theater.create({
      data: {
        id: data.id || `h-${Date.now()}`,
        venueId,
        name: data.name || 'New Hall',
        screenType: data.screenType || 'STANDARD',
        soundSystem: data.soundSystem || 'Dolby Atmos',
        capacity: Number(data.capacity) || 100,
        status: data.status || 'Active',
      },
    });

    cachedVenues = null;
    return {
      id: created.id,
      venueId: created.venueId || venueId,
      name: created.name,
      screenType: (created.screenType as any) || 'STANDARD',
      soundSystem: created.soundSystem || 'Dolby Atmos',
      capacity: created.capacity || 100,
      status: (created.status as any) || 'Active',
    };
  } catch (err: any) {
    console.warn('[venueService] Error creating hall in DB, using fallback:', err?.message || err);
    const { createHall: createFallback } = await import('./mockDataService.js');
    return createFallback(venueId, data);
  }
};

export const updateHallInDb = async (hallId: string, data: Partial<TheaterHall>): Promise<TheaterHall> => {
  try {
    const updated = await prisma.theater.update({
      where: { id: hallId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.screenType ? { screenType: data.screenType } : {}),
        ...(data.soundSystem ? { soundSystem: data.soundSystem } : {}),
        ...(data.capacity !== undefined ? { capacity: Number(data.capacity) } : {}),
        ...(data.status ? { status: data.status } : {}),
      },
    });

    cachedVenues = null;
    return {
      id: updated.id,
      venueId: updated.venueId || '',
      name: updated.name,
      screenType: (updated.screenType as any) || 'STANDARD',
      soundSystem: updated.soundSystem || 'Dolby Atmos',
      capacity: updated.capacity || 100,
      status: (updated.status as any) || 'Active',
    };
  } catch (err: any) {
    console.warn('[venueService] Error updating hall in DB, using fallback:', err?.message || err);
    const { updateHall: updateFallback } = await import('./mockDataService.js');
    return updateFallback(hallId, data);
  }
};

export const deleteHallInDb = async (hallId: string): Promise<boolean> => {
  try {
    await prisma.theater.delete({
      where: { id: hallId },
    });
    cachedVenues = null;
    return true;
  } catch (err: any) {
    console.warn('[venueService] Error deleting hall from DB, using fallback:', err?.message || err);
    const { deleteHall: deleteFallback } = await import('./mockDataService.js');
    return deleteFallback(hallId);
  }
};

export const getVenueStatsFromDb = async () => {
  try {
    const [totalVenues, activeHalls, halls, venues] = await Promise.all([
      prisma.venue.count(),
      prisma.theater.count({ where: { status: 'Active' } }),
      prisma.theater.findMany({ select: { capacity: true } }),
      prisma.venue.findMany({ select: { status: true } }),
    ]);

    if (totalVenues > 0) {
      const totalCapacity = halls.reduce((sum, h) => sum + (h.capacity || 0), 0);
      const systemHealth = venues.every((v) => v.status === 'Active') ? 'Optimal' : 'Caution';
      return { totalVenues, activeHalls, totalCapacity, systemHealth };
    }
  } catch (err: any) {
    console.warn('[venueService] Error computing venue stats from DB, using fallback:', err?.message || err);
  }

  return getFallbackStats();
};
