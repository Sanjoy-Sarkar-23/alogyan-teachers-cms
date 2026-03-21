'use client';
import React from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const data = [
  { name: 'Week 1', batchA: 80, batchB: 60 },
  { name: 'Week 2', batchA: 40, batchB: 90 },
  { name: 'Week 3', batchA: 60, batchB: 40 },
  { name: 'Week 4', batchA: 100, batchB: 95 },
  { name: 'Week 5', batchA: 95, batchB: 85 },
];

export default function MonthlyAttendanceTrend() {
  return (
    <div className="card" style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center justify-between mb-8">
        <h4 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>Monthly Attendance Trend</h4>
      </div>
      <div style={{ flex: 1, minHeight: 260, minWidth: 0, width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="99%" height={260}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--text-disabled)' }} dy={10} />
            <Tooltip 
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--shadow-md)', fontWeight: 700, fontSize: 13 }}
            />
            <Line type="monotone" dataKey="batchA" name="Batch A" stroke="var(--primary)" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="batchB" name="Batch B" stroke="#3b82f6" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
