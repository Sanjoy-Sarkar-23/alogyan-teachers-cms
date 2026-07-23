'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { LoadingSpinner, PageHeader, StatusBadge } from '@/components/common';
import { useBatch, useUpdateBatch } from '@/lib/api-hooks';
import type { ScheduleSlot } from '@/types';

function dateText(value: unknown) {
  if (typeof value !== 'string' || !value) return 'Not set';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

export default function BatchOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const detail = useBatch(id);
  const update = useUpdateBatch(id);
  const batch = detail.data?.data;

  async function archive() {
    if (!window.confirm('Mark this batch as completed? Existing data will remain available.')) return;
    const response = await update.mutateAsync({ status: 'completed' });
    if (response.success) router.refresh();
  }

  if (detail.isLoading) return <LoadingSpinner />;
  if (!batch || detail.isError || detail.data?.success === false) {
    return <div className="p-6"><div role="alert" className="card text-center"><h1>Batch not found</h1><p className="mt-2">It may have been removed or you may not have access.</p><Link href="/batches" className="btn btn-primary mt-4">Back to batches</Link></div></div>;
  }
  const count = batch.studentCount ?? batch.studentIds?.length ?? 0;
  const capacity = batch.capacity || 0;
  const schedule = Array.isArray(batch.schedule) && typeof batch.schedule[0] !== 'string' ? batch.schedule as ScheduleSlot[] : [];

  return (
    <div className="p-6">
      <PageHeader
        title={batch.name}
        subtitle={`${batch.subject}${batch.grade ? ` · ${batch.grade}` : ''}`}
        action={<div className="flex flex-wrap gap-2"><Link href="/batches" className="btn btn-outline">All batches</Link><Link href={`/batches/${id}/edit`} className="btn btn-outline"><span className="material-symbols-rounded icon-sm">edit</span>Edit</Link><Link href={`/batches/${id}/certificates`} className="btn btn-primary">Certificates</Link></div>}
      />

      <div className="mb-5 flex flex-wrap items-center gap-3"><StatusBadge status={batch.status} /><span className="text-sm text-gray-500">{batch.deliveryMode || 'offline'} batch</span></div>
      <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Students', capacity ? `${count} / ${capacity}` : String(count), 'groups'],
          ['Monthly fee', `₹${(batch.monthlyFee || 0).toLocaleString('en-IN')}`, 'payments'],
          ['Starts', dateText(batch.startDate), 'event'],
          ['Ends', dateText(batch.endDate), 'event_available'],
        ].map(([label, value, icon]) => <div key={label} className="card p-4"><span className="material-symbols-rounded mb-3 text-primary">{icon}</span><div className="font-semibold">{value}</div><p className="text-sm">{label}</p></div>)}
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="card">
          <div className="card-header"><div><h2>Weekly schedule</h2><p className="text-sm">Recurring class sessions</p></div><Link href={`/batches/${id}/edit`} className="btn btn-outline btn-sm">Manage</Link></div>
          {schedule.length === 0 ? <p>No structured schedule has been added yet.</p> : <div className="space-y-2">{schedule.map((slot, index) => <div key={`${slot.day}-${index}`} className="flex items-center justify-between rounded-lg bg-gray-50 p-3"><div className="font-medium">{slot.day}</div><div className="text-sm text-gray-600">{slot.startTime} · {slot.durationMins} minutes</div></div>)}</div>}
        </section>
        <aside className="space-y-5">
          <section className="card"><h2 className="mb-4">Location</h2><div className="flex items-start gap-3"><span className="material-symbols-rounded text-primary">{batch.deliveryMode === 'online' ? 'videocam' : 'location_on'}</span><div><div className="font-medium">{batch.deliveryMode === 'online' ? 'Online class' : batch.room || 'Location not set'}</div>{batch.meetingLink && <a className="text-sm text-primary underline" href={batch.meetingLink} target="_blank" rel="noreferrer">Open meeting link</a>}</div></div></section>
          {batch.description && <section className="card"><h2 className="mb-2">About this batch</h2><p>{batch.description}</p></section>}
          {batch.status !== 'completed' && <section className="card border-red-100"><h2>Complete batch</h2><p className="my-2 text-sm">Archive it from active operations without deleting records.</p><button className="btn btn-outline btn-sm" disabled={update.isPending} onClick={archive}>Mark completed</button></section>}
        </aside>
      </div>
    </div>
  );
}
