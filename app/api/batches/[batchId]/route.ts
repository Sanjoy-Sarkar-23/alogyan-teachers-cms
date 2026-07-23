import { FieldValue } from 'firebase-admin/firestore';
import { NextRequest } from 'next/server';

import { errorResponse, successResponse, verifyAuth } from '@/lib/api-response';
import { adminDb } from '@/lib/firebase-admin';

function allowedUpdate(body: Record<string, unknown>) {
  const allowed = [
    'name', 'subject', 'grade', 'description', 'schedule', 'monthlyFee', 'capacity',
    'status', 'startDate', 'endDate', 'room', 'deliveryMode', 'meetingLink',
  ] as const;
  return Object.fromEntries(allowed.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
}

async function ownedBatch(teacherId: string, batchId: string) {
  const ref = adminDb.collection('batches').doc(batchId);
  const snapshot = await ref.get();
  return { ref, snapshot, owned: snapshot.exists && snapshot.data()?.teacherId === teacherId };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ batchId: string }> }) {
  try {
    const teacherId = await verifyAuth(req);
    const { batchId } = await params;
    const batch = await ownedBatch(teacherId, batchId);
    if (!batch.owned) return errorResponse('BATCH_NOT_FOUND', 'Batch not found', 404);
    return successResponse({ id: batch.snapshot.id, ...batch.snapshot.data() });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) return errorResponse(err.message, 'Unauthorized', 401);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch batch', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ batchId: string }> }) {
  try {
    const teacherId = await verifyAuth(req);
    const { batchId } = await params;
    const batch = await ownedBatch(teacherId, batchId);
    if (!batch.owned) return errorResponse('BATCH_NOT_FOUND', 'Batch not found', 404);
    const body = (await req.json()) as Record<string, unknown>;
    const update = allowedUpdate(body);
    if (typeof update.name === 'string') update.normalizedName = update.name.trim().toLowerCase();
    await batch.ref.update({ ...update, updatedAt: FieldValue.serverTimestamp() });
    const updated = await batch.ref.get();
    return successResponse({ id: updated.id, ...updated.data() });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) return errorResponse(err.message, 'Unauthorized', 401);
    console.error('Failed to update batch', err);
    return errorResponse('INTERNAL_ERROR', 'Failed to update batch', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ batchId: string }> }) {
  try {
    const teacherId = await verifyAuth(req);
    const { batchId } = await params;
    const batch = await ownedBatch(teacherId, batchId);
    if (!batch.owned) return errorResponse('BATCH_NOT_FOUND', 'Batch not found', 404);
    await batch.ref.update({ status: 'completed', updatedAt: FieldValue.serverTimestamp() });
    return successResponse({ archived: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) return errorResponse(err.message, 'Unauthorized', 401);
    return errorResponse('INTERNAL_ERROR', 'Failed to archive batch', 500);
  }
}
