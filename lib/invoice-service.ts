import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Invoice, PaymentMode, InvoiceStatus } from '@/types';

// ─── Counter ────────────────────────────────────────────────────────────────
// Each teacher gets their own counter document so invoice numbers stay tidy.
// Counter doc path: meta/invoiceCounter_{teacherId}

async function generateInvoiceNo(teacherId: string): Promise<string> {
  const counterRef = doc(db, 'meta', `invoiceCounter_${teacherId}`);
  const year = new Date().getFullYear();

  const newCount = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? (snap.data().count as number) : 0;
    const next = current + 1;
    tx.set(counterRef, { count: next, updatedAt: serverTimestamp() }, { merge: true });
    return next;
  });

  return `INV-${year}-${String(newCount).padStart(5, '0')}`;
}

// ─── Create Invoice ──────────────────────────────────────────────────────────

export interface CreateInvoicePayload {
  teacherId: string;
  feeRecordId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  batchId: string;
  batchName: string;
  month: string;          // e.g. "April 2026"
  amount: number;
  paidAmount: number;
  paymentMode: PaymentMode;
  paymentType?: string;
  oneTimeDescription?: string;
  paidAt: Date;
  notes?: string;
  teacherEmail?: string;
  teacherPhone?: string;
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<{ id: string; invoiceNo: string }> {
  const invoiceNo = await generateInvoiceNo(payload.teacherId);

  // Firestore rejects undefined values — strip them before writing
  const raw = {
    ...payload,
    invoiceNo,
    status:    'issued' as InvoiceStatus,
    paidAt:    payload.paidAt,
    createdAt: serverTimestamp(),
  };

  const clean = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== undefined && v !== '')
  );

  const docRef = await addDoc(collection(db, 'invoices'), clean);

  return { id: docRef.id, invoiceNo };
}

// ─── Fetch Invoice ───────────────────────────────────────────────────────────

export async function getInvoice(invoiceId: string): Promise<Invoice | null> {
  const snap = await getDoc(doc(db, 'invoices', invoiceId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Invoice;
}

// ─── List Invoices for teacher (client-side usage) ───────────────────────────
// Used by the invoices list page via Firestore query directly.
// Export the collection path for convenience.
export const INVOICES_COLLECTION = 'invoices';
