import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth, parseQueryParams } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const { page, pageSize } = parseQueryParams(req);
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const batchId = searchParams.get('batchId');
    const studentId = searchParams.get('studentId');
    const month = searchParams.get('month');

    let query: any = adminDb.collection('teachers').doc(teacherId).collection('fees');

    const snapshot = await query.get();
    let fees = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    if (status) fees = fees.filter((f: any) => f.status === status);
    if (batchId) fees = fees.filter((f: any) => f.batchId === batchId);
    if (studentId) fees = fees.filter((f: any) => f.studentId === studentId);
    if (month) fees = fees.filter((f: any) => f.month === month);

    const total = fees.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = fees.slice((page - 1) * pageSize, page * pageSize);

    return successResponse(paginated, { page, pageSize, total, totalPages });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch fees', 500);
  }
}
