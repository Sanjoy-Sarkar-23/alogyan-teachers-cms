'use client';
import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const data = [
  { name: 'JAN', collected: 128, pending: 24, overdue: 16 },
  { name: 'FEB', collected: 112, pending: 48, overdue: 32 },
  { name: 'MAR', collected: 80, pending: 80, overdue: 48 },
];

export default function FeeCollectionSummary() {
  return (
    <div className="card" style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center justify-between mb-8">
        <h4 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>Fee Collection Summary</h4>
        <div className="flex" style={{ gap: 12 }}>
          <span className="badge badge-success" style={{ textTransform: 'uppercase', fontSize: 10, padding: '4px 12px', fontWeight: 800 }}>Collected</span>
          <span className="badge badge-warning" style={{ textTransform: 'uppercase', fontSize: 10, padding: '4px 12px', fontWeight: 800 }}>Pending</span>
          <span className="badge badge-danger" style={{ textTransform: 'uppercase', fontSize: 10, padding: '4px 12px', fontWeight: 800 }}>Overdue</span>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 260, minWidth: 0, width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="99%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--text-disabled)' }} dy={10} />
            <Tooltip 
              cursor={{ fill: 'var(--bg-hover)' }}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--shadow-md)', fontWeight: 700, fontSize: 13 }}
            />
            <Bar dataKey="collected" name="Collected" stackId="a" fill="#10b981" barSize={32} radius={[0, 0, 4, 4]} />
            <Bar dataKey="pending" name="Pending" stackId="a" fill="#ffa726" barSize={32} />
            <Bar dataKey="overdue" name="Overdue" stackId="a" fill="#ef5350" barSize={32} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
