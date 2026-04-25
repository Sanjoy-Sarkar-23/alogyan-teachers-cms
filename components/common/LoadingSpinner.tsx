'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-4xl',
  lg: 'text-6xl',
};

export function LoadingSpinner({ size = 'md', message, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] gap-4 ${className}`}>
      <span className={`material-symbols-rounded animate-spin ${sizeClasses[size]}`}>
        autorenew
      </span>
      {message && <p className="text-muted-foreground">{message}</p>}
    </div>
  );
}
