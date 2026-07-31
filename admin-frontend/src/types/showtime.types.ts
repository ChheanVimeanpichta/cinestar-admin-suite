export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  theater: string;
  startTime: string;
  format: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  formats: string[];
  capacity: number;
}

export interface NewScreeningInput {
  movieId: string;
  theaterId: string;
  date: string;
  time: string;
  format: string;
}
