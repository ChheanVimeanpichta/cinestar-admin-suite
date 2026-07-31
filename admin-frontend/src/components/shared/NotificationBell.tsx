import { BellIcon } from '../../assets/icons/BellIcon';

export interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

export const NotificationBell = ({ count = 0, onClick }: NotificationBellProps) => {
  return (
    <button
      onClick={onClick}
      aria-label="Notifications"
      style={{
        position: 'relative',
        display: 'flex',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #1f2937',
        background: '#111827',
        color: '#f5f7fa',
        cursor: 'pointer',
      }}
    >
      <BellIcon size={18} />
      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-0.375rem',
            right: '-0.375rem',
            minWidth: '1.125rem',
            height: '1.125rem',
            padding: '0 0.25rem',
            borderRadius: '9999px',
            background: '#f59e0b',
            color: '#05070b',
            fontSize: '0.625rem',
            fontWeight: 700,
            lineHeight: '1.125rem',
            textAlign: 'center',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};
