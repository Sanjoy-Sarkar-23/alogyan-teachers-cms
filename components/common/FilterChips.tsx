'use client';

interface FilterChipsProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatLabel?: (option: T) => string;
  className?: string;
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  formatLabel,
  className = '',
}: FilterChipsProps<T>) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            value === opt
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {formatLabel ? formatLabel(opt) : opt}
        </button>
      ))}
    </div>
  );
}
