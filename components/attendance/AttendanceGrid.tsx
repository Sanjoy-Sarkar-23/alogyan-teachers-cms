'use client';

import { useState } from 'react';

const studentsData = [
  { id: '1', name: 'Aarav Mehta', phone: '+91 98765-43210', initial: 'AM', bg: 'bg-blue-100', text: 'text-blue-700' },
  { id: '2', name: 'Diya Patel', phone: '+91 98765-43211', initial: 'DP', bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { id: '3', name: 'Rohan Kapoor', phone: '+91 98765-43212', initial: 'RK', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { id: '4', name: 'Sanya Jain', phone: '+91 98765-43213', initial: 'SJ', bg: 'bg-slate-200', text: 'text-slate-600' },
  { id: '5', name: 'Varun Sharma', phone: '+91 98765-43214', initial: 'VS', bg: 'bg-rose-100', text: 'text-rose-700' },
  { id: '6', name: 'Kabir Singh', phone: '+91 98765-43216', initial: 'KS', bg: 'bg-amber-100', text: 'text-amber-700' },
];

export default function AttendanceGrid() {
  const [attendance, setAttendance] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({
    '1': 'PRESENT',
    '3': 'LATE',
    '5': 'PRESENT'
  });

  const markedCount = Object.keys(attendance).length;

  const setStatus = (id: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const markAllPresent = () => {
    const allPresent: Record<string, 'PRESENT'> = {};
    studentsData.forEach(s => allPresent[s.id] = 'PRESENT');
    setAttendance(allPresent);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Class 10 Maths — 21 March 2026</h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 transition-all duration-500 ease-out" 
                style={{ width: `${(markedCount / studentsData.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">
              {markedCount}/{studentsData.length} MARKED
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center self-start sm:self-auto">
          <button onClick={markAllPresent} className="px-4 py-2 mr-0 sm:mr-4 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
            Mark All Present
          </button>
          <button className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors hidden sm:block">
            <span className="material-symbols-rounded text-slate-500">filter_list</span>
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[600px]">
        {studentsData.map(s => {
          const status = attendance[s.id];
          return (
            <div key={s.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col xl:flex-row xl:items-center justify-between group gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center ${s.text} font-bold text-base shadow-inner`}>
                  {s.initial}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.phone}</p>
                </div>
              </div>

              {/* Segmented Controls - optimized for FAT fingers */}
              <div className="flex items-center gap-2 self-start xl:self-auto w-full xl:w-auto bg-slate-50 p-1.5 rounded-full border border-slate-200">
                <button 
                  onClick={() => setStatus(s.id, 'PRESENT')}
                  className={`flex-1 xl:flex-none px-6 py-2 min-h-[44px] rounded-full text-[11px] font-bold border-2 transition-all ${
                    status === 'PRESENT' 
                      ? 'border-green-600 bg-green-600 text-white shadow-md' 
                      : 'border-transparent text-slate-500 hover:bg-white'
                  }`}
                >
                  PRESENT
                </button>
                <button 
                  onClick={() => setStatus(s.id, 'ABSENT')}
                  className={`flex-1 xl:flex-none px-6 py-2 min-h-[44px] rounded-full text-[11px] font-bold border-2 transition-all ${
                    status === 'ABSENT' 
                      ? 'border-red-600 bg-red-600 text-white shadow-md' 
                      : 'border-transparent text-slate-500 hover:bg-white'
                  }`}
                >
                  ABSENT
                </button>
                <button 
                  onClick={() => setStatus(s.id, 'LATE')}
                  className={`flex-1 xl:flex-none px-6 py-2 min-h-[44px] rounded-full text-[11px] font-bold border-2 transition-all ${
                    status === 'LATE' 
                      ? 'border-orange-500 bg-orange-500 text-white shadow-md' 
                      : 'border-transparent text-slate-500 hover:bg-white'
                  }`}
                >
                  LATE
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 bg-slate-50 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-3 sticky bottom-0 border-t border-slate-200 z-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        <button className="px-6 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto text-center">
          Save Draft
        </button>
        <button 
          onClick={() => alert("Attendance successfully tracked!")}
          className="bg-red-600 w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 hover:-translate-y-0.5 transition-all"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}
