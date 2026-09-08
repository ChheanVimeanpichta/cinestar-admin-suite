import { Screening, Theater } from "../types";
import { apiGet } from "./api";
import {
  getMockShowtimeRows,
  mockShowtimeStats,
  ShowtimeRowsResponse,
  ShowtimeStats,
} from "../mocks/showtimes";

export function fetchScreeningsForMovie(movieId: string): Promise<Screening[]> {
  return apiGet<Screening[]>(`/movies/${movieId}/screenings`).catch(() => []);
}

export function fetchAllScreenings(): Promise<Screening[]> {
  return apiGet<Screening[]>("/screenings").catch(() => []);
}

export function fetchTheaters(): Promise<Theater[]> {
  return apiGet<Theater[]>("/theaters").catch(() => []);
}

export function fetchShowtimeStats(): Promise<ShowtimeStats> {
  return Promise.resolve(mockShowtimeStats);
}

export async function fetchShowtimeRows(page: number): Promise<ShowtimeRowsResponse> {
  return Promise.resolve(getMockShowtimeRows(page));
}
