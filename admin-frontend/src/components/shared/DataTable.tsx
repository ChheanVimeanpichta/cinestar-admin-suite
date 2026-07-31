import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
}

export const DataTable = <T,>({ columns, rows, onRowClick }: DataTableProps<T>) => {
  return (
    <div
      style={{
        overflow: 'auto',
        border: '1px solid #1f2937',
        borderRadius: '0.75rem',
        background: '#111827',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#9ca3af', borderBottom: '1px solid #1f2937' }}>
            {columns.map((column) => (
              <th key={column.key} style={{ padding: '0.75rem 1rem' }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(row)}
              style={{
                color: '#f5f7fa',
                borderBottom: '1px solid #111827',
                cursor: onRowClick ? 'pointer' : 'default',
              }}
            >
              {columns.map((column) => (
                <td key={column.key} style={{ padding: '0.75rem 1rem' }}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No records found</div>
      )}
    </div>
  );
};
