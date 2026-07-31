import { SearchIcon } from '../../assets/icons/SearchIcon';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({ value, onChange, placeholder = 'Search…' }: SearchInputProps) => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '24rem' }}>
      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', display: 'flex' }}>
        <SearchIcon size={16} />
      </span>
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem 1rem 0.5rem 2.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #1f2937',
          background: '#111827',
          color: '#f5f7fa',
          outline: 'none',
        }}
      />
    </div>
  );
};
