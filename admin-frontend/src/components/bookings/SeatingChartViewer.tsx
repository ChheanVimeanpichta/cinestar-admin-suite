import { Seat } from '../../types/booking.types';

export interface SeatingChartViewerProps {
  seats: Seat[];
  showtimeLabel?: string;
}

const SEAT_COLORS: Record<Seat['status'], { background: string; color: string }> = {
  available: { background: '#1f2937', color: '#9ca3af' },
  occupied: { background: '#065f46', color: '#34d399' },
  conflict: { background: '#7f1d1d', color: '#f87171' },
};

export const SeatingChartViewer = ({ seats, showtimeLabel }: SeatingChartViewerProps) => {
  return (
    <div>
      {showtimeLabel && (
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#9ca3af' }}>{showtimeLabel}</p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(2rem, 1fr))',
          gap: '0.375rem',
          marginTop: '0.75rem',
        }}
      >
        {seats.map((seat) => {
          const colors = SEAT_COLORS[seat.status];
          return (
            <div
              key={seat.id}
              title={`${seat.row}${seat.number} — ${seat.status}`}
              style={{
                padding: '0.375rem 0',
                borderRadius: '0.375rem',
                background: colors.background,
                color: colors.color,
                fontSize: '0.625rem',
                fontWeight: 600,
                textAlign: 'center',
                border: seat.status === 'conflict' ? '1px solid #ef4444' : 'none',
              }}
            >
              {seat.row}
              {seat.number}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', color: '#9ca3af' }}>
        <span>
          <span style={{ display: 'inline-block', width: '0.75rem', height: '0.75rem', borderRadius: '0.25rem', background: '#1f2937', marginRight: '0.25rem' }} />
          Available
        </span>
        <span>
          <span style={{ display: 'inline-block', width: '0.75rem', height: '0.75rem', borderRadius: '0.25rem', background: '#065f46', marginRight: '0.25rem' }} />
          Occupied
        </span>
        <span>
          <span style={{ display: 'inline-block', width: '0.75rem', height: '0.75rem', borderRadius: '0.25rem', background: '#7f1d1d', marginRight: '0.25rem' }} />
          Conflict
        </span>
      </div>
    </div>
  );
};
