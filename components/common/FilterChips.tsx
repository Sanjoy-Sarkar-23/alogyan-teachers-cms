'use client';

import { cn } from '@/lib/utils';

interface FilterChipsProps<T extends string> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
  className?: string;
}

export function FilterChips<T extends string>({ 
  options, 
  value, 
  onChange,
  formatLabel,
  className = '' 
}: FilterChipsProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            'chip transition-colors',
            value === option && 'active-filter bg-primary/10 text-primary border-primary/20'
          )}
        >
          {formatLabel ? formatLabel(option) : option}
        </button>
      ))}
    </div>
  );
}
