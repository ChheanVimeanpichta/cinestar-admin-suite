import { User } from '../../types/user.types';
import { DataTable, Column } from '../shared/DataTable';

export interface UserTableProps {
  users: User[];
  onSelect?: (user: User) => void;
}

export const UserTable = ({ users, onSelect }: UserTableProps) => {
  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', render: (user) => user.name },
    { key: 'email', header: 'Email', render: (user) => user.email },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <span
          style={{
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            background: user.status === 'Active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: user.status === 'Active' ? '#22c55e' : '#ef4444',
          }}
        >
          {user.status}
        </span>
      ),
    },
  ];

  return <DataTable columns={columns} rows={users} onRowClick={onSelect} />;
};
