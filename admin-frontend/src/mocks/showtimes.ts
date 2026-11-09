import { ShowtimeRowData } from "../components/admin/ShowtimeRow";

export interface ShowtimeRowsResponse {
  rows: ShowtimeRowData[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
}

export interface ShowtimeStats {
  todaysShows: number;
  totalCapacityPct: number;
  conflicts: number;
  activeHalls: number;
}

const getIsoDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

const getLabelDate = (offsetDays: number) => {
  if (offsetDays === 0) return "Today";
  if (offsetDays === 1) return "Tomorrow";
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const allShowtimeRows: ShowtimeRowData[] = [
  // Today - CineStar Downtown
  {
    id: "sc-001",
    movieId: "avenger",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "CineStar Downtown",
    venueId: "v-001",
    venueName: "CineStar Downtown",
    hall: "Hall 3 - IMAX",
    time: "18:30",
    timeLabel: getLabelDate(0),
    date: getIsoDate(0),
    format: "IMAX",
    seatsFilled: 130,
    seatsTotal: 180,
    status: "ALMOST FULL",
  },
  {
    id: "sc-002",
    movieId: "avenger",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "CineStar Downtown",
    venueId: "v-001",
    venueName: "CineStar Downtown",
    hall: "Hall 4 - 4DX",
    time: "21:00",
    timeLabel: getLabelDate(0),
    date: getIsoDate(0),
    format: "4DX",
    seatsFilled: 82,
    seatsTotal: 120,
    status: "ON SALE",
  },
  {
    id: "sc-003",
    movieId: "spider-verse-2",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoGytKPuYMT7IQulS8QemehYHgNiNsOyuoxX2rbQsPdw&s=10",
    title: "SPIDER-MAN: INTO THE SPIDER-VERSE 2",
    durationMins: 140,
    genre: "Animation/Action",
    theaterName: "CineStar Downtown",
    venueId: "v-001",
    venueName: "CineStar Downtown",
    hall: "Hall 4 - 4DX",
    time: "15:30",
    timeLabel: getLabelDate(0),
    date: getIsoDate(0),
    format: "4DX",
    seatsFilled: 65,
    seatsTotal: 120,
    status: "ON SALE",
  },
  {
    id: "sc-004",
    movieId: "raya",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9pl3ezvWPpgU1UoObqXTpjE5Q4GskYSfKcZJNNNvFw&s=10",
    title: "Raya and the Last Dragon",
    durationMins: 107,
    genre: "Mystery",
    theaterName: "CineStar Downtown",
    venueId: "v-001",
    venueName: "CineStar Downtown",
    hall: "Hall 1 - Standard",
    time: "14:00",
    timeLabel: getLabelDate(0),
    date: getIsoDate(0),
    format: "STANDARD",
    seatsFilled: 45,
    seatsTotal: 150,
    status: "ON SALE",
  },

  // Today - CineStar Riverside
  {
    id: "sc-005",
    movieId: "avenger",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "CineStar Riverside",
    venueId: "v-002",
    venueName: "CineStar Riverside",
    hall: "Hall 6 - Dolby Atmos",
    time: "19:45",
    timeLabel: getLabelDate(0),
    date: getIsoDate(0),
    format: "DOLBY",
    seatsFilled: 95,
    seatsTotal: 140,
    status: "ON SALE",
  },
  {
    id: "sc-006",
    movieId: "iron-verdict",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWY9YlOpu9dKsNZb7Va9AgzIdVPXZlJs-19XeP7JkudA&s=10",
    title: "Iron Verdict",
    durationMins: 141,
    genre: "Action / Crime",
    theaterName: "CineStar Riverside",
    venueId: "v-002",
    venueName: "CineStar Riverside",
    hall: "Hall 5 - VIP Lounge",
    time: "17:30",
    timeLabel: getLabelDate(0),
    date: getIsoDate(0),
    format: "DOLBY",
    seatsFilled: 60,
    seatsTotal: 100,
    status: "ON SALE",
  },

  // Today - CineStar Westgate
  {
    id: "sc-007",
    movieId: "spider-verse-2",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoGytKPuYMT7IQulS8QemehYHgNiNsOyuoxX2rbQsPdw&s=10",
    title: "SPIDER-MAN: INTO THE SPIDER-VERSE 2",
    durationMins: 140,
    genre: "Animation/Action",
    theaterName: "CineStar Westgate",
    venueId: "v-003",
    venueName: "CineStar Westgate",
    hall: "Hall 7 - ScreenX",
    time: "18:15",
    timeLabel: getLabelDate(0),
    date: getIsoDate(0),
    format: "STANDARD",
    seatsFilled: 75,
    seatsTotal: 120,
    status: "ON SALE",
  },

  // Today - Cinestar Olypia Mall
  {
    id: "sc-008",
    movieId: "avenger",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "Cinestar Olypia Mall",
    venueId: "v-1788767915971",
    venueName: "Cinestar Olypia Mall",
    hall: "Hall 6 - 2D",
    time: "18:00",
    timeLabel: getLabelDate(0),
    date: getIsoDate(0),
    format: "2D",
    seatsFilled: 50,
    seatsTotal: 100,
    status: "ON SALE",
  },

  // Tomorrow - CineStar Downtown
  {
    id: "sc-009",
    movieId: "avenger",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "CineStar Downtown",
    venueId: "v-001",
    venueName: "CineStar Downtown",
    hall: "Hall 3 - IMAX",
    time: "15:00",
    timeLabel: getLabelDate(1),
    date: getIsoDate(1),
    format: "IMAX",
    seatsFilled: 70,
    seatsTotal: 180,
    status: "ON SALE",
  },
  {
    id: "sc-010",
    movieId: "avenger",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "CineStar Downtown",
    venueId: "v-001",
    venueName: "CineStar Downtown",
    hall: "Hall 3 - IMAX",
    time: "19:30",
    timeLabel: getLabelDate(1),
    date: getIsoDate(1),
    format: "IMAX",
    seatsFilled: 110,
    seatsTotal: 180,
    status: "ON SALE",
  },
  {
    id: "sc-011",
    movieId: "spider-verse-2",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoGytKPuYMT7IQulS8QemehYHgNiNsOyuoxX2rbQsPdw&s=10",
    title: "SPIDER-MAN: INTO THE SPIDER-VERSE 2",
    durationMins: 140,
    genre: "Animation/Action",
    theaterName: "CineStar Downtown",
    venueId: "v-001",
    venueName: "CineStar Downtown",
    hall: "Hall 4 - 4DX",
    time: "17:00",
    timeLabel: getLabelDate(1),
    date: getIsoDate(1),
    format: "4DX",
    seatsFilled: 85,
    seatsTotal: 120,
    status: "ON SALE",
  },
  {
    id: "sc-012",
    movieId: "raya",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9pl3ezvWPpgU1UoObqXTpjE5Q4GskYSfKcZJNNNvFw&s=10",
    title: "Raya and the Last Dragon",
    durationMins: 107,
    genre: "Mystery",
    theaterName: "CineStar Downtown",
    venueId: "v-001",
    venueName: "CineStar Downtown",
    hall: "Hall 2 - Standard",
    time: "14:30",
    timeLabel: getLabelDate(1),
    date: getIsoDate(1),
    format: "STANDARD",
    seatsFilled: 40,
    seatsTotal: 140,
    status: "ON SALE",
  },
  {
    id: "sc-013",
    movieId: "avenger",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "CineStar Riverside",
    venueId: "v-002",
    venueName: "CineStar Riverside",
    hall: "Hall 6 - Dolby Atmos",
    time: "20:00",
    timeLabel: getLabelDate(1),
    date: getIsoDate(1),
    format: "DOLBY",
    seatsFilled: 65,
    seatsTotal: 140,
    status: "ON SALE",
  },

  // Day After Tomorrow
  {
    id: "sc-014",
    movieId: "avenger",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "CineStar Downtown",
    venueId: "v-001",
    venueName: "CineStar Downtown",
    hall: "Hall 3 - IMAX",
    time: "18:30",
    timeLabel: getLabelDate(2),
    date: getIsoDate(2),
    format: "IMAX",
    seatsFilled: 55,
    seatsTotal: 180,
    status: "ON SALE",
  },
  {
    id: "sc-015",
    movieId: "spider-verse-2",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoGytKPuYMT7IQulS8QemehYHgNiNsOyuoxX2rbQsPdw&s=10",
    title: "SPIDER-MAN: INTO THE SPIDER-VERSE 2",
    durationMins: 140,
    genre: "Animation/Action",
    theaterName: "CineStar Westgate",
    venueId: "v-003",
    venueName: "CineStar Westgate",
    hall: "Hall 7 - ScreenX",
    time: "19:00",
    timeLabel: getLabelDate(2),
    date: getIsoDate(2),
    format: "STANDARD",
    seatsFilled: 60,
    seatsTotal: 120,
    status: "ON SALE",
  },
];

const PAGE_SIZE = 3;

export function getMockShowtimeRows(page: number): ShowtimeRowsResponse {
  const totalCount = allShowtimeRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  return {
    rows: allShowtimeRows.slice(start, start + PAGE_SIZE),
    totalCount,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}

export const mockShowtimeStats: ShowtimeStats = {
  todaysShows: 3,
  totalCapacityPct: 72,
  conflicts: 2,
  activeHalls: 4,
};
