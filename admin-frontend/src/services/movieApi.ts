import { Movie } from "../types";
import { apiGet } from "./api";

export function fetchNowShowing(): Promise<Movie[]> {
  return apiGet<Movie[]>("/movies/now-showing");
}

export function fetchAllMovies(): Promise<Movie[]> {
  return apiGet<Movie[]>("/movies");
}

export function fetchMovieById(id: string): Promise<Movie> {
  return apiGet<Movie>(`/movies/${id}`);
}