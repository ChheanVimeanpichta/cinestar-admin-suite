// Mock data service for movies/theaters/screenings/bookings/users.
// NOTE: The backend has no DB tables for these entities yet, so the endpoints
// serve representative seed data matching the admin frontend contracts. Swap
// these functions for real Prisma queries once the models exist.

export interface Movie {
  id: string;
  title: string;
  poster: string;
  genre: string;
  score: number | null;
  synopsis: string;
  badge?: string;
  hasBookBtn?: boolean;
  durationMins?: number;
  releaseDate?: string;
  bannerUrl?: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
}

export interface Screening {
  id: string;
  movieId: string;
  theaterId: string;
  date: string;
  time: string;
  format: 'IMAX' | '4DX' | 'STANDARD' | 'DOLBY' | '2D';
  hall: string;
  price: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'conflict';
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  movieTitle: string;
  screening: Screening;
  seats: Seat[];
  totalPrice: number;
  paymentMethod: 'ABA' | 'ACLEDA' | 'WING';
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
}

const movies: Movie[] = [
  {
    id: 'avenger',
    title: 'Avengers: Endgame',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10',
    genre: 'Action/Sci-Fi',
    score: 8.9,
    synopsis: 'When the signal dies, the city follows.',
    badge: 'IMAX',
    hasBookBtn: true,
  },
  {
    id: 'fairy-secret',
    title: 'The Fairy Secret',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdLMFblwS4y1QbzHFKs9g150scJslcAsSxTcdJMwid4w&s=10',
    genre: 'Action',
    score: 7.4,
    synopsis: 'Every spire hides a secret.',
    badge: '4DX',
  },
  {
    id: 'jurrasic-echoes',
    title: 'Jurrasic Echoes',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVj1jwI4fGAbXd6dOf3emm0PzHhQj9-ZK6nv13pb5dQ&s=10',
    genre: 'Drama',
    score: 9.2,
    synopsis: 'Dir. A.G. Iñárritu',
    badge: 'CineStar',
  },
  {
    id: 'princes',
    title: 'The 12 dancing princesses',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtWdSsPc3Lf9zMSAufsmKPEQ-aAiFwWyIVXNghzTx5UA&s=10',
    genre: 'Sci-Fi',
    score: 8.1,
    synopsis: 'Beyond the known universe.',
    badge: 'IMAX',
  },
  {
    id: 'pirate-echoes',
    title: 'Pirate Fair: Echoes of the Sea',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdXmUXa0G1ezo-TA0vrr_GAhisBMegQz09jeJbDCgkRw&s=10',
    genre: 'Horror',
    score: 6.8,
    synopsis: 'No vacancy. No escape.',
  },
  {
    id: 'spider-verse-2',
    title: 'SPIDER-MAN: INTO THE SPIDER-VERSE 2',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoGytKPuYMT7IQulS8QemehYHgNiNsOyuoxX2rbQsPdw&s=10',
    genre: '',
    score: 8.5,
    synopsis: 'Rise of the empire.',
    badge: '4DX',
    hasBookBtn: true,
  },
  {
    id: 'raya',
    title: 'Raya and the Last Dragon',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9pl3ezvWPpgU1UoObqXTpjE5Q4GskYSfKcZJNNNvFw&s=10',
    genre: 'Mystery',
    score: null,
    synopsis: 'Trust no one.',
    badge: 'CineStar',
  },
  {
    id: 'sheep',
    title: 'Sheep Detective',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQnkapobjb_5fwfdC2YryPjTwmooJ8HLLcQIs0Aomi0A&s=10',
    genre: 'Sci-Fi/Drama',
    score: null,
    synopsis: 'The signal came from nowhere.',
  },
  {
    id: 'avatar',
    title: 'Avatar: The Way of Water',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsteWOIgIfjtkiYRnJNRzinTz0TXz3d3Z4bxdkoI1u2Q&s=10',
    genre: 'Thriller',
    score: null,
    synopsis: 'The mind is the final frontier.',
  },
  {
    id: 'hopper',
    title: 'HOPPER',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF2_jzf8Bot1lnxHSeU7iw5ZCTXLsAD9EkRWqOsVAzZw&s=10',
    genre: 'Action/Sci-Fi',
    score: null,
    synopsis: 'Humanity. Upgraded.',
  },
  {
    id: 'forn',
    title: 'Tinker Bell and the Legend of the Neverbeast',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbLJ65BPJksC0H21bjjmYF8-0LfHkmVrHnwSo4o09kQ&s=10',
    genre: 'Mystery/Adventure',
    score: null,
    synopsis: 'Humanity. Upgraded.',
  },
  {
    id: 'barbie',
    title: 'Barbie: Princess Charm School',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2LRKh6UujWBbI5KWrAY0EGn93XVUn-shxv0EMLZ6qGw&s=10',
    genre: 'Drama',
    score: null,
    synopsis: 'Humanity. Upgraded.',
  },
  {
    id: 'swapp',
    title: 'Swapped',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSF5wtLqYgJrada9i_nneLJWtnWe31R6zgAi541ky0bg&s=10',
    genre: 'Drama/Adventure',
    score: null,
    synopsis: 'Humanity. Upgraded.',
  },
  {
    id: 'mermaid',
    title: 'Barbie in a Mermaid Tale',
    poster: 'https://m.media-amazon.com/images/M/MV5BZWMwYWFmMDgtYTAyMy00OWRjLTgxYTEtZWYyZjcwNDNjY2I0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    genre: 'Drama/Adventure',
    score: null,
    synopsis: 'Humanity. Upgraded.',
  },
];

