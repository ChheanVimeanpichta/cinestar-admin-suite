import { IconProps } from './OverviewIcon';

export const ShowtimeIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M8 2v4M16 2v4M3 9h18" />
    <path d="M9 13h2M13 13h2M9 17h2M13 17h2" />
  </svg>
);
