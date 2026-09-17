import { Screening, Theater } from "../types";
import { apiGet, apiPost, apiDelete } from "./api";
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

export function createScreeningApi(data: any): Promise<any> {
  return apiPost("/screenings", data).catch((err) => {
    console.warn("Failed to create screening via API:", err);
    return null;
  });
}

export function syncScreeningsApi(data: any[]): Promise<any> {
  return apiPost("/screenings/sync", data).catch((err) => {
    console.warn("Failed to sync screenings via API:", err);
    return null;
  });
}

export function deleteScreeningApi(id: string): Promise<any> {
  return apiDelete(`/screenings/${id}`).catch((err) => {
    console.warn("Failed to delete screening via API:", err);
    return null;
  });
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
