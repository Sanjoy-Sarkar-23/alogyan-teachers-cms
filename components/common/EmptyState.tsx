'use client';

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  href?: string;
  actionLabel?: string;
}

export function EmptyState({ icon, title, description, action, href, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <span className="material-symbols-rounded text-3xl text-muted-foreground">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">{description}</p>
      {action}
      {!action && href && actionLabel && (
        <Link href={href} className="btn btn-primary btn-sm">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
