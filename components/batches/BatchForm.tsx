'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LoadingSpinner, PageHeader } from '@/components/common';
import { useBatch, useCreateBatch, useUpdateBatch } from '@/lib/api-hooks';
import type { BatchStatus, DayOfWeek, ScheduleSlot } from '@/types';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const EMPTY_SLOT: ScheduleSlot = { day: 'Mon', startTime: '09:00', durationMins: 60 };

type BatchFormProps = { batchId?: string };

export function BatchForm({ batchId }: BatchFormProps) {
  const router = useRouter();
  const detail = useBatch(batchId || '');
  const createBatch = useCreateBatch();
  const updateBatch = useUpdateBatch(batchId || '');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    subject: '',
    grade: '',
    description: '',
    monthlyFee: '0',
    capacity: '30',
    status: 'upcoming' as BatchStatus,
    startDate: '',
    endDate: '',
    room: '',
    deliveryMode: 'offline' as 'offline' | 'online' | 'hybrid',
    meetingLink: '',
    schedule: [{ ...EMPTY_SLOT }] as ScheduleSlot[],
  });

  useEffect(() => {
    const batch = detail.data?.data;
    if (!batch) return;
    // React Query resolves asynchronously; hydrate the editable draft once the batch arrives.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: batch.name || '',
      subject: batch.subject || '',
      grade: batch.grade || '',
      description: batch.description || '',
      monthlyFee: String(batch.monthlyFee || 0),
      capacity: String(batch.capacity || 0),
      status: batch.status,
      startDate: typeof batch.startDate === 'string' ? batch.startDate : '',
      endDate: typeof batch.endDate === 'string' ? batch.endDate : '',
      room: batch.room || '',
      deliveryMode: batch.deliveryMode || 'offline',
      meetingLink: batch.meetingLink || '',
      schedule:
        Array.isArray(batch.schedule) && batch.schedule.length > 0 && typeof batch.schedule[0] !== 'string'
          ? batch.schedule
          : [{ ...EMPTY_SLOT }],
    });
  }, [detail.data]);

  function setField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateSlot(index: number, field: keyof ScheduleSlot, value: string | number) {
    setForm((current) => ({
      ...current,
      schedule: current.schedule.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [field]: value } : slot
      ),
    }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      setError('Start date cannot be after end date.');
      return;
    }
    const payload = {
      ...form,
      monthlyFee: Number(form.monthlyFee),
      capacity: Number(form.capacity),
    };
    const response = batchId
      ? await updateBatch.mutateAsync(payload)
      : await createBatch.mutateAsync(payload);
    if (!response.success) {
      setError(response.error?.message || 'Unable to save this batch.');
      return;
    }
    const savedId = batchId || (response.data as { id?: string } | undefined)?.id;
    router.push(savedId ? `/batches/${savedId}` : '/batches');
  }

  const saving = createBatch.isPending || updateBatch.isPending;
  if (batchId && detail.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <PageHeader
        title={batchId ? 'Edit batch' : 'Create batch'}
        subtitle={batchId ? 'Update the batch setup and schedule.' : 'Set up a structured class in a few steps.'}
        action={<Link href={batchId ? `/batches/${batchId}` : '/batches'} className="btn btn-outline">Cancel</Link>}
      />
      {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>}

      <form onSubmit={submit} className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.7fr)]">
        <div className="space-y-5">
          <section className="card">
            <div className="mb-5"><h2>Batch information</h2><p className="text-sm">The details students and staff use to identify this batch.</p></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2"><label className="form-label" htmlFor="batchName">Batch name *</label><input id="batchName" className="input" required maxLength={160} placeholder="e.g. Class 10 Mathematics — Evening" value={form.name} onChange={(event) => setField('name', event.target.value)} /></div>
              <div><label className="form-label" htmlFor="subject">Subject *</label><input id="subject" className="input" required maxLength={100} placeholder="Mathematics" value={form.subject} onChange={(event) => setField('subject', event.target.value)} /></div>
              <div><label className="form-label" htmlFor="grade">Grade / level</label><input id="grade" className="input" maxLength={60} placeholder="Class 10, JEE, NEET…" value={form.grade} onChange={(event) => setField('grade', event.target.value)} /></div>
              <div className="md:col-span-2"><label className="form-label" htmlFor="description">Description</label><textarea id="description" className="input" rows={3} maxLength={1000} placeholder="Learning goals or important information" value={form.description} onChange={(event) => setField('description', event.target.value)} /></div>
            </div>
          </section>

          <section className="card">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div><h2>Weekly schedule</h2><p className="text-sm">Add every recurring class slot.</p></div>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setField('schedule', [...form.schedule, { ...EMPTY_SLOT }])}><span className="material-symbols-rounded icon-sm">add</span>Add slot</button>
            </div>
            <div className="space-y-3">
              {form.schedule.map((slot, index) => (
                <div key={`${index}-${slot.day}`} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2 rounded-lg bg-gray-50 p-3">
                  <div><label className="form-label" htmlFor={`day-${index}`}>Day</label><select id={`day-${index}`} className="select" value={slot.day} onChange={(event) => updateSlot(index, 'day', event.target.value)}>{DAYS.map((day) => <option key={day}>{day}</option>)}</select></div>
                  <div><label className="form-label" htmlFor={`time-${index}`}>Start</label><input id={`time-${index}`} className="input" type="time" required value={slot.startTime} onChange={(event) => updateSlot(index, 'startTime', event.target.value)} /></div>
                  <div><label className="form-label" htmlFor={`duration-${index}`}>Minutes</label><input id={`duration-${index}`} className="input" type="number" min={15} max={480} required value={slot.durationMins} onChange={(event) => updateSlot(index, 'durationMins', Number(event.target.value))} /></div>
                  <button type="button" className="btn btn-ghost btn-icon" aria-label={`Remove schedule slot ${index + 1}`} disabled={form.schedule.length === 1} onClick={() => setField('schedule', form.schedule.filter((_, slotIndex) => slotIndex !== index))}><span className="material-symbols-rounded">delete</span></button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="card">
            <h2 className="mb-4">Operations</h2>
            <div className="space-y-4">
              <div><label className="form-label" htmlFor="status">Status</label><select id="status" className="select" value={form.status} onChange={(event) => setField('status', event.target.value as BatchStatus)}><option value="upcoming">Upcoming</option><option value="active">Active</option><option value="completed">Completed</option></select></div>
              <div className="form-row"><div><label className="form-label" htmlFor="startDate">Start date</label><input id="startDate" className="input" type="date" value={form.startDate} onChange={(event) => setField('startDate', event.target.value)} /></div><div><label className="form-label" htmlFor="endDate">End date</label><input id="endDate" className="input" type="date" value={form.endDate} onChange={(event) => setField('endDate', event.target.value)} /></div></div>
              <div className="form-row"><div><label className="form-label" htmlFor="capacity">Capacity</label><input id="capacity" className="input" type="number" min={0} max={10000} value={form.capacity} onChange={(event) => setField('capacity', event.target.value)} /></div><div><label className="form-label" htmlFor="monthlyFee">Monthly fee (₹)</label><input id="monthlyFee" className="input" type="number" min={0} value={form.monthlyFee} onChange={(event) => setField('monthlyFee', event.target.value)} /></div></div>
            </div>
          </section>

          <section className="card">
            <h2 className="mb-4">Class location</h2>
            <div className="space-y-4">
              <div><label className="form-label" htmlFor="deliveryMode">Delivery mode</label><select id="deliveryMode" className="select" value={form.deliveryMode} onChange={(event) => setField('deliveryMode', event.target.value as typeof form.deliveryMode)}><option value="offline">Offline</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select></div>
              {form.deliveryMode !== 'online' && <div><label className="form-label" htmlFor="room">Room / location</label><input id="room" className="input" maxLength={120} placeholder="Room 201" value={form.room} onChange={(event) => setField('room', event.target.value)} /></div>}
              {form.deliveryMode !== 'offline' && <div><label className="form-label" htmlFor="meetingLink">Meeting link</label><input id="meetingLink" className="input" type="url" maxLength={500} placeholder="https://…" value={form.meetingLink} onChange={(event) => setField('meetingLink', event.target.value)} /></div>}
            </div>
          </section>

          <button type="submit" className="btn btn-primary w-full justify-center" disabled={saving}>{saving ? 'Saving batch…' : batchId ? 'Save changes' : 'Create batch'}</button>
        </aside>
      </form>
    </div>
  );
}
