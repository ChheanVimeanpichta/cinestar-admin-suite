import { api } from './api';

export const getShowtimes = async () => {
  const { data } = await api.get('/showtimes');
  return data;
};
