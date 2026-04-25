'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  href?: string;
  actionLabel?: string;
  className?: string;
}

export function EmptyState({ 
  icon = 'inbox', 
  title, 
  description, 
  action, 
  href,
  actionLabel = 'Get Started',
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] text-center p-8 ${className}`}>
      <span className="material-symbols-rounded text-6xl text-muted-foreground/50 mb-4">
        {icon}
      </span>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-4 max-w-md">{description}</p>}
      {action || (href && (
        <Link href={href} className="btn btn-primary btn-sm">
          {actionLabel}
        </Link>
      ))}
    </div>
  );
}
