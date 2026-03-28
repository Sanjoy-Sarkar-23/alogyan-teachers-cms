import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { batchId } = await params;

    const batchDoc = await adminDb.collection('teachers').doc(teacherId).collection('batches').doc(batchId).get();

    if (!batchDoc.exists) {
      return errorResponse('BATCH_NOT_FOUND', 'Batch not found', 404);
    }

    const batchData = batchDoc.data();
    
    const studentsSnapshot = await adminDb.collection('teachers').doc(teacherId)
      .collection('students')
      .where('batchIds', 'array-contains', batchId)
      .get();
    
    const students = studentsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    return successResponse({ id: batchDoc.id, ...batchData, students });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch batch', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { batchId } = await params;
    const body = await req.json();

    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection('teachers').doc(teacherId).collection('batches').doc(batchId).update(updateData);

    const doc = await adminDb.collection('teachers').doc(teacherId).collection('batches').doc(batchId).get();

    return successResponse({ id: doc.id, ...doc.data() });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to update batch', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { batchId } = await params;

    await adminDb.collection('teachers').doc(teacherId).collection('batches').doc(batchId).update({
      status: 'completed',
      updatedAt: new Date().toISOString(),
    });

    return successResponse({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to archive batch', 500);
  }
}
