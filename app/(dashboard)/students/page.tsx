'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Student } from '@/types';
import Link from 'next/link';

type FilterStatus = 'all' | 'active' | 'inactive' | 'alumni';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState<FilterStatus>('all');
  const [teacherId, setTeacherId] = useState<string | null>(null);
  
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setTeacherId(u?.uid ?? null);
    });
    return unsub;
  }, []);

  const fetchStudents = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'students'),
        where('teacherId', '==', teacherId),
        orderBy('name')
      );
      const snap = await getDocs(q);
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Student)));
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.phone.includes(search);
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: 'badge-success', inactive: 'badge-neutral', alumni: 'badge-warning'
    };
    return <span className={`badge ${map[status] ?? 'badge-neutral'}`}>{status}</span>;
  };

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teacherId) {
      alert('You must be logged in to add a student.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const phone = formData.get('phone') as string;

    try {
      await addDoc(collection(db, 'students'), {
        teacherId,
        name: formData.get('name') as string,
        phone: phone,
        email: formData.get('email') as string || '',
        parentName: formData.get('parentName') as string || '',
        parentPhone: formData.get('parentPhone') as string || '',
        batchIds: [],
        status: 'active',
        enrollmentDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setDrawerOpen(false);
      form.reset();
      fetchStudents();
      alert(`Student ${formData.get('name')} added successfully!`);
    } catch (error: any) {
      console.error('Error adding student:', error);
      alert('Failed to add student: ' + error.message);
    }
  };

  if (loading) return (
    <div className="empty-state">
      <span className="material-symbols-rounded" style={{ fontSize: 36, animation: 'spin 1s linear infinite' }}>autorenew</span>
    </div>
  );

  return (
    <div>
      {/* HEADER */}
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1>Students</h1>
          <p>{students.length} total students</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 16 }} onClick={() => setDrawerOpen(true)}>
          <span className="material-symbols-rounded">person_add</span>
          Add Student
        </button>
      </div>

      {/* SEARCH AND FILTER HEADERS */}
      <div className="card" style={{ marginBottom: 24, padding: '16px' }}>
        <div className="flex gap-4 items-center flex-wrap">
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <span className="material-symbols-rounded icon-sm text-disabled" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>search</span>
            <input
              className="input"
              style={{ paddingLeft: 40, width: '100%' }}
              placeholder="Search by name, phone, or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive', 'alumni'] as FilterStatus[]).map(f => (
              <button
                key={f}
                className={`chip ${filter === f ? 'active-filter' : ''}`}
                style={filter === f ? { background: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-light)' } : { cursor: 'pointer' }}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All Status' : `Status: ${f.charAt(0).toUpperCase() + f.slice(1)}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BODY */}
      {filtered.length === 0 ? (
        <div className="card empty-state" style={{ padding: '64px 24px' }}>
          <span className="material-symbols-rounded" style={{ fontSize: 64, color: 'var(--text-disabled)' }}>group_off</span>
          <h3 style={{ fontSize: 20, color: 'var(--text-primary)', marginTop: 16 }}>
            {students.length === 0 ? 'You haven\'t enrolled any students yet.' : 'No results found'}
          </h3>
          <p style={{ fontSize: 16, marginTop: 8 }}>
            {students.length === 0 ? 'Let\'s get started!' : 'Try a different search or filter.'}
          </p>
          {students.length === 0 && (
            <div style={{ marginTop: 24, textAlign: 'center' }}>
               <span className="material-symbols-rounded text-disabled" style={{ display: 'block', marginBottom: 8 }}>arrow_downward</span>
               <button className="btn btn-primary btn-lg" onClick={() => setDrawerOpen(true)}>Add Student</button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="table-wrapper desktop-only">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>ID</th>
                  <th>Batch</th>
                  <th>Joining Date</th>
                  <th>Phone No.</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-md">{initials(s.name)}</div>
                        <div>
                          <div className="font-semibold text-base">{s.name}</div>
                          {s.email && <div className="text-sm text-secondary">{s.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary">#{s.id.slice(0, 6).toUpperCase()}</td>
                    <td>
                      <span className="chip">{s.batchIds?.length ? `${s.batchIds.length} Batch(es)` : 'Unassigned'}</span>
                    </td>
                    <td className="text-secondary">
                      {s.enrollmentDate ? new Date(s.enrollmentDate.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="font-medium">{s.phone}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                       <div className="flex items-center justify-end gap-2">
                        <Link href={`/students/${s.id}`} className="btn btn-ghost btn-icon">
                          <span className="material-symbols-rounded icon-sm">visibility</span>
                        </Link>
                        <button className="btn btn-ghost btn-icon">
                          <span className="material-symbols-rounded icon-sm">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD LIST */}
          <div className="mobile-only flex flex-col gap-4">
            {filtered.map(s => (
              <div key={s.id} className="card p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="avatar avatar-md">{initials(s.name)}</div>
                    <div>
                      <div className="font-semibold text-base">{s.name}</div>
                      <div className="text-sm text-secondary">{s.batchIds?.length ? `${s.batchIds.length} Batch(es)` : 'Unassigned'}</div>
                    </div>
                  </div>
                  {statusBadge(s.status)}
                </div>
                <div className="divider" style={{ margin: 0 }} />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-secondary font-medium">
                    {s.phone}
                  </div>
                  <a href={`https://wa.me/${s.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="btn btn-success btn-sm">
                    <span className="material-symbols-rounded icon-sm">chat</span>
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SLIDE-OVER DRAWER FOR ADD STUDENT */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 style={{ fontSize: 20 }}>Add Student</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setDrawerOpen(false)}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
            
            <div className="drawer-body">
              <form id="add-student-form" onSubmit={handleAddStudent} className="flex flex-col gap-6">
                <div>
                  <h3 className="mb-4" style={{ fontSize: 16 }}>Student Details</h3>
                  <div className="form-group mb-4">
                    <label className="form-label">Full Name *</label>
                    <input required name="name" type="text" className="input" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label">Phone Number *</label>
                    <input required name="phone" type="tel" className="input" placeholder="(XXX) XXX-XXXX" />
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label">Email Address</label>
                    <input name="email" type="email" className="input" placeholder="rahul@example.com" />
                  </div>
                </div>

                <div className="divider" style={{ margin: 0 }} />

                <div>
                  <h3 className="mb-4" style={{ fontSize: 16 }}>Parent Contact</h3>
                  <div className="form-group mb-4">
                    <label className="form-label">Parent Name</label>
                    <input name="parentName" type="text" className="input" placeholder="e.g. Mr. Sharma" />
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label">Parent Phone</label>
                    <input name="parentPhone" type="tel" className="input" placeholder="(XXX) XXX-XXXX" />
                  </div>
                </div>
              </form>
            </div>

            <div className="drawer-footer">
              <button className="btn btn-ghost" onClick={() => setDrawerOpen(false)}>Cancel</button>
              <button type="submit" form="add-student-form" className="btn btn-primary" style={{ padding: '10px 24px' }}>Add Student</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        
        .desktop-only { display: block; }
        .mobile-only { display: none; }
        
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
        }

        /* DRAWER STYLES */
        .drawer-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease;
        }
        .drawer-panel {
          background: var(--bg-default);
          width: 100%;
          max-width: 450px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 16px rgba(0,0,0,0.1);
          animation: slideInRight 0.3s ease forwards;
        }
        .drawer-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drawer-body {
          padding: 24px;
          flex: 1;
          overflow-y: auto;
        }
        .drawer-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-hover);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
