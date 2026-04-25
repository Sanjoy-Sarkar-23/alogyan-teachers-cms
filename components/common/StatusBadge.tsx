'use client';

const STATUS_STYLES: Record<string, string> = {
  active:   'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  alumni:   'bg-blue-100 text-blue-700',
  paid:     'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  overdue:  'bg-red-100 text-red-700',
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  );
}
