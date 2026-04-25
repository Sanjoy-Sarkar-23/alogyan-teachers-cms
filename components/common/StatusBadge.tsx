'use client';

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

const variantClasses: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  alumni: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
  upcoming: 'bg-yellow-100 text-yellow-800',
};

export function StatusBadge({ status, variant, className = '' }: StatusBadgeProps) {
  const variantClass = variant 
    ? {
        default: 'bg-primary/10 text-primary',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        neutral: 'bg-gray-100 text-gray-800',
      }[variant]
    : variantClasses[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClass, className)}>
      {status}
    </span>
  );
}
