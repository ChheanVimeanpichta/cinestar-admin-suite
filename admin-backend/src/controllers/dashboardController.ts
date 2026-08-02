import { Request, Response } from 'express';
import {
  getDashboardStats,
  getWeeklySales as getWeeklySalesData,
  getTrendingMovies as getTrendingMoviesData,
  getLiveFeed as getLiveFeedData,
} from '../services/dashboardService.js';

export const getStats = async (_req: Request, res: Response) => {
  const stats = await getDashboardStats();
  res.json(stats);
};

export const getWeeklySales = async (_req: Request, res: Response) => {
  const sales = await getWeeklySalesData();
  res.json(sales);
};

export const getTrendingMovies = async (_req: Request, res: Response) => {
  const movies = await getTrendingMoviesData();
  res.json(movies);
};

export const getLiveFeed = async (_req: Request, res: Response) => {
  const feed = await getLiveFeedData();
  res.json(feed);
};

export const getDashboardSummary = (_req: Request, res: Response) => {
  res.json({
    revenue: 0,
    activeBookings: 0,
    occupancy: 0,
    topMovies: [],
    recentBookings: [],
  });
};
