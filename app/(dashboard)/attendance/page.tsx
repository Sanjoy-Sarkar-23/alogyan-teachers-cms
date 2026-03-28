'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Batch, Student } from '@/types';
import { ChevronLeft, ChevronRight, Calendar, Users, Check, X, Clock, Download, Filter } from 'lucide-react';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday';

interface DayAttendance {
  date: string;
  records: Record<string, AttendanceStatus>;
  markedAt?: string;
}

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string; bg: string; icon: any }> = {
  present: { label: 'Present', color: 'text-green-600', bg: 'bg-green-100', icon: Check },
  absent: { label: 'Absent', color: 'text-red-600', bg: 'bg-red-100', icon: X },
  late: { label: 'Late', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock },
  holiday: { label: 'Holiday', color: 'text-blue-600', bg: 'bg-blue-100', icon: Calendar },
};

export default function AttendancePage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, DayAttendance>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mark' | 'calendar'>('mark');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const getDaysArray = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    if (!teacherId) return;
    const q = query(collection(db, 'batches'), where('teacherId', '==', teacherId));
    getDocs(q).then(snap => {
      const batchList = snap.docs.map(d => ({ id: d.id, ...d.data() } as Batch));
      setBatches(batchList.filter(b => b.status === 'active'));
    });
  }, [teacherId]);

  const loadBatchData = useCallback(async () => {
    if (!selectedBatch || !teacherId) return;
    setLoading(true);
    
    const batch = batches.find(b => b.id === selectedBatch);
    if (!batch?.studentIds?.length) {
      setStudents([]);
      setLoading(false);
      return;
    }

    const studentQ = query(collection(db, 'students'), where('teacherId', '==', teacherId));
    const studentSnap = await getDocs(studentQ);
    const allStudents = studentSnap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
    const batchStudents = allStudents.filter(s => batch.studentIds!.includes(s.id));
    setStudents(batchStudents);

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const attQ = query(
      collection(db, 'attendance'),
      where('batchId', '==', selectedBatch),
      where('date', '>=', startStr),
      where('date', '<=', endStr)
    );
    const attSnap = await getDocs(attQ);
    const attData: Record<string, DayAttendance> = {};
    attSnap.forEach(d => {
      const data = d.data();
      attData[data.date] = {
        date: data.date,
        records: data.records,
        markedAt: data.createdAt?.toDate?.()?.toISOString(),
      };
    });
    setAttendanceData(attData);
    setLoading(false);
  }, [selectedBatch, teacherId, currentMonth, currentYear, batches]);

  useEffect(() => { loadBatchData(); }, [loadBatchData]);

  const getMonthStats = () => {
    const stats: Record<string, { present: number; absent: number; late: number; total: number }> = {};
    
    students.forEach(s => {
      stats[s.id] = { present: 0, absent: 0, late: 0, total: 0 };
    });

    Object.values(attendanceData).forEach(day => {
      students.forEach(s => {
        const status = day.records[s.id];
        if (status) {
          stats[s.id].total++;
          if (status === 'present') stats[s.id].present++;
          else if (status === 'absent') stats[s.id].absent++;
          else if (status === 'late') stats[s.id].late++;
        }
      });
    });

    return stats;
  };

  const getDayAttendance = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceData[dateStr];
  };

  const getDayStatus = (day: number) => {
    const att = getDayAttendance(day);
    if (!att) return 'unmarked';
    const statuses = Object.values(att.records);
    if (statuses.every(s => s === 'present')) return 'complete';
    if (statuses.some(s => s === 'absent')) return 'partial';
    return 'partial';
  };

  const [markings, setMarkings] = useState<Record<string, AttendanceStatus>>({});
  const today = new Date().toISOString().split('T')[0];

  const initMarkings = () => {
    const init: Record<string, AttendanceStatus> = {};
    students.forEach(s => { init[s.id] = 'present'; });
    setMarkings(init);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay(dateStr);
    
    const existing = attendanceData[dateStr]?.records;
    if (existing) {
      setMarkings(existing);
    } else {
      initMarkings();
    }
  };

  const saveAttendance = async () => {
    if (!selectedBatch || !selectedDay || !teacherId) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'attendance', `${selectedBatch}_${selectedDay}`);
      await setDoc(docRef, {
        teacherId,
        batchId: selectedBatch,
        date: selectedDay,
        records: markings,
        createdAt: serverTimestamp(),
      });
      setAttendanceData(prev => ({
        ...prev,
        [selectedDay]: { date: selectedDay, records: markings, markedAt: new Date().toISOString() }
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const markStudent = (studentId: string, status: AttendanceStatus) => {
    setMarkings(prev => ({ ...prev, [studentId]: status }));
  };

  const getAttendancePercentage = (studentId: string) => {
    const stats = getMonthStats()[studentId];
    if (!stats || stats.total === 0) return 0;
    return Math.round(((stats.present + stats.late * 0.5) / stats.total) * 100);
  };

  const stats = getMonthStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track and manage student attendance for your batches</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Month Navigator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold text-lg min-w-[160px] text-center">{monthName}</span>
              <button
                onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Batch Selector */}
            <select
              value={selectedBatch}
              onChange={e => { setSelectedBatch(e.target.value); setSelectedDay(null); }}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a batch...</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.studentIds?.length || 0} students)
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('mark')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'mark' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mark
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>

        {!selectedBatch ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Batch</h3>
            <p className="text-gray-500">Choose a batch from the dropdown above to view or mark attendance</p>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading attendance data...</p>
          </div>
        ) : viewMode === 'calendar' ? (
          /* Calendar View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-sm font-semibold text-gray-600">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {getDaysArray().map((day, idx) => (
                <div
                  key={idx}
                  className={`min-h-[100px] border-b border-r border-gray-100 p-2 ${
                    day ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                  }`}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${
                        day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()
                          ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                          : 'text-gray-700'
                      }`}>
                        {day}
                      </div>
                      {getDayStatus(day) !== 'unmarked' && (
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          getDayStatus(day) === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {getDayStatus(day) === 'complete' ? 'Complete' : 'Partial'}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Mark Attendance View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student List */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {selectedDay ? `Marking: ${selectedDay}` : 'Select a date to mark attendance'}
                </h3>
                {selectedDay && (
                  <div className="flex gap-2">
                    <button
                      onClick={initMarkings}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>

              {students.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No students in this batch</p>
                </div>
              ) : !selectedDay ? (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">Click a date on the calendar to mark attendance</p>
                  <button
                    onClick={() => handleDayClick(new Date().getDate())}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Mark Today's Attendance
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {students.map(student => (
                    <div key={student.id} className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.phone}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {stats[student.id]?.total || 0} marked this month
                      </div>
                      <div className="flex gap-1">
                        {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map(status => {
                          const config = STATUS_CONFIG[status];
                          const Icon = config.icon;
                          return (
                            <button
                              key={status}
                              onClick={() => markStudent(student.id, status)}
                              className={`p-2 rounded-lg transition-all ${
                                markings[student.id] === status
                                  ? `${config.bg} ${config.color}`
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                              title={config.label}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedDay && students.length > 0 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {Object.values(markings).filter(s => s === 'present').length} Present, {' '}
                    {Object.values(markings).filter(s => s === 'absent').length} Absent, {' '}
                    {Object.values(markings).filter(s => s === 'late').length} Late
                  </div>
                  <button
                    onClick={saveAttendance}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Attendance'}
                  </button>
                </div>
              )}
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Monthly Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Students</span>
                    <span className="font-semibold">{students.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Days Marked</span>
                    <span className="font-semibold">{Object.keys(attendanceData).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Present Rate</span>
                    <span className="font-semibold text-green-600">
                      {students.length > 0 
                        ? Math.round(students.reduce((sum, s) => sum + getAttendancePercentage(s.id), 0) / students.length)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Attendance This Month</h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {students.map(student => {
                    const pct = getAttendancePercentage(student.id);
                    return (
                      <div key={student.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{student.name}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${
                          pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
