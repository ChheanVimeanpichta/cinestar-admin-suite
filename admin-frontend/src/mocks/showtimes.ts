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

export const allShowtimeRows: ShowtimeRowData[] = [
  {
    id: "sc-001",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "CineStar Grand Mall",
    venueId: "v-001",
    hall: "Hall 1 - IMAX",
    time: "18:30",
    timeLabel: "Today",
    format: "IMAX",
    seatsFilled: 130,
    seatsTotal: 180,
    status: "ALMOST FULL",
  },
  {
    id: "sc-002",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "CineStar Grand Mall",
    venueId: "v-001",
    hall: "Hall 2 - 4DX",
    time: "21:00",
    timeLabel: "Today",
    format: "4DX",
    seatsFilled: 82,
    seatsTotal: 120,
    status: "ON SALE",
  },
  {
    id: "sc-003",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdLMFblwS4y1QbzHFKs9g150scJslcAsSxTcdJMwid4w&s=10",
    title: "The Fairy Secret",
    durationMins: 135,
    genre: "Action",
    theaterName: "CineStar Grand Mall",
    venueId: "v-001",
    hall: "Hall 3 - Standard",
    time: "19:15",
    timeLabel: "Today",
    format: "STANDARD",
    seatsFilled: 65,
    seatsTotal: 150,
    status: "ON SALE",
  },
  {
    id: "sc-004",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVj1jwI4fGAbXd6dOf3emm0PzHhQj9-ZK6nv13pb5dQ&s=10",
    title: "Jurrasic Echoes",
    durationMins: 148,
    genre: "Drama",
    theaterName: "CineStar Riverside IMAX",
    venueId: "v-002",
    hall: "Hall 1 - IMAX",
    time: "16:45",
    timeLabel: "Aug 4",
    format: "IMAX",
    seatsFilled: 90,
    seatsTotal: 160,
    status: "ON SALE",
  },
  {
    id: "sc-005",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtWdSsPc3Lf9zMSAufsmKPEQ-aAiFwWyIVXNghzTx5UA&s=10",
    title: "The 12 dancing princesses",
    durationMins: 155,
    genre: "Sci-Fi",
    theaterName: "CineStar Riverside IMAX",
    venueId: "v-002",
    hall: "Hall 3 - 4DX",
    time: "20:00",
    timeLabel: "Aug 4",
    format: "4DX",
    seatsFilled: 62,
    seatsTotal: 100,
    status: "ON SALE",
  },
  {
    id: "sc-006",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdXmUXa0G1ezo-TA0vrr_GAhisBMegQz09jeJbDCgkRw&s=10",
    title: "Pirate Fair: Echoes of the Sea",
    durationMins: 112,
    genre: "Horror",
    theaterName: "CineStar City Center",
    venueId: "v-003",
    hall: "Hall 1 - DOLBY",
    time: "18:00",
    timeLabel: "Aug 5",
    format: "DOLBY",
    seatsFilled: 115,
    seatsTotal: 140,
    status: "CONFLICT",
  },
  {
    id: "sc-007",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoGytKPuYMT7IQulS8QemehYHgNiNsOyuoxX2rbQsPdw&s=10",
    title: "SPIDER-MAN: INTO THE SPIDER-VERSE 2",
    durationMins: 140,
    genre: "Sci-Fi",
    theaterName: "CineStar City Center",
    venueId: "v-003",
    hall: "Hall 2 - Standard",
    time: "21:30",
    timeLabel: "Aug 5",
    format: "STANDARD",
    seatsFilled: 98,
    seatsTotal: 120,
    status: "CONFLICT",
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
