import { TheaterVenue, TheaterHall } from "../types";
import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export function fetchTheaterVenues(): Promise<TheaterVenue[]> {
  return apiGet<TheaterVenue[]>("/theaters/venues");
}

export function fetchHallsForVenue(venueId: string): Promise<TheaterHall[]> {
  return apiGet<TheaterHall[]>(`/theaters/venues/${venueId}/halls`);
}

export function fetchVenueStats(): Promise<{
  totalVenues: number;
  activeHalls: number;
  totalCapacity: number;
  systemHealth: string;
}> {
  return apiGet("/theaters/stats");
}

export function createVenue(data: Partial<TheaterVenue>): Promise<TheaterVenue> {
  return apiPost<TheaterVenue>("/theaters/venues", data);
}

export function updateVenue(id: string, data: Partial<TheaterVenue>): Promise<TheaterVenue> {
  return apiPut<TheaterVenue>(`/theaters/venues/${id}`, data);
}

export function deleteVenue(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`/theaters/venues/${id}`);
}

export function createHall(venueId: string, data: Partial<TheaterHall>): Promise<TheaterHall> {
  return apiPost<TheaterHall>(`/theaters/venues/${venueId}/halls`, data);
}

export function updateHall(hallId: string, data: Partial<TheaterHall>): Promise<TheaterHall> {
  return apiPut<TheaterHall>(`/theaters/halls/${hallId}`, data);
}

export function deleteHall(hallId: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`/theaters/halls/${hallId}`);
}
