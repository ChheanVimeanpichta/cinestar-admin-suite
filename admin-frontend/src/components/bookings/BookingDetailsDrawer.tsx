import { Booking } from '../../types/booking.types';

export interface BookingDetailsDrawerProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingDetailsDrawer = ({ booking, onClose }: BookingDetailsDrawerProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        width: '24rem',
        maxWidth: '100vw',
        padding: '1.5rem',
        background: '#111827',
        borderLeft: '1px solid #1f2937',
        boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f5f7fa' }}>Booking Details</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            padding: '0.25rem 0.625rem',
            borderRadius: '0.375rem',
            border: '1px solid #374151',
            background: 'transparent',
            color: '#f5f7fa',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>

      {booking ? (
        <dl style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(
            [
              ['Transaction ID', booking.transactionId],
              ['Customer', booking.customer],
              ['Movie', booking.movie],
              ['Date', new Date(booking.date).toLocaleString()],
              ['Status', booking.status],
              ['Total', `$${booking.total.toFixed(2)}`],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <dt style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>{label}</dt>
              <dd style={{ margin: '0.25rem 0 0', color: '#f5f7fa' }}>{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p style={{ marginTop: '1.5rem', color: '#9ca3af' }}>Select a booking to view its details.</p>
      )}
    </div>
  );
};
