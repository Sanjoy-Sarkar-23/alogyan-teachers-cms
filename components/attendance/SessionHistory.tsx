export default function SessionHistory() {
  return (
    <aside className="w-full lg:w-[280px] space-y-6">
      {/* Last 5 Sessions Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        <div>
          <h4 className="font-bold text-slate-800">Last 5 Sessions</h4>
          <p className="text-[11px] text-slate-500 font-medium">History for Class 10 Maths</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">20 March</p>
              <p className="text-[10px] text-slate-400">26 students</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">92%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">19 March</p>
              <p className="text-[10px] text-slate-400">28 students</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">88%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">18 March</p>
              <p className="text-[10px] text-slate-400">27 students</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">64%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">17 March</p>
              <p className="text-[10px] text-slate-400">28 students</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">96%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">16 March</p>
              <p className="text-[10px] text-slate-400">25 students</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">90%</span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Attendance Trend</p>
          <div className="flex items-end gap-1.5 h-16">
            <div className="flex-1 bg-green-100 rounded-t-sm" style={{ height: '92%' }}></div>
            <div className="flex-1 bg-green-100 rounded-t-sm" style={{ height: '88%' }}></div>
            <div className="flex-1 bg-red-100 rounded-t-sm" style={{ height: '64%' }}></div>
            <div className="flex-1 bg-green-600 rounded-t-sm" style={{ height: '96%' }}></div>
            <div className="flex-1 bg-green-100 rounded-t-sm" style={{ height: '90%' }}></div>
          </div>
        </div>
      </div>
      
      {/* Contextual Hint Card */}
      <div className="bg-red-50 p-5 rounded-xl border-l-4 border-red-600 hidden lg:block">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-rounded text-red-600 text-xl">info</span>
          <h4 className="text-xs font-bold text-slate-800">Pro Tip</h4>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">You can mark all students as present at once using the bulk action menu in the header and then adjust for absentees.</p>
      </div>
    </aside>
  );
}
