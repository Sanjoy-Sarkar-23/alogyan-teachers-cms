'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

import { LoadingSpinner, PageHeader } from '@/components/common';
import Certificate from '@/components/Certificate';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { db } from '@/lib/firebase';
import {
  exportCertificatePdf,
  exportCertificatePng,
  exportCertificatesPdf,
  exportCertificatesZip,
  type CertificateExportData,
} from '@/lib/certificate-export';
import type { Batch, Student } from '@/types';

type Recipient = { studentId: string; grade: string };
type BulkResult = {
  created: Array<{
    certificateId: string;
    studentId: string;
    studentName: string;
    programName: string;
    grade: string;
    startDate: string;
    endDate: string;
    totalDuration: string;
    issueDate: string;
    dateOfCompletion: string;
    verifyUrl: string;
  }>;
  skipped: Array<{ studentId: string; studentName: string; reason: string }>;
  createdCount: number;
  skippedCount: number;
  replayed?: boolean;
};

const today = new Date().toISOString().slice(0, 10);

export default function BatchCertificatesPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BulkResult | null>(null);
  const [issued, setIssued] = useState<CertificateExportData[]>([]);
  const [issuedLoading, setIssuedLoading] = useState(true);
  const [issuedSelected, setIssuedSelected] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    programName: '',
    issueDate: today,
    startDate: '',
    endDate: '',
    dateOfCompletion: '',
    totalDuration: '',
    defaultGrade: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [batchSnapshot, studentSnapshot] = await Promise.all([
          getDoc(doc(db, 'batches', id)),
          getDocs(query(collection(db, 'students'), where('batchIds', 'array-contains', id))),
        ]);
        if (!batchSnapshot.exists() || batchSnapshot.data().teacherId !== user?.uid) {
          setError('Batch not found or you do not have access to it.');
          return;
        }
        const loadedBatch = { id: batchSnapshot.id, ...batchSnapshot.data() } as Batch;
        const loadedStudents = studentSnapshot.docs
          .map((student) => ({ id: student.id, ...student.data() } as Student))
          .filter((student) => student.teacherId === user?.uid && student.status !== 'inactive')
          .sort((a, b) => a.name.localeCompare(b.name));
        setBatch(loadedBatch);
        setStudents(loadedStudents);
        setSelected(new Set(loadedStudents.map((student) => student.id)));
        setForm((current) => ({
          ...current,
          programName: loadedBatch.name || loadedBatch.subject || '',
          defaultGrade: loadedBatch.grade || '',
        }));
      } catch (loadError) {
        console.error(loadError);
        setError('Could not load this batch. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authLoading, id, user]);

  useEffect(() => {
    if (!user || !batch) return;
    let active = true;
    async function loadIssued() {
      setIssuedLoading(true);
      const response = await api.get<CertificateExportData[]>('/certificates', { batchId: id });
      if (active && response.success && response.data) {
        setIssued(response.data);
        setIssuedSelected(new Set(response.data.map((certificate) => certificate.certificateId)));
      }
      if (active) setIssuedLoading(false);
    }
    loadIssued();
    return () => {
      active = false;
    };
  }, [batch, id, user]);

  const visibleStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.phone?.includes(term)
    );
  }, [search, students]);
  const previewStudent = students.find((student) => selected.has(student.id));
  const selectedIssuedCertificates = issued.filter((certificate) =>
    issuedSelected.has(certificate.certificateId)
  );

  function updateForm(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleStudent(studentId: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelected((current) => {
      const next = new Set(current);
      const allVisibleSelected = visibleStudents.every((student) => next.has(student.id));
      visibleStudents.forEach((student) => {
        if (allVisibleSelected) next.delete(student.id);
        else next.add(student.id);
      });
      return next;
    });
  }

  async function issueCertificates(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setResult(null);
    if (selected.size === 0) {
      setError('Select at least one student.');
      return;
    }
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      setError('Start date cannot be after end date.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post<BulkResult>('/certificates/bulk', {
        batchId: id,
        ...form,
        idempotencyKey,
        recipients: students
          .filter((student) => selected.has(student.id))
          .map((student): Recipient => ({
            studentId: student.id,
            grade: grades[student.id]?.trim() || form.defaultGrade,
          })),
      });
      if (!response.success || !response.data) {
        setError(response.error?.message || 'Certificate creation failed.');
        return;
      }
      setResult(response.data);
      setIssued((current) => {
        const merged = new Map(current.map((certificate) => [certificate.certificateId, certificate]));
        response.data!.created.forEach((certificate) => merged.set(certificate.certificateId, certificate));
        return [...merged.values()];
      });
      setIssuedSelected((current) => {
        const next = new Set(current);
        response.data!.created.forEach((certificate) => next.add(certificate.certificateId));
        return next;
      });
      setIdempotencyKey(crypto.randomUUID());
    } catch (submitError) {
      console.error(submitError);
      setError('Certificate creation failed. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function runExport(label: string, action: () => Promise<void>) {
    setError('');
    setExporting(label);
    try {
      await action();
    } catch (exportError) {
      console.error(exportError);
      setError('Export failed. Please retry with a smaller group.');
    } finally {
      setExporting('');
    }
  }

  if (loading || authLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <PageHeader
        title="Bulk certificates"
        subtitle={batch ? `${batch.name} · ${students.length} eligible students` : 'Batch certificates'}
        action={
          <Link href="/batches" className="btn btn-outline">
            Back to batches
          </Link>
        }
      />

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {!batch ? null : (
        <>
        <form onSubmit={issueCertificates} className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          <section className="card overflow-hidden">
            <div className="border-b p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Choose recipients</h2>
                  <p className="text-sm">{selected.size} of {students.length} selected</p>
                </div>
                <input
                  className="input"
                  style={{ maxWidth: 260 }}
                  type="search"
                  placeholder="Search students"
                  aria-label="Search students"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th style={{ width: 48 }}>
                      <input
                        type="checkbox"
                        aria-label="Select all visible students"
                        checked={visibleStudents.length > 0 && visibleStudents.every((student) => selected.has(student.id))}
                        onChange={toggleAllVisible}
                      />
                    </th>
                    <th>Student</th>
                    <th style={{ minWidth: 180 }}>Individual grade (optional)</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select ${student.name}`}
                          checked={selected.has(student.id)}
                          onChange={() => toggleStudent(student.id)}
                        />
                      </td>
                      <td>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email || student.phone}</div>
                      </td>
                      <td>
                        <input
                          className="input"
                          aria-label={`Grade for ${student.name}`}
                          placeholder={form.defaultGrade || 'e.g. A+'}
                          value={grades[student.id] || ''}
                          onChange={(event) =>
                            setGrades((current) => ({ ...current, [student.id]: event.target.value }))
                          }
                          disabled={!selected.has(student.id)}
                          maxLength={40}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleStudents.length === 0 && (
                <p className="p-6 text-center text-sm">No matching students found.</p>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="card p-4">
              <h2 className="mb-4 text-base font-semibold">Certificate details</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label" htmlFor="programName">Program / course name *</label>
                  <input
                    id="programName"
                    className="input"
                    required
                    maxLength={160}
                    value={form.programName}
                    onChange={(event) => updateForm('programName', event.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div>
                    <label className="form-label" htmlFor="issueDate">Issue date *</label>
                    <input
                      id="issueDate"
                      className="input"
                      type="date"
                      required
                      value={form.issueDate}
                      onChange={(event) => updateForm('issueDate', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="completionDate">Completion date</label>
                    <input
                      id="completionDate"
                      className="input"
                      type="date"
                      value={form.dateOfCompletion}
                      onChange={(event) => updateForm('dateOfCompletion', event.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <label className="form-label" htmlFor="startDate">Start date</label>
                    <input
                      id="startDate"
                      className="input"
                      type="date"
                      value={form.startDate}
                      onChange={(event) => updateForm('startDate', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="endDate">End date</label>
                    <input
                      id="endDate"
                      className="input"
                      type="date"
                      value={form.endDate}
                      onChange={(event) => updateForm('endDate', event.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label" htmlFor="duration">Duration</label>
                  <input
                    id="duration"
                    className="input"
                    maxLength={80}
                    placeholder="e.g. 120 hours or 6 months"
                    value={form.totalDuration}
                    onChange={(event) => updateForm('totalDuration', event.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="defaultGrade">Default grade</label>
                  <input
                    id="defaultGrade"
                    className="input"
                    maxLength={40}
                    placeholder="Applied unless overridden per student"
                    value={form.defaultGrade}
                    onChange={(event) => updateForm('defaultGrade', event.target.value)}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-gray-50 p-3 text-sm text-muted-foreground">
                Existing active certificates for this batch are safely skipped. Each new certificate gets a unique number and verification URL.
              </div>

              <button type="submit" className="btn btn-primary mt-4 w-full justify-center" disabled={submitting || selected.size === 0}>
                <span className="material-symbols-rounded icon-sm">workspace_premium</span>
                {submitting ? 'Issuing certificates…' : `Issue ${selected.size} certificate${selected.size === 1 ? '' : 's'}`}
              </button>
            </section>

            {previewStudent && (
              <section className="card p-4">
                <div className="mb-3">
                  <h2 className="text-base font-semibold">Certificate preview</h2>
                  <p className="text-sm">Previewing the first selected student.</p>
                </div>
                <div className="overflow-hidden rounded-lg border">
                  <Certificate
                    certificateId="ALP-CERT-PREVIEW"
                    studentName={previewStudent.name}
                    programName={form.programName || batch.name}
                    grade={grades[previewStudent.id] || form.defaultGrade}
                    startDate={form.startDate}
                    endDate={form.endDate}
                    totalDuration={form.totalDuration}
                    issueDate={form.issueDate}
                    dateOfCompletion={form.dateOfCompletion}
                    verifyUrl="/certificates/verify/preview"
                  />
                </div>
              </section>
            )}

            {result && (
              <section className="card p-4" aria-live="polite">
                <h2 className="text-base font-semibold text-green-700">Bulk issue complete</h2>
                <p className="mt-1 text-sm">
                  {result.createdCount} created · {result.skippedCount} skipped
                  {result.replayed ? ' · previous result restored' : ''}
                </p>
                {result.created.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm justify-center"
                      disabled={!!exporting}
                      onClick={() =>
                        runExport('pdf', () => exportCertificatesPdf(result.created as CertificateExportData[]))
                      }
                    >
                      <span className="material-symbols-rounded icon-sm">picture_as_pdf</span>
                      {exporting === 'pdf' ? 'Building…' : 'Bulk PDF'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm justify-center"
                      disabled={!!exporting}
                      onClick={() =>
                        runExport('png-zip', () =>
                          exportCertificatesZip(result.created as CertificateExportData[], 'png')
                        )
                      }
                    >
                      <span className="material-symbols-rounded icon-sm">folder_zip</span>
                      {exporting === 'png-zip' ? 'Building…' : 'PNG ZIP'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm justify-center"
                      disabled={!!exporting}
                      onClick={() =>
                        runExport('pdf-zip', () =>
                          exportCertificatesZip(result.created as CertificateExportData[], 'pdf')
                        )
                      }
                    >
                      <span className="material-symbols-rounded icon-sm">folder_zip</span>
                      {exporting === 'pdf-zip' ? 'Building…' : 'PDF ZIP'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm justify-center"
                      disabled={!!exporting}
                      onClick={() =>
                        runExport('complete-zip', () =>
                          exportCertificatesZip(result.created as CertificateExportData[], 'both')
                        )
                      }
                    >
                      <span className="material-symbols-rounded icon-sm">archive</span>
                      {exporting === 'complete-zip' ? 'Building…' : 'PNG + PDF ZIP'}
                    </button>
                  </div>
                )}
                {result.created.length > 0 && (
                  <div className="mt-3 max-h-64 space-y-2 overflow-auto">
                    {result.created.map((certificate) => (
                      <div key={certificate.certificateId} className="rounded-md border p-2 text-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-medium">{certificate.studentName}</div>
                            <a className="text-primary underline" href={certificate.verifyUrl} target="_blank" rel="noreferrer">
                              {certificate.certificateId}
                            </a>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon"
                              aria-label={`Download PDF for ${certificate.studentName}`}
                              disabled={!!exporting}
                              onClick={() => runExport(certificate.certificateId, () => exportCertificatePdf(certificate))}
                            >
                              <span className="material-symbols-rounded icon-sm">picture_as_pdf</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon"
                              aria-label={`Download PNG for ${certificate.studentName}`}
                              disabled={!!exporting}
                              onClick={() => runExport(certificate.certificateId, () => exportCertificatePng(certificate))}
                            >
                              <span className="material-symbols-rounded icon-sm">image</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </aside>
        </form>
        <section className="card mt-6 p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
            <div>
              <h2 className="text-base font-semibold">Issued certificates</h2>
              <p className="text-sm">
                {issuedLoading
                  ? 'Loading saved certificates…'
                  : `${issued.length} saved · ${selectedIssuedCertificates.length} selected`}
              </p>
            </div>
            {issued.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={!!exporting || selectedIssuedCertificates.length === 0}
                  onClick={() =>
                    runExport('saved-pdf', () => exportCertificatesPdf(selectedIssuedCertificates))
                  }
                >
                  <span className="material-symbols-rounded icon-sm">picture_as_pdf</span>
                  Bulk PDF
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={!!exporting || selectedIssuedCertificates.length === 0}
                  onClick={() =>
                    runExport('saved-png-zip', () =>
                      exportCertificatesZip(selectedIssuedCertificates, 'png')
                    )
                  }
                >
                  PNG ZIP
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={!!exporting || selectedIssuedCertificates.length === 0}
                  onClick={() =>
                    runExport('saved-pdf-zip', () =>
                      exportCertificatesZip(selectedIssuedCertificates, 'pdf')
                    )
                  }
                >
                  PDF ZIP
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={!!exporting || selectedIssuedCertificates.length === 0}
                  onClick={() =>
                    runExport('saved-both-zip', () =>
                      exportCertificatesZip(selectedIssuedCertificates, 'both')
                    )
                  }
                >
                  PNG + PDF ZIP
                </button>
              </div>
            )}
          </div>

          {issuedLoading ? (
            <div className="p-6"><LoadingSpinner /></div>
          ) : issued.length === 0 ? (
            <p className="p-6 text-center text-sm">No certificates have been issued for this batch yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Select all issued certificates"
                        checked={issuedSelected.size === issued.length}
                        onChange={() =>
                          setIssuedSelected(
                            issuedSelected.size === issued.length
                              ? new Set()
                              : new Set(issued.map((certificate) => certificate.certificateId))
                          )
                        }
                      />
                    </th>
                    <th>Student</th>
                    <th>Certificate</th>
                    <th>Issued</th>
                    <th>Downloads</th>
                  </tr>
                </thead>
                <tbody>
                  {issued.map((certificate) => (
                    <tr key={certificate.certificateId}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select certificate for ${certificate.studentName}`}
                          checked={issuedSelected.has(certificate.certificateId)}
                          onChange={() =>
                            setIssuedSelected((current) => {
                              const next = new Set(current);
                              if (next.has(certificate.certificateId)) next.delete(certificate.certificateId);
                              else next.add(certificate.certificateId);
                              return next;
                            })
                          }
                        />
                      </td>
                      <td><div className="font-medium">{certificate.studentName}</div><div className="text-sm text-gray-500">{certificate.programName}</div></td>
                      <td><a className="text-primary underline" href={certificate.verifyUrl} target="_blank" rel="noreferrer">{certificate.certificateId}</a></td>
                      <td>{certificate.issueDate || '—'}</td>
                      <td>
                        <div className="flex gap-1">
                          <button type="button" className="btn btn-outline btn-sm" disabled={!!exporting} onClick={() => runExport(`saved-${certificate.certificateId}`, () => exportCertificatePdf(certificate))}>PDF</button>
                          <button type="button" className="btn btn-outline btn-sm" disabled={!!exporting} onClick={() => runExport(`saved-${certificate.certificateId}`, () => exportCertificatePng(certificate))}>PNG</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </>
      )}
    </div>
  );
}