const theaters: Theater[] = [
  { id: 'th-hall-1', name: 'Hall 1', location: 'Floor 2 - East Wing' },
  { id: 'th-hall-2', name: 'Hall 2', location: 'Floor 2 - West Wing' },
  { id: 'th-hall-3', name: 'Hall 3', location: 'Floor 3 - IMAX' },
  { id: 'th-hall-4', name: 'Hall 4', location: 'Floor 3 - 4DX' },
];

const screenings: Screening[] = [
  {
    id: 'sc-001',
    movieId: 'avenger',
    theaterId: 'th-hall-3',
    date: '2026-08-03',
    time: '18:30',
    format: 'IMAX',
    hall: 'Hall 3',
    price: 18,
  },
  {
    id: 'sc-002',
    movieId: 'avenger',
    theaterId: 'th-hall-4',
    date: '2026-08-03',
    time: '21:00',
    format: '4DX',
    hall: 'Hall 4',
    price: 22,
  },
  {
    id: 'sc-003',
    movieId: 'fairy-secret',
    theaterId: 'th-hall-1',
    date: '2026-08-03',
    time: '19:15',
    format: '2D',
    hall: 'Hall 1',
    price: 12,
  },
  {
    id: 'sc-004',
    movieId: 'jurrasic-echoes',
    theaterId: 'th-hall-2',
    date: '2026-08-04',
    time: '16:45',
    format: 'STANDARD',
    hall: 'Hall 2',
    price: 12,
  },
  {
    id: 'sc-005',
    movieId: 'princes',
    theaterId: 'th-hall-3',
    date: '2026-08-04',
    time: '20:00',
    format: 'DOLBY',
    hall: 'Hall 3',
    price: 16,
  },
  {
    id: 'sc-006',
    movieId: 'pirate-echoes',
    theaterId: 'th-hall-1',
    date: '2026-08-05',
    time: '18:00',
    format: '2D',
    hall: 'Hall 1',
    price: 12,
  },
  {
    id: 'sc-007',
    movieId: 'spider-verse-2',
    theaterId: 'th-hall-2',
    date: '2026-08-05',
    time: '21:30',
    format: 'STANDARD',
    hall: 'Hall 2',
    price: 12,
  },
];

