import { api } from './api';

export const getBookings = async () => {
  const { data } = await api.get('/bookings');
  return data;
};
