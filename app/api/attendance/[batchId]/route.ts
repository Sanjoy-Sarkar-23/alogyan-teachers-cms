import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth, parseQueryParams } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { batchId } = await params;
    const { searchParams } = new URL(req.url);
    
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let query = adminDb.collection('teachers').doc(teacherId).collection('attendance')
      .where('batchId', '==', batchId);

    if (from && to) {
      query = query.where('date', '>=', from).where('date', '<=', to) as any;
    }

    const snapshot = await query.get();
    const records = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    return successResponse(records);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch attendance', 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const teacherId = await verifyAuth(req);
    const { batchId } = await params;
    const body = await req.json();

    const { date, records } = body;

    if (!date || !records) {
      return errorResponse('VALIDATION_ERROR', 'Date and records are required', 400);
    }

    const existingQuery = await adminDb.collection('teachers').doc(teacherId)
      .collection('attendance')
      .where('batchId', '==', batchId)
      .where('date', '==', date)
      .get();

    const attendanceData = {
      teacherId,
      batchId,
      date,
      records,
      markedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    let docRef;
    if (!existingQuery.empty) {
      docRef = existingQuery.docs[0].ref;
      await docRef.update(attendanceData);
    } else {
      docRef = await adminDb.collection('teachers').doc(teacherId).collection('attendance').add(attendanceData);
    }

    const counts: Record<string, number> = {};
    Object.values(records).forEach((status: any) => {
      counts[status] = (counts[status] || 0) + 1;
    });

    return successResponse({
      id: docRef.id,
      batchId,
      date,
      totalPresent: counts.present || 0,
      totalAbsent: counts.absent || 0,
      markedAt: attendanceData.markedAt,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to mark attendance', 500);
  }
}
