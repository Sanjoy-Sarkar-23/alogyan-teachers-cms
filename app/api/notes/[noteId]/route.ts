import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { noteId } = await params;

    const doc = await adminDb.collection('teachers').doc(teacherId).collection('notes').doc(noteId).get();

    if (!doc.exists) {
      return errorResponse('NOTE_NOT_FOUND', 'Note not found', 404);
    }

    return successResponse({ id: doc.id, ...doc.data() });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch note', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { noteId } = await params;
    const body = await req.json();

    await adminDb.collection('teachers').doc(teacherId).collection('notes').doc(noteId).update(body);

    const doc = await adminDb.collection('teachers').doc(teacherId).collection('notes').doc(noteId).get();

    return successResponse({ id: doc.id, ...doc.data() });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to update note', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { noteId } = await params;

    await adminDb.collection('teachers').doc(teacherId).collection('notes').doc(noteId).delete();

    return successResponse({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to delete note', 500);
  }
}
