'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { api } from '@/lib/api-client';

type VerificationResult = {
  certificateId: string;
  studentName: string;
  programName: string;
  grade: string;
  startDate: string;
  endDate: string;
  totalDuration: string;
  issueDate: string;
  dateOfCompletion: string;
  status: 'valid' | 'revoked';
};

function displayDate(value: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function VerifyCertificatePage() {
  const { token } = useParams<{ token: string }>();
  const [certificate, setCertificate] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function verify() {
      const response = await api.get<VerificationResult>(`/certificates/verify/${token}`);
      if (response.success && response.data) setCertificate(response.data);
      else setError(response.error?.message || 'Certificate not found');
      setLoading(false);
    }
    verify();
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-5">
      <section className="w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-sm md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-primary">
            <span className="material-symbols-rounded" style={{ fontSize: 32 }}>workspace_premium</span>
          </div>
          <h1>Certificate verification</h1>
          <p className="mt-2">Alogyan Learning Platform</p>
        </div>

        {loading && <p className="text-center">Checking certificate…</p>}
        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800">
            <div className="font-semibold">Verification failed</div>
            <div className="mt-1 text-sm">{error}</div>
          </div>
        )}
        {certificate && (
          <>
            <div
              className={`mb-6 rounded-lg border p-4 text-center ${
                certificate.status === 'valid'
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              <div className="font-semibold">
                {certificate.status === 'valid' ? 'Valid certificate' : 'Certificate revoked'}
              </div>
              <div className="mt-1 text-sm">{certificate.certificateId}</div>
            </div>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ['Student', certificate.studentName],
                ['Program', certificate.programName],
                ['Grade', certificate.grade || '—'],
                ['Duration', certificate.totalDuration || '—'],
                ['Issue date', displayDate(certificate.issueDate)],
                ['Completion date', displayDate(certificate.dateOfCompletion)],
                ['Course start', displayDate(certificate.startDate)],
                ['Course end', displayDate(certificate.endDate)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-gray-50 p-3">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
                  <dd className="mt-1 font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </section>
    </main>
  );
}
