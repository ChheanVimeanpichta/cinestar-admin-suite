import { prisma } from '../config/db.js';
import { getMovies as getFallbackMovies } from './mockDataService.js';

export interface MovieItem {
  id: string;
  title: string;
  poster: string;
  genre: string;
  score: number | null;
  synopsis: string;
  badge?: string;
  hasBookBtn?: boolean;
  durationMins?: number;
  releaseDate?: string;
  bannerUrl?: string;
  createdAt?: string;
}

const mapDbMovie = (m: any): MovieItem => ({
  id: m.id,
  title: m.title,
  poster: m.poster,
  genre: m.genre,
  score: m.score !== null && m.score !== undefined ? Number(m.score) : null,
  synopsis: m.synopsis,
  badge: m.badge || undefined,
  hasBookBtn: Boolean(m.hasBookBtn),
  durationMins: m.durationMins !== null && m.durationMins !== undefined ? Number(m.durationMins) : undefined,
  releaseDate: m.releaseDate || undefined,
  createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : undefined,
});

let cachedMovies: MovieItem[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10000; // 10 seconds cache to prevent connection pool exhaustion

export const getAllMovies = async (): Promise<MovieItem[]> => {
  const now = Date.now();
  if (cachedMovies && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedMovies;
  }

  try {
    const dbMovies = await prisma.movie.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (dbMovies.length > 0) {
      cachedMovies = dbMovies.map(mapDbMovie);
      lastFetchTime = now;
      return cachedMovies;
    }
  } catch (err: any) {
    console.warn('[movieService] Connection pool busy, serving cached/fallback movie data:', err?.message || err);
    if (cachedMovies && cachedMovies.length > 0) {
      return cachedMovies;
    }
  }

  const fallback = (await getFallbackMovies()) as MovieItem[];
  cachedMovies = fallback;
  return fallback;
};

export const getMovieById = async (id: string): Promise<MovieItem | null> => {
  if (cachedMovies) {
    const found = cachedMovies.find((m) => m.id === id);
    if (found) return found;
  }

  try {
    const dbMovie = await prisma.movie.findUnique({
      where: { id },
    });
    if (dbMovie) {
      return mapDbMovie(dbMovie);
    }
  } catch (err: any) {
    console.warn(`[movieService] Failed to query movie ${id} from DB:`, err?.message || err);
  }

  if (cachedMovies) {
    const fromCache = cachedMovies.find((m) => m.id === id);
    if (fromCache) return fromCache;
  }

  const fallback = (await getFallbackMovies()).find((m) => m.id === id);
  return (fallback as MovieItem) || null;
};

export const createMovie = async (data: Partial<MovieItem>): Promise<MovieItem> => {
  const id = data.id?.trim() || `mv-${Date.now()}`;
  const title = data.title?.trim() || 'Untitled Movie';
  const poster = data.poster?.trim() || 'https://picsum.photos/seed/movie/300/450';
  const genre = data.genre?.trim() || 'General';
  const score = data.score !== undefined && data.score !== null && (data.score as any) !== '' && !isNaN(Number(data.score)) ? Number(data.score) : null;
  const synopsis = data.synopsis?.trim() || '';
  const badge = data.badge?.trim() || null;
  const hasBookBtn = Boolean(data.hasBookBtn);
  const durationMins = data.durationMins ? Number(data.durationMins) : null;
  const releaseDate = data.releaseDate?.trim() || null;

  const created = await prisma.movie.create({
    data: {
      id,
      title,
      poster,
      genre,
      score,
      synopsis,
      badge,
      hasBookBtn,
      durationMins,
      releaseDate,
    },
  });

  const mapped = mapDbMovie(created);
  if (cachedMovies) {
    cachedMovies = [mapped, ...cachedMovies.filter((m) => m.id !== mapped.id)];
  } else {
    cachedMovies = [mapped];
  }
  lastFetchTime = Date.now();

  return mapped;
};

export const updateMovie = async (
  id: string,
  data: Partial<MovieItem>
): Promise<MovieItem | null> => {
  const existing = await prisma.movie.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  const updated = await prisma.movie.update({
    where: { id },
    data: {
      title: data.title !== undefined ? data.title.trim() : undefined,
      poster: data.poster !== undefined ? data.poster.trim() : undefined,
      genre: data.genre !== undefined ? data.genre.trim() : undefined,
      score: data.score !== undefined ? (data.score !== null && (data.score as any) !== '' && !isNaN(Number(data.score)) ? Number(data.score) : null) : undefined,
      synopsis: data.synopsis !== undefined ? data.synopsis.trim() : undefined,
      badge: data.badge !== undefined ? (data.badge ? data.badge.trim() : null) : undefined,
      hasBookBtn: data.hasBookBtn !== undefined ? Boolean(data.hasBookBtn) : undefined,
      durationMins: data.durationMins !== undefined ? (data.durationMins ? Number(data.durationMins) : null) : undefined,
      releaseDate: data.releaseDate !== undefined ? (data.releaseDate ? data.releaseDate.trim() : null) : undefined,
    },
  });

  const mapped = mapDbMovie(updated);
  if (cachedMovies) {
    cachedMovies = cachedMovies.map((m) => (m.id === mapped.id ? mapped : m));
  }
  lastFetchTime = Date.now();

  return mapped;
};

export const deleteMovie = async (id: string): Promise<boolean> => {
  try {
    await prisma.movie.delete({
      where: { id },
    });
    if (cachedMovies) {
      cachedMovies = cachedMovies.filter((m) => m.id !== id);
    }
    lastFetchTime = Date.now();
    return true;
  } catch (err: any) {
    console.error(`[movieService] Failed to delete movie ${id}:`, err?.message || err);
    return false;
  }
};

export const deleteManyMovies = async (ids: string[]): Promise<number> => {
  try {
    const res = await prisma.movie.deleteMany({
      where: { id: { in: ids } },
    });
    if (cachedMovies) {
      const idSet = new Set(ids);
      cachedMovies = cachedMovies.filter((m) => !idSet.has(m.id));
    }
    lastFetchTime = Date.now();
    return res.count;
  } catch (err: any) {
    console.error('[movieService] Failed to bulk delete movies:', err?.message || err);
    return 0;
  }
};