const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const generateSeats = (screeningId: string, price: number): Seat[] => {
  const seats: Seat[] = [];
  seatRows.forEach((row, rowIndex) => {
    for (let number = 1; number <= 8; number += 1) {
      seats.push({
        id: `${screeningId}-${row}${number}`,
        row,
        number,
        status: rowIndex < 2 && number <= 3 ? 'occupied' : 'available',
        price,
      });
    }
  });
  return seats;
};

const bookings: Booking[] = [
  {
    id: 'bk-000',
    userId: 'usr-admin',
    movieTitle: 'SPIDER-MAN: INTO THE SPIDER-VERSE 2',
    screening: screenings[6],
    seats: [generateSeats('sc-007', 12)[8], generateSeats('sc-007', 12)[9]],
    totalPrice: 24,
    paymentMethod: 'ABA',
    status: 'confirmed',
    createdAt: '2026-08-03T11:02:00Z',
  },
  {
    id: 'bk-001',
    userId: 'usr-jane',
    movieTitle: 'Avengers: Endgame',
    screening: screenings[0],
    seats: [generateSeats('sc-001', 18)[3], generateSeats('sc-001', 18)[4]],
    totalPrice: 36,
    paymentMethod: 'ABA',
    status: 'confirmed',
    createdAt: '2026-08-03T10:44:21Z',
  },
  {
    id: 'bk-002',
    userId: 'usr-mike',
    movieTitle: 'The Fairy Secret',
    screening: screenings[2],
    seats: [generateSeats('sc-003', 12)[6]],
    totalPrice: 12,
    paymentMethod: 'WING',
    status: 'confirmed',
    createdAt: '2026-08-03T10:12:05Z',
  },
  {
    id: 'bk-003',
    userId: 'usr-sara',
    movieTitle: 'Jurrasic Echoes',
    screening: screenings[3],
    seats: [generateSeats('sc-004', 12)[0], generateSeats('sc-004', 12)[1], generateSeats('sc-004', 12)[2]],
    totalPrice: 36,
    paymentMethod: 'ACLEDA',
    status: 'pending',
    createdAt: '2026-08-03T09:58:47Z',
  },
  {
    id: 'bk-004',
    userId: 'usr-alex',
    movieTitle: 'The 12 dancing princesses',
    screening: screenings[4],
    seats: [generateSeats('sc-005', 16)[5]],
    totalPrice: 16,
    paymentMethod: 'ABA',
    status: 'cancelled',
    createdAt: '2026-08-02T18:30:12Z',
  },
];

const users: UserProfile[] = [
  {
    id: 'usr-admin',
    name: 'System Admin',
    email: 'admin@cinestar.com',
    avatarUrl: 'https://picsum.photos/seed/admin/100/100',
    role: 'admin',
  },
  {
    id: 'usr-jane',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatarUrl: 'https://picsum.photos/seed/jane/100/100',
    role: 'customer',
  },
  {
    id: 'usr-mike',
    name: 'Mike Tech',
    email: 'mike.tech@example.com',
    avatarUrl: 'https://picsum.photos/seed/mike/100/100',
    role: 'customer',
  },
  {
    id: 'usr-sara',
    name: 'Sara Lin',
    email: 'sara.lin@example.com',
    avatarUrl: 'https://picsum.photos/seed/sara/100/100',
    role: 'customer',
  },
  {
    id: 'usr-alex',
    name: 'Alex Kim',
    email: 'alex.kim@example.com',
    avatarUrl: 'https://picsum.photos/seed/alex/100/100',
    role: 'customer',
  },
];

export const getMovies = async (): Promise<Movie[]> => movies;

export const getNowShowing = async (): Promise<Movie[]> => movies;

export const getMovieById = async (id: string): Promise<Movie | undefined> =>
  movies.find((m) => m.id === id);

export const getTheaters = async (): Promise<Theater[]> => theaters;

