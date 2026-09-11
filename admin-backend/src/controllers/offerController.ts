import { Request, Response } from 'express';
import {
  getAllOffers,
  getOfferById,
  createOffer as createOfferService,
  updateOffer as updateOfferService,
  deleteOffer as deleteOfferService,
} from '../services/offerService.js';

// Real-time Server-Sent Events (SSE) clients pool
const sseClients = new Set<Response>();

export const offerStream = (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // Send initial handshake
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);

  sseClients.add(res);

  // Keep-alive ping every 15s to keep the connection alive
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

export const notifyOfferSubscribers = (action: string, offerId?: string) => {
  const payload = JSON.stringify({ action, offerId, timestamp: Date.now() });
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

export const listOffers = async (req: Request, res: Response) => {
  try {
    setNoCacheHeaders(res);
    const includeInactive = req.query.all === 'true';
    const offers = await getAllOffers(includeInactive);
    res.json(offers);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to list offers' });
  }
};

export const getOffer = async (req: Request, res: Response) => {
  try {
    setNoCacheHeaders(res);
    const offer = await getOfferById(String(req.params.id));
    if (!offer) {
      res.status(404).json({ message: 'Offer not found' });
      return;
    }
    res.json(offer);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to get offer' });
  }
};

export const createOffer = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data || !data.title || !data.image) {
      res.status(400).json({ message: 'Offer title and image are required' });
      return;
    }
    const offer = await createOfferService(data);
    notifyOfferSubscribers('create', offer.id);
    res.status(201).json(offer);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to create offer' });
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = req.body;
    const updated = await updateOfferService(id, data);
    notifyOfferSubscribers('update', updated.id);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update offer' });
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await deleteOfferService(id);
    notifyOfferSubscribers('delete', id);
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to delete offer' });
  }
};
