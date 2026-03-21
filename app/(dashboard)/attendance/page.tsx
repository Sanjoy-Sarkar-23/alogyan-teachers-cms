import React from 'react';
import AttendanceHeader from '@/components/attendance/AttendanceHeader';
import AttendanceControls from '@/components/attendance/AttendanceControls';
import AttendanceSummaryStrip from '@/components/attendance/AttendanceSummaryStrip';
import AttendanceGrid from '@/components/attendance/AttendanceGrid';
import SessionHistory from '@/components/attendance/SessionHistory';

export default function AttendancePage() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pb-32">
      {/* Central Canvas */}
      <div className="flex-1 min-w-0 space-y-8">
        <AttendanceHeader />
        <AttendanceControls />
        <AttendanceSummaryStrip />
        <AttendanceGrid />
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[280px] flex-shrink-0">
        <SessionHistory />
      </div>
    </div>
  );
}