export interface TheaterVenue {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  status: "Active" | "Maintenance";
  hallCount: number;
  capacity: number;
}

export interface TheaterHall {
  id: string;
  venueId: string;
  name: string;
  screenType: "IMAX" | "4DX" | "STANDARD" | "DOLBY" | "2D";
  soundSystem: string;
  capacity: number;
  seatMapThumbUrl?: string;
  status: "Active" | "Maintenance";
}

const venues: TheaterVenue[] = [
  {
    id: "v-001",
    name: "CineStar Downtown",
    address: "Sangkat Tonle Bassac, Khan Chamkarmon, Phnom Penh",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop",
    status: "Active",
    hallCount: 6,
    capacity: 720,
  },
  {
    id: "v-002",
    name: "CineStar Riverside",
    address: "Sangkat Chroy Changvar, Khan Chroy Changvar, Phnom Penh",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=300&fit=crop",
    status: "Active",
    hallCount: 4,
    capacity: 480,
  },
  {
    id: "v-003",
    name: "CineStar Westgate",
    address: "Sangkat Chaom Chau, Khan Porsenchey, Phnom Penh",
    imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=300&fit=crop",
    status: "Maintenance",
    hallCount: 3,
    capacity: 360,
  },
];

const halls: TheaterHall[] = [
  { id: "h-001", venueId: "v-001", name: "Hall 1 - IMAX", screenType: "IMAX", soundSystem: "Dolby Atmos", capacity: 180, status: "Active" },
  { id: "h-002", venueId: "v-001", name: "Hall 2 - 4DX", screenType: "4DX", soundSystem: "Dolby Atmos", capacity: 120, status: "Active" },
  { id: "h-003", venueId: "v-001", name: "Hall 3 - Standard", screenType: "STANDARD", soundSystem: "THX Certified", capacity: 150, status: "Active" },
  { id: "h-004", venueId: "v-001", name: "Hall 4 - DOLBY", screenType: "DOLBY", soundSystem: "Dolby Atmos", capacity: 100, status: "Maintenance" },
  { id: "h-005", venueId: "v-001", name: "Hall 5 - 2D", screenType: "2D", soundSystem: "Dolby Atmos", capacity: 100, status: "Active" },
  { id: "h-006", venueId: "v-001", name: "Hall 6 - 2D", screenType: "2D", soundSystem: "THX Certified", capacity: 70, status: "Active" },
  { id: "h-007", venueId: "v-002", name: "Hall 1 - IMAX", screenType: "IMAX", soundSystem: "Dolby Atmos", capacity: 160, status: "Active" },
  { id: "h-008", venueId: "v-002", name: "Hall 2 - Standard", screenType: "STANDARD", soundSystem: "THX Certified", capacity: 140, status: "Active" },
  { id: "h-009", venueId: "v-002", name: "Hall 3 - 4DX", screenType: "4DX", soundSystem: "Dolby Atmos", capacity: 100, status: "Active" },
  { id: "h-010", venueId: "v-002", name: "Hall 4 - 2D", screenType: "2D", soundSystem: "Dolby Atmos", capacity: 80, status: "Active" },
  { id: "h-011", venueId: "v-003", name: "Hall 1 - DOLBY", screenType: "DOLBY", soundSystem: "Dolby Atmos", capacity: 140, status: "Maintenance" },
  { id: "h-012", venueId: "v-003", name: "Hall 2 - Standard", screenType: "STANDARD", soundSystem: "THX Certified", capacity: 120, status: "Maintenance" },
  { id: "h-013", venueId: "v-003", name: "Hall 3 - 2D", screenType: "2D", soundSystem: "Dolby Atmos", capacity: 100, status: "Active" },
];

export const getVenues = async (): Promise<TheaterVenue[]> => venues;

export const getHallsForVenue = async (venueId: string): Promise<TheaterHall[]> =>
  halls.filter((h) => h.venueId === venueId);

