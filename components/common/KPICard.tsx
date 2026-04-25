'use client';

import { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean | null;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

const colorClasses = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
  danger: 'bg-red-100 text-red-600',
};

export function KPICard({ label, value, icon, trend, trendUp, color = 'default' }: KPICardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${
              trendUp === true ? 'text-green-600' : trendUp === false ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              {trendUp === true && <span className="material-symbols-rounded text-sm">trending_up</span>}
              {trendUp === false && <span className="material-symbols-rounded text-sm">trending_down</span>}
              {trendUp === null && <span className="material-symbols-rounded text-sm">info</span>}
              <span>{trend}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
