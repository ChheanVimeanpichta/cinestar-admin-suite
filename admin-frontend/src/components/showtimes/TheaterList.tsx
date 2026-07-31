import { Theater } from '../../types/showtime.types';

export interface TheaterListProps {
  theaters: Theater[];
  selectedId?: string;
  onSelect?: (theater: Theater) => void;
}

export const TheaterList = ({ theaters, selectedId, onSelect }: TheaterListProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {theaters.map((theater) => {
        const selected = theater.id === selectedId;
        return (
          <button
            key={theater.id}
            onClick={() => onSelect?.(theater)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: selected ? '1px solid #f59e0b' : '1px solid #1f2937',
              background: selected ? 'rgba(245, 158, 11, 0.1)' : '#111827',
              color: '#f5f7fa',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontWeight: 600 }}>{theater.name}</span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              {theater.location} · {theater.formats.join(' / ')} · {theater.capacity} seats
            </span>
          </button>
        );
      })}
    </div>
  );
};
