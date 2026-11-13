// admin-backend/src/services/slideService.ts
import { prisma } from '../config/db.js';

export interface SlideItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  badges: string[];
  linkUrl?: string;
  status: 'Active' | 'Inactive';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_SLIDES: SlideItem[] = [
  {
    id: 'slide-iron-verdict',
    image: 'https://picsum.photos/seed/hero-bg1/1600/900',
    title: 'IRON',
    subtitle: 'VERDICT',
    description:
      "A disgraced detective is pulled back into the city's underworld when the one case he never closed resurfaces, threatening to destroy everything he rebuilt.",
    badges: ['NOW SHOWING', 'IMAX 2D'],
    linkUrl: '/movies',
    status: 'Active',
    order: 1,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'slide-pixel-static',
    image: 'https://picsum.photos/seed/hero-bg2/1600/900',
    title: 'PIXEL',
    subtitle: 'STATIC',
    description:
      'In a city built from discarded code, one broken pixel sets out on an epic journey to find where all the glitches go before the entire system crashes.',
    badges: ['NOW SHOWING', '3D'],
    linkUrl: '/movies',
    status: 'Active',
    order: 2,
    createdAt: '2026-09-02T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
  },
  {
    id: 'slide-frost-king',
    image: 'https://picsum.photos/seed/hero-bg3/1600/900',
    title: 'THE FROST',
    subtitle: 'KING',
    description:
      'The last heir to a frozen throne must cross the Long Winter to reclaim a crown that despises her, with only a reluctant dragon as her companion.',
    badges: ['NOW SHOWING', 'IMAX 2D'],
    linkUrl: '/movies',
    status: 'Active',
    order: 3,
    createdAt: '2026-09-03T00:00:00.000Z',
    updatedAt: '2026-09-03T00:00:00.000Z',
  },
];

function parseBadges(raw: string | null | undefined): string[] {
  if (!raw) return ['NOW SHOWING'];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    if (raw.includes(',')) {
      return raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [raw.trim()];
  }
  return ['NOW SHOWING'];
}

function mapDbSlide(s: any): SlideItem {
  return {
    id: s.id,
    title: s.title,
    subtitle: s.subtitle || '',
    description: s.description || '',
    image: s.image,
    badges: parseBadges(s.badges),
    linkUrl: s.linkUrl || '/movies',
    status: (s.status as 'Active' | 'Inactive') || 'Active',
    order: typeof s.order === 'number' ? s.order : 0,
    createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : new Date().toISOString(),
  };
}

let inMemorySlides: SlideItem[] = [...DEFAULT_SLIDES];

export const getAllSlides = async (includeInactive = false): Promise<SlideItem[]> => {
  try {
    const where = includeInactive ? {} : { status: 'Active' };
    const dbSlides = await prisma.slide.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    if (dbSlides && dbSlides.length > 0) {
      const mapped = dbSlides.map(mapDbSlide);
      inMemorySlides = mapped;
      return mapped;
    }
  } catch (err: any) {
    console.warn('[slideService] DB query failed, using in-memory fallback:', err?.message || err);
  }

  const result = includeInactive
    ? [...inMemorySlides]
    : inMemorySlides.filter((s) => s.status === 'Active');
  return result.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const getSlideById = async (id: string): Promise<SlideItem | null> => {
  try {
    const dbSlide = await prisma.slide.findUnique({
      where: { id },
    });
    if (dbSlide) {
      return mapDbSlide(dbSlide);
    }
  } catch (err: any) {
    console.warn(`[slideService] DB fetch failed for slide ${id}:`, err?.message || err);
  }

  const slide = inMemorySlides.find((s) => s.id === id);
  return slide || null;
};

export const createSlide = async (payload: {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  badges?: string[];
  linkUrl?: string;
  status?: 'Active' | 'Inactive';
  order?: number;
}): Promise<SlideItem> => {
  const id = `slide-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const badges = Array.isArray(payload.badges) && payload.badges.length > 0 ? payload.badges : ['NOW SHOWING'];
  const order = typeof payload.order === 'number' ? payload.order : inMemorySlides.length + 1;
  const status = payload.status || 'Active';

  try {
    const created = await prisma.slide.create({
      data: {
        id,
        title: payload.title.trim(),
        subtitle: payload.subtitle?.trim() || '',
        description: payload.description?.trim() || '',
        image: payload.image,
        badges: JSON.stringify(badges),
        linkUrl: payload.linkUrl || '/movies',
        status,
        order,
      },
    });

    const mapped = mapDbSlide(created);
    inMemorySlides.push(mapped);
    return mapped;
  } catch (err: any) {
    console.warn('[slideService] DB create failed, falling back to in-memory:', err?.message || err);
    const now = new Date().toISOString();
    const newSlide: SlideItem = {
      id,
      title: payload.title.trim(),
      subtitle: payload.subtitle?.trim() || '',
      description: payload.description?.trim() || '',
      image: payload.image,
      badges,
      linkUrl: payload.linkUrl || '/movies',
      status,
      order,
      createdAt: now,
      updatedAt: now,
    };
    inMemorySlides.push(newSlide);
    return newSlide;
  }
};

export const updateSlide = async (
  id: string,
  payload: Partial<SlideItem>
): Promise<SlideItem> => {
  try {
    const updateData: any = {};
    if (payload.title !== undefined) updateData.title = payload.title.trim();
    if (payload.subtitle !== undefined) updateData.subtitle = payload.subtitle.trim();
    if (payload.description !== undefined) updateData.description = payload.description.trim();
    if (payload.image !== undefined) updateData.image = payload.image;
    if (payload.badges !== undefined) updateData.badges = JSON.stringify(payload.badges);
    if (payload.linkUrl !== undefined) updateData.linkUrl = payload.linkUrl;
    if (payload.status !== undefined) updateData.status = payload.status;
    if (payload.order !== undefined) updateData.order = payload.order;

    const updated = await prisma.slide.update({
      where: { id },
      data: updateData,
    });

    const mapped = mapDbSlide(updated);
    const idx = inMemorySlides.findIndex((s) => s.id === id);
    if (idx !== -1) {
      inMemorySlides[idx] = mapped;
    } else {
      inMemorySlides.push(mapped);
    }
    return mapped;
  } catch (err: any) {
    console.warn(`[slideService] DB update failed for slide ${id}:`, err?.message || err);
    const idx = inMemorySlides.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error('Slide not found');
    }
    const existing = inMemorySlides[idx];
    const updated: SlideItem = {
      ...existing,
      ...payload,
      id,
      badges: payload.badges ? payload.badges : existing.badges,
      updatedAt: new Date().toISOString(),
    };
    inMemorySlides[idx] = updated;
    return updated;
  }
};

export const deleteSlide = async (id: string): Promise<boolean> => {
  try {
    await prisma.slide.delete({
      where: { id },
    });
    inMemorySlides = inMemorySlides.filter((s) => s.id !== id);
    return true;
  } catch (err: any) {
    console.warn(`[slideService] DB delete failed for slide ${id}:`, err?.message || err);
    const beforeCount = inMemorySlides.length;
    inMemorySlides = inMemorySlides.filter((s) => s.id !== id);
    return inMemorySlides.length < beforeCount;
  }
};
