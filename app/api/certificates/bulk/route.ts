import crypto from 'crypto';
import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import { NextRequest } from 'next/server';

import { errorResponse, successResponse, verifyAuth } from '@/lib/api-response';
import { adminDb } from '@/lib/firebase-admin';

const MAX_CERTIFICATES_PER_REQUEST = 200;
const CERTIFICATE_WRITE_CHUNK_SIZE = 130;
const QUERY_CHUNK_SIZE = 30;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type CertificateRecipient = {
  studentId: string;
  grade?: string;
};

type BulkCertificateBody = {
  batchId?: string;
  programName?: string;
  issueDate?: string;
  startDate?: string;
  endDate?: string;
  dateOfCompletion?: string;
  totalDuration?: string;
  defaultGrade?: string;
  recipients?: CertificateRecipient[];
  idempotencyKey?: string;
};

function clean(value: unknown, maxLength = 160) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isValidDate(value: string, required = false) {
  if (!value) return !required;
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value);
}

function tokenFor(certificateId: string, secret: string) {
  const nonce = crypto.randomBytes(24).toString('hex');
  return crypto
    .createHmac('sha256', secret)
    .update(`${certificateId}:${nonce}`)
    .digest('hex');
}

function chunks<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  );
}

export async function POST(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const body = (await req.json()) as BulkCertificateBody;
    const batchId = clean(body.batchId, 100);
    const programName = clean(body.programName);
    const issueDate = clean(body.issueDate, 10);
    const startDate = clean(body.startDate, 10);
    const endDate = clean(body.endDate, 10);
    const dateOfCompletion = clean(body.dateOfCompletion, 10);
    const totalDuration = clean(body.totalDuration, 80);
    const defaultGrade = clean(body.defaultGrade, 40);
    const idempotencyKey = clean(body.idempotencyKey, 100);
    const recipients = Array.isArray(body.recipients) ? body.recipients : [];

    if (!batchId || !programName || !issueDate || recipients.length === 0) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Batch, program, issue date, and at least one student are required',
        400
      );
    }
    if (
      !isValidDate(issueDate, true) ||
      !isValidDate(startDate) ||
      !isValidDate(endDate) ||
      !isValidDate(dateOfCompletion)
    ) {
      return errorResponse('VALIDATION_ERROR', 'Dates must be valid YYYY-MM-DD values', 400);
    }
    if (startDate && endDate && startDate > endDate) {
      return errorResponse('VALIDATION_ERROR', 'Start date cannot be after end date', 400);
    }
    if (recipients.length > MAX_CERTIFICATES_PER_REQUEST) {
      return errorResponse(
        'BULK_LIMIT_EXCEEDED',
        `A maximum of ${MAX_CERTIFICATES_PER_REQUEST} certificates can be created at once`,
        400
      );
    }

    const uniqueRecipients = new Map<string, CertificateRecipient>();
    for (const recipient of recipients) {
      const studentId = clean(recipient?.studentId, 100);
      if (studentId) uniqueRecipients.set(studentId, { studentId, grade: clean(recipient.grade, 40) });
    }
    if (uniqueRecipients.size !== recipients.length) {
      return errorResponse('VALIDATION_ERROR', 'Recipients contain missing or duplicate student IDs', 400);
    }

    const secret = process.env.CERT_SECRET_KEY;
    if (!secret ) {
      console.error('CERT_SECRET_KEY is missing or shorter than 32 characters');
      return errorResponse('CERTIFICATE_CONFIG_ERROR', 'Certificate service is not configured', 503);
    }

    const batchRef = adminDb.collection('batches').doc(batchId);
    const batchDoc = await batchRef.get();
    if (!batchDoc.exists || batchDoc.data()?.teacherId !== teacherId) {
      return errorResponse('BATCH_NOT_FOUND', 'Batch not found', 404);
    }

    const studentIds = [...uniqueRecipients.keys()];
    const studentSnapshots = await Promise.all(
      chunks(studentIds, QUERY_CHUNK_SIZE).map((ids) =>
        adminDb.collection('students').where(FieldPath.documentId(), 'in', ids).get()
      )
    );
    const students = new Map(
      studentSnapshots.flatMap((snapshot) => snapshot.docs.map((doc) => [doc.id, doc.data()] as const))
    );
    const invalidStudents = studentIds.filter((studentId) => {
      const student = students.get(studentId);
      return (
        !student ||
        student.teacherId !== teacherId ||
        !Array.isArray(student.batchIds) ||
        !student.batchIds.includes(batchId)
      );
    });
    if (invalidStudents.length > 0) {
      return errorResponse(
        'INVALID_RECIPIENTS',
        'Some students do not belong to this batch',
        400,
        { studentIds: invalidStudents }
      );
    }

    const requestRef = idempotencyKey
      ? adminDb
          .collection('certificate_requests')
          .doc(crypto.createHash('sha256').update(`${teacherId}:${idempotencyKey}`).digest('hex'))
      : null;
    if (requestRef) {
      const previous = await requestRef.get();
      if (previous.exists) {
        return successResponse({ ...previous.data(), replayed: true });
      }
    }

    const issuanceRefs = studentIds.map((studentId) =>
      adminDb
        .collection('certificate_issuances')
        .doc(crypto.createHash('sha256').update(`${teacherId}:${batchId}:${studentId}`).digest('hex'))
    );
    const [existing, ...issuanceDocs] = await Promise.all([
      adminDb.collection('certificates').where('batchId', '==', batchId).get(),
      ...issuanceRefs.map((ref) => ref.get()),
    ]);
    const existingStudentIds = new Set(
      existing.docs
        .filter((doc) => doc.data().teacherId === teacherId && !doc.data().isRevoked)
        .map((doc) => doc.data().studentId as string)
    );
    issuanceDocs.forEach((doc, index) => {
      if (doc.exists) existingStudentIds.add(studentIds[index]);
    });
    const issuableStudentIds = studentIds.filter((studentId) => !existingStudentIds.has(studentId));
    if (issuableStudentIds.length === 0) {
      return errorResponse('CERTIFICATES_ALREADY_EXIST', 'All selected students already have certificates', 409);
    }

    const year = Number(issueDate.slice(0, 4));
    const counterRef = adminDb.collection('counters').doc(`certificate_${year}`);
    const firstSequence = await adminDb.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      const current = counterDoc.exists ? Number(counterDoc.data()?.current ?? 0) : 0;
      const next = current + issuableStudentIds.length;
      transaction.set(
        counterRef,
        { current: next, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
      return current + 1;
    });

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin).replace(/\/$/, '');
    const now = FieldValue.serverTimestamp();
    const created = issuableStudentIds.map((studentId, index) => {
      const certificateId = `ALP-CERT-${year}-${String(firstSequence + index).padStart(6, '0')}`;
      const verifyToken = tokenFor(certificateId, secret);
      const student = students.get(studentId)!;
      const recipient = uniqueRecipients.get(studentId)!;
      return {
        ref: adminDb.collection('certificates').doc(certificateId),
        tokenRef: adminDb.collection('certificate_tokens').doc(verifyToken),
        issuanceRef: issuanceRefs[studentIds.indexOf(studentId)],
        data: {
          certificateId,
          teacherId,
          batchId,
          studentId,
          studentName: clean(student.name),
          programName,
          grade: recipient.grade || defaultGrade || clean(batchDoc.data()?.grade, 40),
          startDate,
          endDate,
          totalDuration,
          issueDate,
          dateOfCompletion,
          verifyToken,
          verifyUrl: `${appUrl}/certificates/verify/${verifyToken}`,
          status: 'active',
          isRevoked: false,
          createdAt: now,
          updatedAt: now,
        },
      };
    });

    for (
      let index = 0;
      index < created.length;
      index += CERTIFICATE_WRITE_CHUNK_SIZE
    ) {
      const writeBatch = adminDb.batch();
      created.slice(index, index + CERTIFICATE_WRITE_CHUNK_SIZE).forEach((certificate) => {
        writeBatch.create(certificate.ref, certificate.data);
        writeBatch.create(certificate.tokenRef, {
          certificateId: certificate.data.certificateId,
          teacherId,
          createdAt: now,
        });
        writeBatch.create(certificate.issuanceRef, {
          certificateId: certificate.data.certificateId,
          teacherId,
          batchId,
          studentId: certificate.data.studentId,
          createdAt: now,
        });
      });
      await writeBatch.commit();
    }

    const result = {
      created: created.map(({ data }) => ({
        certificateId: data.certificateId,
        studentId: data.studentId,
        studentName: data.studentName,
        programName: data.programName,
        grade: data.grade,
        startDate: data.startDate,
        endDate: data.endDate,
        totalDuration: data.totalDuration,
        issueDate: data.issueDate,
        dateOfCompletion: data.dateOfCompletion,
        verifyUrl: data.verifyUrl,
      })),
      skipped: studentIds
        .filter((studentId) => existingStudentIds.has(studentId))
        .map((studentId) => ({
          studentId,
          studentName: clean(students.get(studentId)?.name),
          reason: 'Certificate already exists',
        })),
      createdCount: created.length,
      skippedCount: existingStudentIds.size,
    };

    if (requestRef) {
      await requestRef.create({
        ...result,
        teacherId,
        batchId,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    return successResponse(result);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    console.error('Bulk certificate creation failed', err);
    return errorResponse('INTERNAL_ERROR', 'Failed to create certificates', 500);
  }
}