export const getVenueStats = async () => {
  const totalVenues = venues.length;
  const activeHalls = halls.filter((h) => h.status === "Active").length;
  const totalCapacity = halls.reduce((sum, h) => sum + h.capacity, 0);
  const systemHealth = venues.every((v) => v.status === "Active") ? "Optimal" : "Caution";
  return { totalVenues, activeHalls, totalCapacity, systemHealth };
};

export const getScreenings = async (): Promise<Screening[]> => screenings;

export interface ShowtimeRowData {
  id: string;
  posterUrl: string;
  title: string;
  durationMins: number;
  genre: string;
  theaterName: string;
  hall: string;
  time: string;
  timeLabel: string;
  format: string;
  seatsFilled: number;
  seatsTotal: number;
  status: "ALMOST FULL" | "ON SALE" | "CONFLICT";
}

export interface ShowtimeRowsResponse {
  rows: ShowtimeRowData[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
}

export const getShowtimeRows = async (page: number): Promise<ShowtimeRowsResponse> => {
  const PAGE_SIZE = 3;
  const all: ShowtimeRowData[] = screenings.map((s) => {
    const movie = movies.find((m) => m.id === s.movieId);
    const theater = theaters.find((t) => t.id === s.theaterId);
    const seatsTotal = 64;
    const seatsFilled = Math.floor(Math.random() * seatsTotal);
    const occupancyPct = (seatsFilled / seatsTotal) * 100;

    let status: "ALMOST FULL" | "ON SALE" | "CONFLICT" = "ON SALE";
    if (occupancyPct > 85) status = "ALMOST FULL";
    if (s.movieId === "pirate-echoes" || s.movieId === "spider-verse-2")
      status = "CONFLICT";

    const today = new Date().toISOString().slice(0, 10);
    const isToday = s.date === today;

    return {
      id: s.id,
      posterUrl: movie?.poster ?? "",
      title: movie?.title ?? "Unknown",
      durationMins: movie?.durationMins ?? 120,
      genre: movie?.genre ?? "",
      theaterName: theater?.name ?? s.hall,
      hall: s.hall,
      time: s.time,
      timeLabel: isToday ? "Today" : new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      format: s.format,
      seatsFilled,
      seatsTotal,
      status,
    };
  });

  const totalCount = all.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  return {
    rows: all.slice(start, start + PAGE_SIZE),
    totalCount,
    totalPages,
    pageSize: PAGE_SIZE,
  };
};

export const getShowtimeStats = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const todaysShows = screenings.filter((s) => s.date === today).length;

  const seatsTotal = 64;
  let totalFilled = 0;
  screenings.forEach(() => {
    totalFilled += Math.floor(Math.random() * seatsTotal);
  });
  const totalCapacityPct = Math.round((totalFilled / (screenings.length * seatsTotal)) * 100);

  const conflicts = screenings.filter(
    (s) => s.movieId === "pirate-echoes" || s.movieId === "spider-verse-2"
  ).length;

  const activeHalls = new Set(screenings.map((s) => s.theaterId)).size;

  return { todaysShows, totalCapacityPct, conflicts, activeHalls };
};

export const getScreeningsForMovie = async (movieId: string): Promise<Screening[]> =>
  screenings.filter((s) => s.movieId === movieId);

export const getSeatsForScreening = async (screeningId: string): Promise<Seat[]> => {
  const screening = screenings.find((s) => s.id === screeningId);
  return generateSeats(screeningId, screening?.price ?? 12);
};

