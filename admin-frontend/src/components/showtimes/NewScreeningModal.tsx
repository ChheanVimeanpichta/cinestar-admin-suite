import { FormEvent, useState } from 'react';
import { Movie } from '../../types/movie.types';
import { NewScreeningInput, Theater } from '../../types/showtime.types';

export interface NewScreeningModalProps {
  open: boolean;
  movies: Movie[];
  theaters: Theater[];
  onClose: () => void;
  onSubmit: (input: NewScreeningInput) => void;
}

export const NewScreeningModal = ({ open, movies, theaters, onClose, onSubmit }: NewScreeningModalProps) => {
  const [form, setForm] = useState<NewScreeningInput>({
    movieId: '',
    theaterId: '',
    date: '',
    time: '',
    format: '',
  });

  if (!open) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(form);
    setForm({ movieId: '', theaterId: '', date: '', time: '', format: '' });
  };

  const set = (key: keyof NewScreeningInput) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const selectedTheater = theaters.find((theater) => theater.id === form.theaterId);

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #1f2937',
    background: '#05070b',
    color: '#f5f7fa',
    outline: 'none',
  } as const;

  const labelStyle = { display: 'block', marginBottom: '0.375rem', fontSize: '0.75rem', color: '#9ca3af' } as const;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 7, 11, 0.75)',
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '30rem',
          margin: '1rem',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          background: '#111827',
          border: '1px solid #1f2937',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f5f7fa' }}>New Screening</h2>

        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>
            <span style={labelStyle}>Movie</span>
            <select value={form.movieId} onChange={(event) => set('movieId')(event.target.value)} style={inputStyle} required>
              <option value="">Select a movie…</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span style={labelStyle}>Theater</span>
            <select value={form.theaterId} onChange={(event) => set('theaterId')(event.target.value)} style={inputStyle} required>
              <option value="">Select a theater…</option>
              {theaters.map((theater) => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </select>
          </label>

          {selectedTheater && (
            <label>
              <span style={labelStyle}>Format</span>
              <select value={form.format} onChange={(event) => set('format')(event.target.value)} style={inputStyle} required>
                <option value="">Select a format…</option>
                {selectedTheater.formats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <label>
              <span style={labelStyle}>Date</span>
              <input type="date" value={form.date} onChange={(event) => set('date')(event.target.value)} style={inputStyle} required />
            </label>
            <label>
              <span style={labelStyle}>Time</span>
              <input type="time" value={form.time} onChange={(event) => set('time')(event.target.value)} style={inputStyle} required />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #374151',
              background: 'transparent',
              color: '#f5f7fa',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#f59e0b',
              color: '#05070b',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Schedule Screening
          </button>
        </div>
      </form>
    </div>
  );
};
