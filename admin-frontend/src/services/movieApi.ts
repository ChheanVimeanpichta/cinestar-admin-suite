import { api } from './api';

export const getMovies = async () => {
  const { data } = await api.get('/movies');
  return data;
};
