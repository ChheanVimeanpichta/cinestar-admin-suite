// admin-backend/src/controllers/slideController.ts
import { Request, Response } from 'express';
import {
  getAllSlides,
  getSlideById,
  createSlide as createSlideService,
  updateSlide as updateSlideService,
  deleteSlide as deleteSlideService,
} from '../services/slideService.js';

// Real-time Server-Sent Events (SSE) clients pool for Slideshow
const sseClients = new Set<Response>();

export const slideStream = (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // Initial handshake
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);

  sseClients.add(res);

  // Ping interval
  const keepAlive = setInterval(() => {
    try {
      res.write(': keep-alive ping\n\n');
    } catch {
      clearInterval(keepAlive);
      sseClients.delete(res);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(keepAlive);
    sseClients.delete(res);
  });
};

export const notifySlideSubscribers = (action: string, slideId?: string) => {
  const payload = JSON.stringify({ action, slideId, timestamp: Date.now() });
  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
};

const setNoCacheHeaders = (res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
};

export const listSlides = async (req: Request, res: Response) => {
  try {
    setNoCacheHeaders(res);
    const includeInactive = req.query.includeAll === 'true' || req.query.includeInactive === 'true';
    const slides = await getAllSlides(includeInactive);
    res.json(slides);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to list slides' });
  }
};

export const getSlide = async (req: Request, res: Response) => {
  try {
    setNoCacheHeaders(res);
    const slide = await getSlideById(String(req.params.id));
    if (!slide) {
      res.status(404).json({ message: 'Slide not found' });
      return;
    }
    res.json(slide);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to get slide' });
  }
};

export const createSlide = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, description, image, badges, linkUrl, status, order } = req.body;
    if (!title || !image) {
      res.status(400).json({ message: 'Slide title and image are required' });
      return;
    }

    const slide = await createSlideService({
      title,
      subtitle,
      description: description || '',
      image,
      badges: Array.isArray(badges) ? badges : typeof badges === 'string' ? badges.split(',').map((s) => s.trim()) : ['NOW SHOWING'],
      linkUrl: linkUrl || '/movies',
      status: status === 'Inactive' ? 'Inactive' : 'Active',
      order: typeof order === 'number' ? order : undefined,
    });

    notifySlideSubscribers('create', slide.id);
    res.status(201).json(slide);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to create slide' });
  }
};

export const updateSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, image, badges, linkUrl, status, order } = req.body;

    const updated = await updateSlideService(String(id), {
      ...(title !== undefined && { title }),
      ...(subtitle !== undefined && { subtitle }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(badges !== undefined && {
        badges: Array.isArray(badges) ? badges : typeof badges === 'string' ? badges.split(',').map((s) => s.trim()) : undefined,
      }),
      ...(linkUrl !== undefined && { linkUrl }),
      ...(status !== undefined && { status }),
      ...(order !== undefined && { order }),
    });

    notifySlideSubscribers('update', updated.id);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update slide' });
  }
};

export const deleteSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteSlideService(String(id));
    notifySlideSubscribers('delete', String(id));
    res.json({ success: true, message: 'Slide deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to delete slide' });
  }
};
