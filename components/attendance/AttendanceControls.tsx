export default function AttendanceControls() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Select Batch</label>
          <div className="relative">
            <select className="w-full appearance-none bg-slate-50 border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
              <option>Class 10 Maths</option>
              <option>Class 11 Physics</option>
              <option>Class 12 Advanced Calc</option>
            </select>
            <span className="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Session Date</label>
          <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-rounded text-red-600 text-sm">calendar_today</span>
            21 March 2026
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Session Time</label>
          <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-rounded text-red-600 text-sm">schedule</span>
            Morning Session (9:00 AM - 10:30 AM)
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="px-8 py-3 bg-green-700 text-white rounded-lg font-bold text-sm shadow-md hover:bg-green-800 transition-all flex items-center gap-2">
          <span className="material-symbols-rounded text-lg">play_circle</span>
          Start Session
        </button>
      </div>
    </div>
  );
}
