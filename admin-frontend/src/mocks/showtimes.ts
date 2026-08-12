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

const allShowtimeRows: ShowtimeRowData[] = [
  {
    id: "sc-001",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "Hall 3",
    hall: "Hall 3",
    time: "18:30",
    timeLabel: "Today",
    format: "IMAX",
    seatsFilled: 58,
    seatsTotal: 64,
    status: "ALMOST FULL",
  },
  {
    id: "sc-002",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10",
    title: "Avengers: Endgame",
    durationMins: 181,
    genre: "Action/Sci-Fi",
    theaterName: "Hall 4",
    hall: "Hall 4",
    time: "21:00",
    timeLabel: "Today",
    format: "4DX",
    seatsFilled: 42,
    seatsTotal: 64,
    status: "ON SALE",
  },
  {
    id: "sc-003",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdLMFblwS4y1QbzHFKs9g150scJslcAsSxTcdJMwid4w&s=10",
    title: "The Fairy Secret",
    durationMins: 135,
    genre: "Action",
    theaterName: "Hall 1",
    hall: "Hall 1",
    time: "19:15",
    timeLabel: "Today",
    format: "2D",
    seatsFilled: 30,
    seatsTotal: 64,
    status: "ON SALE",
  },
  {
    id: "sc-004",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVj1jwI4fGAbXd6dOf3emm0PzHhQj9-ZK6nv13pb5dQ&s=10",
    title: "Jurrasic Echoes",
    durationMins: 148,
    genre: "Drama",
    theaterName: "Hall 2",
    hall: "Hall 2",
    time: "16:45",
    timeLabel: "Aug 4",
    format: "STANDARD",
    seatsFilled: 22,
    seatsTotal: 64,
    status: "ON SALE",
  },
  {
    id: "sc-005",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtWdSsPc3Lf9zMSAufsmKPEQ-aAiFwWyIVXNghzTx5UA&s=10",
    title: "The 12 dancing princesses",
    durationMins: 155,
    genre: "Sci-Fi",
    theaterName: "Hall 3",
    hall: "Hall 3",
    time: "20:00",
    timeLabel: "Aug 4",
    format: "DOLBY",
    seatsFilled: 48,
    seatsTotal: 64,
    status: "ON SALE",
  },
  {
    id: "sc-006",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdXmUXa0G1ezo-TA0vrr_GAhisBMegQz09jeJbDCgkRw&s=10",
    title: "Pirate Fair: Echoes of the Sea",
    durationMins: 112,
    genre: "Horror",
    theaterName: "Hall 1",
    hall: "Hall 1",
    time: "18:00",
    timeLabel: "Aug 5",
    format: "2D",
    seatsFilled: 55,
    seatsTotal: 64,
    status: "CONFLICT",
  },
  {
    id: "sc-007",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoGytKPuYMT7IQulS8QemehYHgNiNsOyuoxX2rbQsPdw&s=10",
    title: "SPIDER-MAN: INTO THE SPIDER-VERSE 2",
    durationMins: 140,
    genre: "Sci-Fi",
    theaterName: "Hall 2",
    hall: "Hall 2",
    time: "21:30",
    timeLabel: "Aug 5",
    format: "STANDARD",
    seatsFilled: 60,
    seatsTotal: 64,
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
