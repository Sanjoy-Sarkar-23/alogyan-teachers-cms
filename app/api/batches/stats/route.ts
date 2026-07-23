import { NextRequest } from 'next/server';

import { errorResponse, successResponse, verifyAuth } from '@/lib/api-response';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const base = adminDb.collection('batches').where('teacherId', '==', teacherId);
    const [total, active, upcoming, completed] = await Promise.all([
      base.count().get(),
      base.where('status', '==', 'active').count().get(),
      base.where('status', '==', 'upcoming').count().get(),
      base.where('status', '==', 'completed').count().get(),
    ]);
    return successResponse({
      total: total.data().count,
      active: active.data().count,
      upcoming: upcoming.data().count,
      completed: completed.data().count,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) return errorResponse(err.message, 'Unauthorized', 401);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch batch statistics', 500);
  }
}
