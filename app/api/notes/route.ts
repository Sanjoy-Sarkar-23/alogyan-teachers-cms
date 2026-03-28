import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth, parseQueryParams } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const { page, pageSize } = parseQueryParams(req);
    const { searchParams } = new URL(req.url);

    const batchId = searchParams.get('batchId');
    const subject = searchParams.get('subject');
    const fileType = searchParams.get('fileType');

    let query: any = adminDb.collection('teachers').doc(teacherId).collection('notes');
    const snapshot = await query.get();
    let notes = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    if (batchId) notes = notes.filter((n: any) => n.batchId === batchId);
    if (subject) notes = notes.filter((n: any) => n.subject === subject);
    if (fileType) notes = notes.filter((n: any) => n.fileType === fileType);

    const total = notes.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = notes.slice((page - 1) * pageSize, page * pageSize);

    return successResponse(paginated, { page, pageSize, total, totalPages });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch notes', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const body = await req.json();

    const { title, description, type, fileType, fileUrl, linkUrl, subject, batchId, tags, fileSize } = body;

    if (!title || !type) {
      return errorResponse('VALIDATION_ERROR', 'Title and type are required', 400);
    }

    const noteData = {
      teacherId,
      title,
      description: description || null,
      type,
      fileType: fileType || null,
      fileUrl: fileUrl || null,
      linkUrl: linkUrl || null,
      subject: subject || null,
      batchId: batchId || null,
      tags: tags || [],
      fileSize: fileSize || null,
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('teachers').doc(teacherId).collection('notes').add(noteData);

    return successResponse({ id: docRef.id, ...noteData });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to create note', 500);
  }
}
