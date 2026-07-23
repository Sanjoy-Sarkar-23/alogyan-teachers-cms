'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { EmptyState, LoadingSpinner, PageHeader, StatusBadge } from '@/components/common';
import { useAuth } from '@/contexts/AuthContext';
import { useBatchStats, useInfiniteBatches } from '@/lib/api-hooks';
import type { Batch, ScheduleSlot } from '@/types';

type ViewMode = 'grid' | 'table';

function scheduleText(schedule: Batch['schedule']) {
  if (!Array.isArray(schedule) || schedule.length === 0) return 'Schedule not set';
  if (typeof schedule[0] === 'string') return (schedule as unknown as string[]).join(', ');
  return (schedule as ScheduleSlot[])
    .slice(0, 2)
    .map((slot) => `${slot.day} ${slot.startTime}`)
    .join(' · ');
}

function BatchActions({ batch }: { batch: Batch }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/batches/${batch.id}`} className="btn btn-primary btn-sm">Open</Link>
      <Link href={`/batches/${batch.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
      <Link href={`/batches/${batch.id}/certificates`} className="btn btn-outline btn-sm">Certificates</Link>
    </div>
  );
}

export default function BatchesPage() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState('all');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const filters = { status: status as 'all' | 'active' | 'upcoming' | 'completed', subject, grade, search, pageSize: 12 };
  const batchesQuery = useInfiniteBatches(filters, !authLoading && !!user);
  const statsQuery = useBatchStats(!authLoading && !!user);
  const batches = useMemo(
    () => batchesQuery.data?.pages.flatMap((page) => page.data || []) || [],
    [batchesQuery.data]
  );
  const subjects = [...new Set(batches.map((batch) => batch.subject).filter(Boolean))].sort();
  const grades = [...new Set(batches.map((batch) => batch.grade).filter(Boolean))].sort() as string[];
  const stats = statsQuery.data?.data;

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Batches"
        subtitle="Organize classes, schedules and student capacity from one place."
        action={
          <Link href="/batches/new" className="btn btn-primary">
            <span className="material-symbols-rounded icon-sm">add</span>
            Create batch
          </Link>
        }
      />

      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Batch summary">
        {[
          ['All batches', stats?.total ?? '—', 'layers', 'bg-red-50 text-red-700'],
          ['Active', stats?.active ?? '—', 'play_circle', 'bg-green-50 text-green-700'],
          ['Upcoming', stats?.upcoming ?? '—', 'event_upcoming', 'bg-amber-50 text-amber-700'],
          ['Completed', stats?.completed ?? '—', 'task_alt', 'bg-slate-100 text-slate-700'],
        ].map(([label, value, icon, color]) => (
          <div key={label} className="card flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <span className="material-symbols-rounded">{icon}</span>
            </div>
            <div>
              <div className="text-xl font-bold">{value}</div>
              <p className="text-sm">{label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="card mb-5 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <form onSubmit={submitSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-rounded absolute left-3 top-2.5 text-lg text-gray-400">search</span>
              <input
                className="input"
                style={{ paddingLeft: 40 }}
                type="search"
                placeholder="Search batch name"
                aria-label="Search batch name"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>
            <button className="btn btn-outline" type="submit">Search</button>
          </form>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
            <select className="select" aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <select className="select" aria-label="Filter by subject" value={subject} onChange={(event) => setSubject(event.target.value)}>
              <option value="">All subjects</option>
              {subjects.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className="select" aria-label="Filter by grade" value={grade} onChange={(event) => setGrade(event.target.value)}>
              <option value="">All grades</option>
              {grades.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="flex rounded-lg border p-1" aria-label="Choose batch view">
            {(['grid', 'table'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`btn btn-sm ${view === mode ? 'btn-primary' : 'btn-ghost'}`}
                aria-pressed={view === mode}
                onClick={() => setView(mode)}
              >
                <span className="material-symbols-rounded icon-sm">{mode === 'grid' ? 'grid_view' : 'view_list'}</span>
                <span className="sr-only">{mode} view</span>
              </button>
            ))}
          </div>
        </div>
        {(search || status !== 'all' || subject || grade) && (
          <button
            type="button"
            className="btn btn-ghost btn-sm mt-3"
            onClick={() => {
              setSearch('');
              setSearchInput('');
              setStatus('all');
              setSubject('');
              setGrade('');
            }}
          >
            Clear filters
          </button>
        )}
      </section>

      {authLoading || (user && batchesQuery.isLoading) ? (
        <LoadingSpinner />
      ) : !user ? (
        <div role="alert" className="card p-6 text-center">
          <h2>Sign in required</h2>
          <p className="mt-1">Please sign in to view your batches.</p>
          <Link href="/login" className="btn btn-primary mt-4">Go to sign in</Link>
        </div>
      ) : batchesQuery.isError ? (
        <div role="alert" className="card p-6 text-center">
          <h2>Could not load batches</h2>
          <p className="mt-1">Please check your connection and try again.</p>
          <button className="btn btn-primary mt-4" onClick={() => batchesQuery.refetch()}>Retry</button>
        </div>
      ) : batches.length === 0 ? (
        <EmptyState
          icon="class"
          title={search || status !== 'all' || subject || grade ? 'No matching batches' : 'No batches yet'}
          description={search || status !== 'all' || subject || grade ? 'Try changing your filters.' : 'Create your first batch to start organizing classes.'}
          href="/batches/new"
          actionLabel="Create batch"
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {batches.map((batch) => {
            const count = batch.studentCount ?? batch.studentIds?.length ?? 0;
            const capacity = batch.capacity || 0;
            const fill = capacity ? Math.min(100, Math.round((count / capacity) * 100)) : 0;
            return (
              <article key={batch.id} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">{batch.subject}</span>
                      {batch.grade && <span className="text-xs text-gray-500">{batch.grade}</span>}
                    </div>
                    <Link href={`/batches/${batch.id}`} className="text-lg font-semibold hover:text-primary">{batch.name}</Link>
                  </div>
                  <StatusBadge status={batch.status} />
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><span className="material-symbols-rounded text-lg">schedule</span>{scheduleText(batch.schedule)}</div>
                  <div className="flex items-center gap-2"><span className="material-symbols-rounded text-lg">location_on</span>{batch.deliveryMode === 'online' ? 'Online' : batch.room || 'Location not set'}</div>
                  <div className="flex items-center gap-2"><span className="material-symbols-rounded text-lg">payments</span>₹{(batch.monthlyFee || 0).toLocaleString('en-IN')} / month</div>
                </div>
                <div className="my-4">
                  <div className="mb-1 flex justify-between text-xs text-gray-500"><span>{count} students</span><span>{capacity ? `${capacity} capacity` : 'No capacity limit'}</span></div>
                  {capacity > 0 && <div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary" style={{ width: `${fill}%` }} /></div>}
                </div>
                <BatchActions batch={batch} />
              </article>
            );
          })}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Batch</th><th>Status</th><th>Schedule</th><th>Students</th><th>Fee</th><th>Actions</th></tr></thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td><Link className="font-semibold hover:text-primary" href={`/batches/${batch.id}`}>{batch.name}</Link><div className="text-sm text-gray-500">{batch.subject} {batch.grade ? `· ${batch.grade}` : ''}</div></td>
                  <td><StatusBadge status={batch.status} /></td>
                  <td>{scheduleText(batch.schedule)}</td>
                  <td>{batch.studentCount ?? batch.studentIds?.length ?? 0}{batch.capacity ? ` / ${batch.capacity}` : ''}</td>
                  <td>₹{(batch.monthlyFee || 0).toLocaleString('en-IN')}</td>
                  <td><BatchActions batch={batch} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {batchesQuery.hasNextPage && (
        <div className="mt-6 text-center">
          <button className="btn btn-outline" disabled={batchesQuery.isFetchingNextPage} onClick={() => batchesQuery.fetchNextPage()}>
            {batchesQuery.isFetchingNextPage ? 'Loading…' : 'Load more batches'}
          </button>
        </div>
      )}
    </div>
  );
}
