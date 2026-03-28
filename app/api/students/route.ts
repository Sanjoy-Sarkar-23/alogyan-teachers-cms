import { NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth, parseQueryParams } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const { page, pageSize, search, sortBy, sortOrder } = parseQueryParams(req);

    const studentsRef = adminDb.collection('teachers').doc(teacherId).collection('students');
    let query: any = studentsRef;

    const snapshot = await query.get();
    let students = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    if (search) {
      students = students.filter((s: any) => 
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.phone?.includes(search)
      );
    }

    students.sort((a: any, b: any) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    const total = students.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = students.slice((page - 1) * pageSize, page * pageSize);

    return successResponse(paginated, { page, pageSize, total, totalPages });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch students', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const body = await req.json();

    const { name, phone, parentPhone, parentName, email, address, notes, batchIds } = body;

    if (!name || !phone) {
      return errorResponse('VALIDATION_ERROR', 'Name and phone are required', 400);
    }

    const studentData = {
      teacherId,
      name,
      phone,
      parentPhone: parentPhone || null,
      parentName: parentName || null,
      email: email || null,
      address: address || null,
      notes: notes || null,
      batchIds: batchIds || [],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('teachers').doc(teacherId).collection('students').add(studentData);

    return successResponse({ id: docRef.id, ...studentData });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to create student', 500);
  }
}
