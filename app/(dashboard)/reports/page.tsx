'use client';

import React from 'react';
import TopStatsRow from '@/components/reports/TopStatsRow';
import MonthlyAttendanceTrend from '@/components/reports/MonthlyAttendanceTrend';
import AttendanceByBatch from '@/components/reports/AttendanceByBatch';
import FeeCollectionSummary from '@/components/reports/FeeCollectionSummary';
import StudentPerformance from '@/components/reports/StudentPerformance';
import FeeDefaultersList from '@/components/reports/FeeDefaultersList';

export default function ReportsPage() {
  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--text-primary)' }}>
            Reports & Analytics
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, fontWeight: 500, marginTop: 4 }}>
            Get insights into attendance, fees, and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card flex items-center gap-2" style={{ padding: '10px 16px', borderRadius: 12, cursor: 'pointer', background: 'var(--bg-surface)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>calendar_month</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>March 2026</span>
          </div>
          <button className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 12, boxShadow: '0 4px 14px rgba(211, 47, 47, 0.2)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>download</span>
            <span style={{ fontWeight: 700 }}>Export Report</span>
          </button>
        </div>
      </div>

      <TopStatsRow />

      {/* MAIN CHARTS GRID */}
      <div className="grid grid-2" style={{ gap: 32, marginTop: 32 }}>
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-8">
          <MonthlyAttendanceTrend />
          <AttendanceByBatch />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-8">
          <FeeCollectionSummary />
          <StudentPerformance />
        </div>
      </div>

      <FeeDefaultersList />
    </div>
  );
}
