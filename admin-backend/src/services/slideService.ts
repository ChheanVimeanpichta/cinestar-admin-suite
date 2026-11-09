// admin-backend/src/services/slideService.ts

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

let slides: SlideItem[] = [...DEFAULT_SLIDES];

export const getAllSlides = async (includeInactive = false): Promise<SlideItem[]> => {
  const result = includeInactive
    ? [...slides]
    : slides.filter((s) => s.status === 'Active');
  return result.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const getSlideById = async (id: string): Promise<SlideItem | null> => {
  const slide = slides.find((s) => s.id === id);
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
  const now = new Date().toISOString();

  const newSlide: SlideItem = {
    id,
    title: payload.title.trim(),
    subtitle: payload.subtitle?.trim() || '',
    description: payload.description?.trim() || '',
    image: payload.image,
    badges: Array.isArray(payload.badges) && payload.badges.length > 0 ? payload.badges : ['NOW SHOWING'],
    linkUrl: payload.linkUrl || '/movies',
    status: payload.status || 'Active',
    order: typeof payload.order === 'number' ? payload.order : slides.length + 1,
    createdAt: now,
    updatedAt: now,
  };

  slides.push(newSlide);
  return newSlide;
};

export const updateSlide = async (
  id: string,
  payload: Partial<SlideItem>
): Promise<SlideItem> => {
  const idx = slides.findIndex((s) => s.id === id);
  if (idx === -1) {
    throw new Error('Slide not found');
  }

  const existing = slides[idx];
  const updated: SlideItem = {
    ...existing,
    ...payload,
    id,
    badges: payload.badges ? payload.badges : existing.badges,
    updatedAt: new Date().toISOString(),
  };

  slides[idx] = updated;
  return updated;
};

export const deleteSlide = async (id: string): Promise<boolean> => {
  const beforeCount = slides.length;
  slides = slides.filter((s) => s.id !== id);
  return slides.length < beforeCount;
};
