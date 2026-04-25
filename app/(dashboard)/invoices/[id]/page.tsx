'use client';

import { useState, useEffect, use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Invoice, Teacher, InstituteProfile } from '@/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/common';

type PageProps = { params: Promise<{ id: string }> };

const MODE_LABEL: Record<string, string> = {
  cash: 'Cash', upi: 'UPI', bank_transfer: 'Bank Transfer', cheque: 'Cheque',
};

function formatDate(ts: { toDate?: () => Date } | Date | string | null | undefined): string {
  if (!ts) return 'ΓÇö';
  let d: Date;
  if (typeof ts === 'string') {
    d = new Date(ts);
  } else if (typeof (ts as { toDate?: () => Date }).toDate === 'function') {
    d = (ts as { toDate: () => Date }).toDate();
  } else {
    d = ts as Date;
  }
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function InvoiceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const autoPrint = searchParams.get('print') === '1';

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [institute, setInstitute] = useState<InstituteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [printed, setPrinted] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'invoices', id)).then(snap => {
      if (snap.exists()) setInvoice({ id: snap.id, ...snap.data() } as Invoice);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!teacherId) return;
    getDoc(doc(db, 'teachers', teacherId)).then(snap => {
      if (snap.exists()) setTeacher({ uid: snap.id, ...snap.data() } as Teacher);
    });
    getDoc(doc(db, 'institutes', teacherId)).then(snap => {
      if (snap.exists()) setInstitute(snap.data() as InstituteProfile);
    });
  }, [teacherId]);

  /* Auto-print when ?print=1 */
  useEffect(() => {
    if (!loading && invoice && autoPrint && !printed) {
      setPrinted(true);
      setTimeout(() => window.print(), 700);
    }
  }, [loading, invoice, autoPrint, printed]);

  /* Override page title ΓåÆ invoice number so the browser print header shows
     "INV-2026-00001" instead of "Alogyan Teacher CMS"                    */
  useEffect(() => {
    if (!invoice) return;
    const prev = document.title;
    document.title = invoice.invoiceNo;
    return () => { document.title = prev; };
  }, [invoice]);

  if (loading) return <LoadingSpinner />;
  if (!invoice) return (
    <div className="empty-state">
      <span className="material-symbols-rounded">error</span>
      <h3>Invoice not found</h3>
      <Link href="/invoices" className="btn btn-outline">Back to Invoices</Link>
    </div>
  );

  const paidDate = formatDate(invoice.paidAt as unknown as { toDate?: () => Date });
  const createdDate = formatDate(invoice.createdAt as unknown as { toDate?: () => Date });

  // Prefer company profile data; fall back to teacher doc data
  const instituteName = institute?.name ?? teacher?.instituteName ?? teacher?.name ?? 'Alogyan Academy';
  const logoURL = institute?.logoURL ?? teacher?.logoURL ?? null;
  const gstin = institute?.gstin ?? null;
  const address = institute
    ? [institute.addressLine1, institute.addressLine2, institute.city, institute.state, institute.pin]
      .filter(Boolean).join(', ')
    : null;

  return (
    /* The page root ΓÇö everything screen-side lives here */
    <div>

      {/* ΓöÇΓöÇ Action bar (screen only, hidden on print) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <Link href="/invoices" className="btn btn-outline">
          <span className="material-symbols-rounded icon-sm">arrow_back</span>
          All Invoices
        </Link>
        <button className="btn btn-primary" onClick={() => window.print()}>
          <span className="material-symbols-rounded icon-sm">print</span>
          Print / Download PDF
        </button>
        <Link href={`/fees/${invoice.feeRecordId}`} className="btn btn-ghost">
          <span className="material-symbols-rounded icon-sm">payments</span>
          View Fee Record
        </Link>
        <Link href="/settings" className="btn btn-ghost">
          <span className="material-symbols-rounded icon-sm">tune</span>
          Edit Branding
        </Link>
      </div>

      {/* ΓöÇΓöÇ Invoice sheet ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <div className="invoice-sheet" id="invoice-print-area">

        {/* Body grows to fill page ΓÇö contact bar stays at bottom */}
        <div className="inv-body">

          {/* HEADER: logo left, invoice meta right */}
          <div className="inv-header">

            {/* Brand / logo ΓÇö logo + institute name */}
            <div className="inv-brand">
              {logoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoURL} alt={instituteName} className="inv-logo-img" />
              ) : (
                <div className="inv-logo-mark">
                  <span className="material-symbols-rounded filled" style={{ color: '#fff', fontSize: 26 }}>school</span>
                </div>
              )}
              {/* <div>
                <div className="inv-institute">{instituteName}</div>
              </div> */}
            </div>

            {/* Invoice number + date + status */}
            <div className="inv-meta">
              <div className="inv-no-label">INVOICE</div>
              <div className="inv-no">{invoice.invoiceNo}</div>
              <div className="inv-date">Date: {createdDate}</div>
              <div style={{ marginTop: 10 }}>
                <span className={`inv-status-badge ${invoice.status === 'issued' ? 'paid' : 'cancelled'}`}>
                  {invoice.status === 'issued' ? 'Γ£ô PAID' : 'Γ£ù CANCELLED'}
                </span>
              </div>
            </div>
          </div>

          {/* Gradient divider */}
          <div className="inv-divider" />

          {/* BILLED TO / ISSUED BY */}
          <div className="inv-bill-section">
            <div>
              <div className="inv-section-label">BILLED TO</div>
              <div className="inv-student-name">{invoice.studentName}</div>
              {invoice.batchName && <div className="inv-bill-detail">Email: {invoice.studentEmail}</div>}
              {invoice.batchName && <div className="inv-bill-detail">Phone: {invoice.studentPhone}</div>}
              {invoice.paymentType === 'one-time'
                ? <div className="inv-bill-detail">For: {invoice.oneTimeDescription ?? invoice.month}</div>
                : <div className="inv-bill-detail">Period: {invoice.month}</div>
              }
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="inv-section-label">ISSUED BY</div>
              <div className="inv-student-name" style={{ fontSize: 16 }}>{instituteName ?? 'Teacher'}</div>
              {teacher?.email && <div className="inv-bill-detail">{teacher.email}</div>}
              {teacher?.phone && <div className="inv-bill-detail">{teacher.phone}</div>}
            </div>
          </div>

          <div className="inv-divider" />

          {/* LINE ITEMS TABLE */}
          <table className="inv-table">
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Description</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ fontWeight: 600 }}>
                    {invoice.paymentType === 'one-time'
                      ? (invoice.oneTimeDescription ?? 'One-Time Payment')
                      : invoice.paymentType === 'batch'
                        ? `Batch Fee ΓÇö ${invoice.month}`
                        : `${invoice.month}`
                    }
                  </div>
                  {invoice.batchName && (
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{invoice.batchName}</div>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>1</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>
                  Γé╣{invoice.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="inv-total-row">
                <td colSpan={2} style={{ textAlign: 'right', fontWeight: 700, fontSize: 15, paddingRight: 16 }}>
                  Total Paid
                </td>
                <td style={{ textAlign: 'right', fontWeight: 800, fontSize: 19, color: '#2E7D32' }}>
                  Γé╣{(invoice.paidAmount ?? invoice.amount).toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* PAYMENT DETAILS ΓÇö matches invoice table style */}
          <div className="inv-payment-box">
            <div className="inv-section-label" style={{ marginBottom: 12 }}>PAYMENT DETAILS</div>

            <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--border)' }}>

              {/* Payment Mode */}
              <div style={{
                flex: 1, padding: '12px 16px',
                borderRight: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', color: '#aaa', marginBottom: 5 }}>
                  Payment Mode
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
                  {invoice.status === 'issued'
                    ? (MODE_LABEL[invoice.paymentMode] ?? invoice.paymentMode)
                    : <span style={{ color: '#bbb', fontStyle: 'italic' }}>ΓÇö</span>
                  }
                </div>
              </div>

              {/* Paid On */}
              <div style={{
                flex: 1, padding: '12px 16px',
                borderRight: invoice.status !== 'issued' ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', color: '#aaa', marginBottom: 5 }}>
                  Paid On
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
                  {invoice.status === 'issued' && paidDate
                    ? paidDate
                    : <span style={{ color: '#bbb', fontStyle: 'italic' }}>ΓÇö</span>
                  }
                </div>
              </div>

              {/* Overdue / Cancelled notice ΓÇö only if not issued */}
              {invoice.status !== 'issued' && (
                <div style={{ flex: 1, padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', color: '#aaa', marginBottom: 5 }}>
                    Status
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#C62828', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className="material-symbols-rounded filled" style={{ fontSize: 15 }}>cancel</span>
                    Cancelled
                  </div>
                </div>
              )}
            </div>

            {invoice.notes && (
              <div style={{ marginTop: 12, paddingTop: 11, borderTop: '1px solid #ebebeb', fontSize: 12, color: '#666', display: 'flex', gap: 6 }}>
                <span style={{ fontWeight: 600, color: '#444' }}>Note:</span>
                {invoice.notes}
              </div>
            )}
          </div>

          {/* FOOTER: signature left, thank-you right */}
          <div className="inv-footer">

            {/* Signature area */}
            <div style={{ flex: 1 }}>
              <div className="inv-section-label">AUTHORISED SIGNATURE</div>
              {teacher?.signatureURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={teacher.signatureURL}
                  alt="Signature"
                  className="inv-signature-img"
                />
              ) : (
                /* Blank signature line */
                <div style={{ marginTop: 44, width: 200, borderTop: '1.5px solid #333' }} />
              )}
              {/* Name ΓÇö bold, prominent */}
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginTop: 8, letterSpacing: '0.1px' }}>
                {teacher?.name ?? 'Teacher'}
              </div>
              {/* Designation / title ΓÇö secondary line */}
              {teacher?.title && (
                <div style={{ fontSize: 12, color: '#555', marginTop: 2, fontStyle: 'italic' }}>
                  {teacher.title}
                </div>
              )}
              {/* Institute name if available */}
              {(teacher?.instituteName ?? institute?.name) && (
                <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
                  {teacher?.instituteName ?? institute?.name}
                </div>
              )}
            </div>


            {/* Thank-you note */}
            <div style={{ textAlign: 'right', fontSize: 13, color: '#888' }}>
              <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 18, marginBottom: 6 }}>Thank you!</div>
              <div>This is a computer-generated invoice.</div>
              <div style={{ marginTop: 6, fontSize: 11, fontFamily: 'monospace' }}>
                {invoice.invoiceNo} ┬╖ {createdDate}
              </div>
            </div>
          </div>

        </div>
        {/* END inv-body */}

        {/* CONTACT BAR ΓÇö always at bottom of A4 page */}
        <div className="inv-contact-bar">
          {address && (
            <span className="inv-contact-item">
              <span className="material-symbols-rounded" style={{ fontSize: 13, verticalAlign: 'middle', marginRight: 3 }}>location_on</span>
              {address}
            </span>
          )}
          {(institute?.phone ?? teacher?.phone) && (
            <span className="inv-contact-item">
              <span className="material-symbols-rounded" style={{ fontSize: 13, verticalAlign: 'middle', marginRight: 3 }}>call</span>
              {institute?.phone ?? teacher?.phone}
            </span>
          )}
          {(institute?.email ?? teacher?.email) && (
            <span className="inv-contact-item">
              <span className="material-symbols-rounded" style={{ fontSize: 13, verticalAlign: 'middle', marginRight: 3 }}>mail</span>
              {institute?.email ?? teacher?.email}
            </span>
          )}
          {institute?.website && (
            <span className="inv-contact-item">
              <span className="material-symbols-rounded" style={{ fontSize: 13, verticalAlign: 'middle', marginRight: 3 }}>language</span>
              {institute.website}
            </span>
          )}
          {gstin && (
            <span className="inv-contact-item">
              GSTIN: {gstin}
            </span>
          )}

          {/* Powered by Alogyan ΓÇö always shown on the right */}
          <span className="inv-powered-by">
            <span className="material-symbols-rounded filled" style={{ fontSize: 13, color: '#4F46E5', verticalAlign: 'middle', marginRight: 3 }}>school</span>
            Powered by&nbsp;<strong>Alogyan</strong>
          </span>
        </div>

      </div>
      {/* END invoice-sheet */}

    </div>
  );
}
