import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { id } = await params;

    const doc = await adminDb.collection('teachers').doc(teacherId).collection('announcements').doc(id).get();

    if (!doc.exists) {
      return errorResponse('ANNOUNCEMENT_NOT_FOUND', 'Announcement not found', 404);
    }

    return successResponse({ id: doc.id, ...doc.data() });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch announcement', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { id } = await params;
    const body = await req.json();

    await adminDb.collection('teachers').doc(teacherId).collection('announcements').doc(id).update(body);

    const doc = await adminDb.collection('teachers').doc(teacherId).collection('announcements').doc(id).get();

    return successResponse({ id: doc.id, ...doc.data() });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to update announcement', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { id } = await params;

    await adminDb.collection('teachers').doc(teacherId).collection('announcements').doc(id).delete();

    return successResponse({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to delete announcement', 500);
  }
}
