export interface Booking {
  id: string;
  transactionId: string;
  customer: string;
  movie: string;
  total: number;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'conflict';
}
