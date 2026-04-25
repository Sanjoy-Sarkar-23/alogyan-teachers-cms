'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Student } from '@/types';
import Link from 'next/link';
import { LoadingSpinner, StatusBadge, PageHeader, EmptyState, SearchInput, FilterChips, Dialog } from '@/components/common';
import { getInitials, formatDate } from '@/lib/utils';
import { toastSuccess, toastError } from '@/lib/toast';

type FilterStatus = 'all' | 'active' | 'inactive' | 'alumni';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
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

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teacherId) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await addDoc(collection(db, 'students'), {
        teacherId,
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string || '',
        parentName: formData.get('parentName') as string || '',
        parentPhone: formData.get('parentPhone') as string || '',
        batchIds: [],
        status: 'active',
        enrollmentDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setDialogOpen(false);
      form.reset();
      fetchStudents();
      toastSuccess('Student added successfully!');
    } catch (error) {
      toastError(`Failed to add student: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) return <LoadingSpinner />;

  const filterOptions: FilterStatus[] = ['all', 'active', 'inactive', 'alumni'];

  return (
    <div className="p-6">
      <PageHeader 
        title="Students" 
        subtitle={`${students.length} total students`}
        action={
          <button className="btn btn-primary" onClick={() => setDialogOpen(true)}>
            <span className="material-symbols-rounded">person_add</span>
            Add Student
          </button>
        }
      />

      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name, phone, or ID..."
            />
          </div>
          <FilterChips
            options={filterOptions}
            value={filter}
            onChange={setFilter}
            formatLabel={(f) => f === 'all' ? 'All Status' : f.charAt(0).toUpperCase() + f.slice(1)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState 
          icon="group_off"
          title={students.length === 0 ? "No students enrolled" : "No results found"}
          description={students.length === 0 ? "Add your first student to get started." : "Try a different search or filter."}
          action={students.length === 0 ? (
            <button className="btn btn-primary" onClick={() => setDialogOpen(true)}>Add Student</button>
          ) : undefined}
        />
      ) : (
        <>
          <div className="hidden md:block">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Info</th>
                    <th>ID</th>
                    <th>Batch</th>
                    <th>Joining Date</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar avatar-md">{getInitials(s.name)}</div>
                          <div>
                            <p className="font-semibold">{s.name}</p>
                            {s.email && <p className="text-sm text-muted-foreground">{s.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="text-muted-foreground">#{s.id.slice(0, 6).toUpperCase()}</td>
                      <td>
                        <span className="chip">{s.batchIds?.length ? `${s.batchIds.length} Batch(es)` : 'Unassigned'}</span>
                      </td>
                      <td className="text-muted-foreground">{formatDate(s.enrollmentDate)}</td>
                      <td className="font-medium">{s.phone}</td>
                      <td><StatusBadge status={s.status} /></td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
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
          </div>

          <div className="md:hidden space-y-4">
            {filtered.map(s => (
              <div key={s.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar avatar-md">{getInitials(s.name)}</div>
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.batchIds?.length ? `${s.batchIds.length} Batch(es)` : 'Unassigned'}</p>
                    </div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{s.phone}</p>
                  <a 
                    href={`https://wa.me/${s.phone.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-success btn-sm"
                  >
                    <span className="material-symbols-rounded icon-sm">chat</span>
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Add Student"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDialogOpen(false)}>Cancel</button>
            <button type="submit" form="add-student-form" className="btn btn-primary">Add Student</button>
          </>
        }
      >
        <form id="add-student-form" onSubmit={handleAddStudent} className="space-y-4">
          <div>
            <h4 className="font-semibold mb-3">Student Details</h4>
            <div className="space-y-3">
              <div>
                <label className="form-label">Full Name *</label>
                <input required name="name" type="text" className="input w-full" placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label className="form-label">Phone Number *</label>
                <input required name="phone" type="tel" className="input w-full" placeholder="(XXX) XXX-XXXX" />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input name="email" type="email" className="input w-full" placeholder="rahul@example.com" />
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div>
            <h4 className="font-semibold mb-3">Parent Contact</h4>
            <div className="space-y-3">
              <div>
                <label className="form-label">Parent Name</label>
                <input name="parentName" type="text" className="input w-full" placeholder="e.g. Mr. Sharma" />
              </div>
              <div>
                <label className="form-label">Parent Phone</label>
                <input name="parentPhone" type="tel" className="input w-full" placeholder="(XXX) XXX-XXXX" />
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
