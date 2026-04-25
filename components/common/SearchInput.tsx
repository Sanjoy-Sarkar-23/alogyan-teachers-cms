'use client';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search…' }: SearchInputProps) {
  return (
    <div className="relative">
      <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
        search
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input w-full pl-9"
      />
    </div>
  );
}
