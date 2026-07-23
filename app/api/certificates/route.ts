import { NextRequest } from 'next/server';

import { errorResponse, successResponse, verifyAuth } from '@/lib/api-response';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const batchId = req.nextUrl.searchParams.get('batchId')?.trim();
    if (!batchId) return errorResponse('VALIDATION_ERROR', 'Batch ID is required', 400);

    const batch = await adminDb.collection('batches').doc(batchId).get();
    if (!batch.exists || batch.data()?.teacherId !== teacherId) {
      return errorResponse('BATCH_NOT_FOUND', 'Batch not found', 404);
    }

    const snapshot = await adminDb.collection('certificates').where('batchId', '==', batchId).get();
    const certificates = snapshot.docs
      .map((doc): Record<string, unknown> => ({ id: doc.id, ...doc.data() }))
      .filter((certificate) => certificate.teacherId === teacherId)
      .sort((a, b) => String(b.issueDate).localeCompare(String(a.issueDate)));
    return successResponse(certificates);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) return errorResponse(err.message, 'Unauthorized', 401);
    console.error('Failed to fetch issued certificates', err);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch issued certificates', 500);
  }
}
