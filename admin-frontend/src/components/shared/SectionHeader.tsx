interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-headline-md font-heading text-onSurface">{title}</h2>
        {subtitle && <p className="text-body-md text-onSurfaceVariant mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}