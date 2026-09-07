import { Movie } from "../types";
import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export function fetchNowShowing(): Promise<Movie[]> {
  return apiGet<Movie[]>("/movies/now-showing");
}

export function fetchAllMovies(): Promise<Movie[]> {
  return apiGet<Movie[]>("/movies");
}

export function fetchMovieById(id: string): Promise<Movie> {
  return apiGet<Movie>(`/movies/${id}`);
}

export function createMovie(movie: Partial<Movie>): Promise<Movie> {
  return apiPost<Movie>("/movies", movie);
}

export function updateMovie(id: string, movie: Partial<Movie>): Promise<Movie> {
  return apiPut<Movie>(`/movies/${id}`, movie);
}

export function deleteMovie(id: string): Promise<{ success: boolean; message: string }> {
  return apiDelete<{ success: boolean; message: string }>(`/movies/${id}`);
}

export function bulkDeleteMovies(ids: string[]): Promise<{ success: boolean; deletedCount: number }> {
  return apiPost<{ success: boolean; deletedCount: number }>("/movies/bulk-delete", { ids });
}