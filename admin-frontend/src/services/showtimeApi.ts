import { Screening, Theater } from "../types";
import { apiGet } from "./api";

export function fetchScreeningsForMovie(movieId: string): Promise<Screening[]> {
  return apiGet<Screening[]>(`/movies/${movieId}/screenings`);
}

export function fetchAllScreenings(): Promise<Screening[]> {
  return apiGet<Screening[]>("/screenings");
}

export function fetchTheaters(): Promise<Theater[]> {
  return apiGet<Theater[]>("/theaters");
}