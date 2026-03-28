import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth, parseQueryParams } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const { page, pageSize } = parseQueryParams(req);
    const { searchParams } = new URL(req.url);

    const batchId = searchParams.get('batchId');
    const isPinned = searchParams.get('isPinned');

    let query: any = adminDb.collection('teachers').doc(teacherId).collection('announcements');
    const snapshot = await query.get();
    let announcements = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    if (batchId) announcements = announcements.filter((a: any) => a.batchId === batchId);
    if (isPinned !== null) announcements = announcements.filter((a: any) => a.isPinned === (isPinned === 'true'));

    announcements.sort((a: any, b: any) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = announcements.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = announcements.slice((page - 1) * pageSize, page * pageSize);

    return successResponse(paginated, { page, pageSize, total, totalPages });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch announcements', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const body = await req.json();

    const { title, message, targetBatchIds, channel, scheduledAt } = body;

    if (!title || !message) {
      return errorResponse('VALIDATION_ERROR', 'Title and message are required', 400);
    }

    const announcementData = {
      teacherId,
      title,
      message,
      targetBatchIds: targetBatchIds || [],
      channel: channel || 'in_app',
      isPinned: false,
      status: 'sent',
      publishedAt: new Date().toISOString(),
      scheduledAt: scheduledAt || null,
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('teachers').doc(teacherId).collection('announcements').add(announcementData);

    return successResponse({ id: docRef.id, ...announcementData });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to create announcement', 500);
  }
}
