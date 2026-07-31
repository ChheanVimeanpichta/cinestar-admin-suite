import { Booking } from '../../types/booking.types';
import { DataTable, Column } from '../shared/DataTable';

export interface BookingLedgerTableProps {
  bookings: Booking[];
  onSelect?: (booking: Booking) => void;
}

export const BookingLedgerTable = ({ bookings, onSelect }: BookingLedgerTableProps) => {
  const columns: Column<Booking>[] = [
    {
      key: 'transactionId',
      header: 'Transaction ID',
      render: (booking) => (
        <span style={{ fontFamily: 'monospace', color: '#f59e0b' }}>{booking.transactionId}</span>
      ),
    },
    { key: 'customer', header: 'Customer', render: (booking) => booking.customer },
    { key: 'movie', header: 'Movie', render: (booking) => booking.movie },
    { key: 'date', header: 'Date', render: (booking) => new Date(booking.date).toLocaleDateString() },
    {
      key: 'status',
      header: 'Status',
      render: (booking) => (
        <span
          style={{
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            background:
              booking.status === 'Confirmed'
                ? 'rgba(34, 197, 94, 0.15)'
                : booking.status === 'Pending'
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
            color:
              booking.status === 'Confirmed'
                ? '#22c55e'
                : booking.status === 'Pending'
                  ? '#f59e0b'
                  : '#ef4444',
          }}
        >
          {booking.status}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (booking) => (
        <span style={{ fontWeight: 600 }}>${booking.total.toFixed(2)}</span>
      ),
    },
  ];

  return <DataTable columns={columns} rows={bookings} onRowClick={onSelect} />;
};