export const createBooking = async (
  screeningId: string,
  seatIds: string[],
  paymentMethod: Booking['paymentMethod']
): Promise<Booking> => {
  const screening = screenings.find((s) => s.id === screeningId) ?? screenings[0];
  const movie = movies.find((m) => m.id === screening.movieId);
  const seats = seatIds.map((id) => {
    const seat = generateSeats(screeningId, screening.price).find((s) => s.id === id);
    return seat ?? { id, row: 'A', number: 0, status: 'available' as const, price: screening.price };
  });
  const booking: Booking = {
    id: `bk-${Date.now()}`,
    userId: 'usr-admin',
    movieTitle: movie?.title ?? 'Unknown Movie',
    screening,
    seats,
    totalPrice: seats.reduce((sum, s) => sum + s.price, 0),
    paymentMethod,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(booking);
  return booking;
};

export const getBookings = async (): Promise<Booking[]> => bookings;

export const getBookingById = async (id: string): Promise<Booking | undefined> =>
  bookings.find((b) => b.id === id);

export const getMyBookings = async (): Promise<Booking[]> =>
  bookings.filter((b) => b.userId === 'usr-admin');

export const getUsers = async (): Promise<UserProfile[]> => users;

export const getCurrentUser = async (): Promise<UserProfile | undefined> =>
  users.find((u) => u.id === 'usr-admin');

export const updateUser = async (
  id: string,
  patch: Partial<UserProfile>
): Promise<UserProfile | undefined> => {
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;
  Object.assign(user, patch);
  return user;
};

export interface BookingLogStats {
  totalSalesToday: string;
  activeBookings: number;
  pendingValidation: number;
}

export interface BookingLedgerEntry {
  id: string;
  customerName: string;
  customerInitials: string;
  movieTitle: string;
  screeningDate: string;
  screeningTime: string;
  seats: string[];
}

export interface SecurityStreamEvent {
  id: string;
  timeAgo: string;
  message: string;
  highlight?: string;
  tone: "alert" | "neutral" | "warning";
}

const bookingLogStats: BookingLogStats = {
  totalSalesToday: "$14,280.50",
  activeBookings: 342,
  pendingValidation: 18,
};

const bookingLedger: BookingLedgerEntry[] = [
  {
    id: "#CS-9921-X",
    customerName: "Sophia Laurent",
    customerInitials: "SL",
    movieTitle: "Avengers: Endgame",
    screeningDate: "Oct 24, 2023",
    screeningTime: "21:00",
    seats: ["H-12", "H-13"],
  },
  {
    id: "#CS-9920-R",
    customerName: "Marcus Chen",
    customerInitials: "MC",
    movieTitle: "The Fairy Secret",
    screeningDate: "Oct 24, 2023",
    screeningTime: "19:15",
    seats: ["D-05"],
  },
  {
    id: "#CS-9919-Q",
    customerName: "Elena Rodriguez",
    customerInitials: "ER",
    movieTitle: "Jurrasic Echoes",
    screeningDate: "Oct 23, 2023",
    screeningTime: "16:45",
    seats: ["F-08", "F-09"],
  },
  {
    id: "#CS-9918-P",
    customerName: "James O'Brien",
    customerInitials: "JO",
    movieTitle: "SPIDER-MAN: INTO THE SPIDER-VERSE 2",
    screeningDate: "Oct 23, 2023",
    screeningTime: "18:30",
    seats: ["A-01", "A-02", "A-03"],
  },
];

const securityEvents: SecurityStreamEvent[] = [
  {
    id: "sec-1",
    timeAgo: "2 mins ago",
    message: "Suspicious login attempt blocked for user j.doe@email.com",
    highlight: "blocked",
    tone: "alert",
  },
  {
    id: "sec-2",
    timeAgo: "12 mins ago",
    message: "Booking #CS-9921 payment verified via ABA gateway",
    highlight: "verified",
    tone: "neutral",
  },
  {
    id: "sec-3",
    timeAgo: "28 mins ago",
    message: "Multiple failed auth attempts from IP 192.168.4.22 \u2014 rate limit engaged",
    highlight: "rate limit engaged",
    tone: "warning",
  },
  {
    id: "sec-4",
    timeAgo: "46 mins ago",
    message: "Admin user channa.tech performed batch seat release",
    highlight: "batch seat release",
    tone: "neutral",
  },
  {
    id: "sec-5",
    timeAgo: "1 hr ago",
    message: "SSL certificate renewed for *.cinestar.io \u2014 no downtime detected",
    highlight: "no downtime",
    tone: "neutral",
  },
];

export const getBookingLogStats = async (): Promise<BookingLogStats> => bookingLogStats;
export const getBookingLedger = async (): Promise<BookingLedgerEntry[]> => bookingLedger;
export const getSecurityStream = async (): Promise<SecurityStreamEvent[]> => securityEvents;

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  role: "Admin" | "Staff" | "Customer";
  status: "Active" | "Suspended";
  joinDate: string;
  bookingCount: number;
}

