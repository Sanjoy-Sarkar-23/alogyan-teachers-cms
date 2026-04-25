'use client';

type KPIColor = 'default' | 'success' | 'warning' | 'danger';

const KPI_COLOR_STYLES: Record<KPIColor, string> = {
  default: 'text-foreground',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger:  'text-red-600',
};

interface KPICardProps {
  label: string;
  value: string | number;
  color?: KPIColor;
}

export function KPICard({ label, value, color = 'default' }: KPICardProps) {
  const colorClass = KPI_COLOR_STYLES[color];
  return (
    <div className="card p-4">
      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}
