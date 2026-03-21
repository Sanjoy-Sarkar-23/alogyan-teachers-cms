export default function AttendanceSummaryStrip() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full">
        <div className="w-2 h-2 rounded-full bg-green-700"></div>
        <span className="text-xs font-bold text-green-700">Present: 18</span>
      </div>
      <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-full">
        <div className="w-2 h-2 rounded-full bg-red-600"></div>
        <span className="text-xs font-bold text-red-600">Absent: 4</span>
      </div>
      <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full">
        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
        <span className="text-xs font-bold text-slate-600">Not Marked: 6</span>
      </div>
    </div>
  );
}
