export default function AttendanceHeader() {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 leading-none">Attendance</h2>
        <p className="text-slate-500 mt-2">Mark and track student attendance for your daily sessions.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end mr-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Date</span>
          <span className="text-sm font-bold text-slate-800">21 March 2026</span>
        </div>
        <button className="px-5 py-2.5 rounded-lg border border-slate-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors">
          View History
        </button>
      </div>
    </div>
  );
}
