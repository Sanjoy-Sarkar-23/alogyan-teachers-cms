import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { studentId } = await params;

    const doc = await adminDb.collection('teachers').doc(teacherId).collection('students').doc(studentId).get();

    if (!doc.exists) {
      return errorResponse('STUDENT_NOT_FOUND', 'Student not found', 404);
    }

    return successResponse({ id: doc.id, ...doc.data() });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch student', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { studentId } = await params;
    const body = await req.json();

    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection('teachers').doc(teacherId).collection('students').doc(studentId).update(updateData);

    const doc = await adminDb.collection('teachers').doc(teacherId).collection('students').doc(studentId).get();

    return successResponse({ id: doc.id, ...doc.data() });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to update student', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { studentId } = await params;

    await adminDb.collection('teachers').doc(teacherId).collection('students').doc(studentId).update({
      status: 'inactive',
      updatedAt: new Date().toISOString(),
    });

    return successResponse({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to archive student', 500);
  }
}