export interface GrowthMetricPoint {
  day: string;
  value: number;
}

interface AdminUserParams {
  role: string;
  status: string;
  search: string;
  page: number;
}

const adminUsers: AdminUserRecord[] = [
  { id: "u-1", name: "Sophia Laurent", email: "s.laurent@cinestar.io", initials: "SL", role: "Admin", status: "Active", joinDate: "Oct 12, 2022", bookingCount: 48 },
  { id: "u-2", name: "Marcus Chen", email: "m.chen@cinestar.io", initials: "MC", role: "Staff", status: "Active", joinDate: "Mar 03, 2023", bookingCount: 22 },
  { id: "u-3", name: "Elena Rodriguez", email: "e.rodriguez@gmail.com", initials: "ER", role: "Customer", status: "Active", joinDate: "Jan 18, 2024", bookingCount: 12 },
  { id: "u-4", name: "James O'Brien", email: "j.obrien@gmail.com", initials: "JO", role: "Customer", status: "Suspended", joinDate: "Jun 05, 2023", bookingCount: 5 },
  { id: "u-5", name: "Aiko Tanaka", email: "a.tanaka@cinestar.io", initials: "AT", role: "Staff", status: "Active", joinDate: "Sep 20, 2023", bookingCount: 31 },
  { id: "u-6", name: "David Park", email: "d.park@gmail.com", initials: "DP", role: "Customer", status: "Active", joinDate: "Feb 14, 2024", bookingCount: 8 },
  { id: "u-7", name: "Maria Silva", email: "m.silva@gmail.com", initials: "MS", role: "Customer", status: "Active", joinDate: "Apr 02, 2023", bookingCount: 15 },
  { id: "u-8", name: "Robert Kim", email: "r.kim@cinestar.io", initials: "RK", role: "Admin", status: "Active", joinDate: "Jul 10, 2022", bookingCount: 56 },
  { id: "u-9", name: "Lisa Andersson", email: "l.andersson@gmail.com", initials: "LA", role: "Customer", status: "Suspended", joinDate: "Nov 30, 2023", bookingCount: 3 },
  { id: "u-10", name: "Tom Becker", email: "t.becker@cinestar.io", initials: "TB", role: "Staff", status: "Active", joinDate: "May 15, 2023", bookingCount: 27 },
];

const growthMetrics: GrowthMetricPoint[] = [
  { day: "Mon", value: 120 },
  { day: "Tue", value: 185 },
  { day: "Wed", value: 210 },
  { day: "Thu", value: 260 },
  { day: "Fri", value: 340 },
  { day: "Sat", value: 400 },
  { day: "Sun", value: 480 },
];

export const getAdminUserRecords = async (params: AdminUserParams): Promise<AdminUserRecord[]> => {
  let result = [...adminUsers];

  if (params.role !== "All") {
    result = result.filter((u) => u.role === params.role);
  }
  if (params.status !== "All") {
    result = result.filter((u) => u.status === params.status);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }

  const PAGE_SIZE = 5;
  const start = (params.page - 1) * PAGE_SIZE;
  return result.slice(start, start + PAGE_SIZE);
};

export const getUserManagementStats = async (): Promise<{ totalUsers: number }> => ({
  totalUsers: adminUsers.length,
});

export const getGrowthMetricsData = async (): Promise<GrowthMetricPoint[]> => growthMetrics;
