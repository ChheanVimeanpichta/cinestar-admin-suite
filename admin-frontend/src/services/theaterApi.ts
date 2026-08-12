import { TheaterVenue, TheaterHall } from "../types";
import { apiGet } from "./api";

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
