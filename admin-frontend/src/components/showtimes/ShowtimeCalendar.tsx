import { Showtime } from '../../types/showtime.types';

export interface ShowtimeCalendarProps {
  showtimes: Showtime[];
  weekStart?: Date;
  onSelectShowtime?: (showtime: Showtime) => void;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ShowtimeCalendar = ({ showtimes, weekStart = new Date(), onSelectShowtime }: ShowtimeCalendarProps) => {
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });

  const byDay = (day: Date) =>
    showtimes.filter((showtime) => {
      const showtimeDate = new Date(showtime.startTime);
      return showtimeDate.toDateString() === day.toDateString();
    });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(8rem, 1fr))',
        gap: '0.5rem',
        overflowX: 'auto',
      }}
    >
      {days.map((day) => {
        const dayShowtimes = byDay(day);
        const isToday = day.toDateString() === new Date().toDateString();
        return (
          <div
            key={day.toISOString()}
            style={{
              minHeight: '10rem',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: isToday ? '1px solid #f59e0b' : '1px solid #1f2937',
              background: '#111827',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: isToday ? '#f59e0b' : '#9ca3af' }}>
              {DAY_LABELS[day.getDay()]} {day.getDate()}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
              {dayShowtimes.map((showtime) => (
                <button
                  key={showtime.id}
                  onClick={() => onSelectShowtime?.(showtime)}
                  style={{
                    padding: '0.375rem 0.5rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#f5f7fa',
                    fontSize: '0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ color: '#f59e0b' }}>{new Date(showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>{' '}
                  {showtime.theater} · {showtime.format}
                </button>
              ))}
              {dayShowtimes.length === 0 && (
                <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>No screenings</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
