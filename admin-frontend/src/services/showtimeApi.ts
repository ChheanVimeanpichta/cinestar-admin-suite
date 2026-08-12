import { Screening, Theater } from "../types";
import { apiGet } from "./api";
import {
  getMockShowtimeRows,
  mockShowtimeStats,
  ShowtimeRowsResponse,
  ShowtimeStats,
} from "../mocks/showtimes";

export function fetchScreeningsForMovie(movieId: string): Promise<Screening[]> {
  return apiGet<Screening[]>(`/movies/${movieId}/screenings`);
}

export function fetchAllScreenings(): Promise<Screening[]> {
  return apiGet<Screening[]>("/screenings");
}

export function fetchTheaters(): Promise<Theater[]> {
  return apiGet<Theater[]>("/theaters");
}

export function fetchShowtimeStats(): Promise<ShowtimeStats> {
  return apiGet<ShowtimeStats>("/showtimes/stats").catch(() => mockShowtimeStats);
}

export async function fetchShowtimeRows(page: number): Promise<ShowtimeRowsResponse> {
  try {
    const data = await apiGet<unknown>(`/showtimes?page=${page}`);
    if (data && typeof data === "object" && "rows" in data) return data as ShowtimeRowsResponse;
    if (Array.isArray(data)) {
      const totalCount = data.length;
      return {
        rows: data as ShowtimeRowsResponse["rows"],
        totalCount,
        totalPages: 1,
        pageSize: totalCount,
      };
    }
    return getMockShowtimeRows(page);
  } catch {
    return getMockShowtimeRows(page);
  }
}

