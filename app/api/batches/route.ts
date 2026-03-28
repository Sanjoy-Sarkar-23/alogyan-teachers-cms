import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth, parseQueryParams } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const { page, pageSize, search, sortBy, sortOrder } = parseQueryParams(req);
    const status = req.nextUrl.searchParams.get('status');

    let query = adminDb.collection('teachers').doc(teacherId).collection('batches');
    const snapshot = await query.get();
    let batches = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    if (status && status !== 'all') {
      batches = batches.filter((b: any) => b.status === status);
    }

    if (search) {
      batches = batches.filter((b: any) => 
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.subject?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = batches.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = batches.slice((page - 1) * pageSize, page * pageSize);

    return successResponse(paginated, { page, pageSize, total, totalPages });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch batches', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const body = await req.json();

    const { name, subject, description, schedule, feeAmount, status, startDate, endDate } = body;

    if (!name || !subject) {
      return errorResponse('VALIDATION_ERROR', 'Name and subject are required', 400);
    }

    const batchData = {
      teacherId,
      name,
      subject,
      description: description || null,
      schedule: schedule || [],
      feeAmount: feeAmount || 0,
      studentIds: [],
      status: status || 'upcoming',
      startDate: startDate || null,
      endDate: endDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('teachers').doc(teacherId).collection('batches').add(batchData);

    return successResponse({ id: docRef.id, ...batchData });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to create batch', 500);
  }
}
