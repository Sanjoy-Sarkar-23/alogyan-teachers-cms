import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { successResponse, errorResponse, verifyAuth } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);

    const studentsSnapshot = await adminDb.collection('teachers').doc(teacherId).collection('students').get();
    const students = studentsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const activeStudents = students.filter((s: any) => s.status === 'active');

    const batchesSnapshot = await adminDb.collection('teachers').doc(teacherId).collection('batches').get();
    const batches = batchesSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const activeBatches = batches.filter((b: any) => b.status === 'active');

    const today = new Date().toISOString().split('T')[0];
    const attendanceSnapshot = await adminDb.collection('teachers').doc(teacherId)
      .collection('attendance')
      .where('date', '==', today)
      .get();
    const attendanceToday = attendanceSnapshot.docs.length;

    const feesSnapshot = await adminDb.collection('teachers').doc(teacherId).collection('fees').get();
    const fees = feesSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthFees = fees.filter((f: any) => f.month === currentMonth);
    
    const feesCollectedThisMonth = monthFees
      .filter((f: any) => f.status === 'paid')
      .reduce((sum: number, f: any) => sum + (f.paidAmount || 0), 0);
    
    const feesPendingThisMonth = monthFees
      .filter((f: any) => f.status === 'pending' || f.status === 'partial')
      .reduce((sum: number, f: any) => sum + ((f.amount || 0) - (f.paidAmount || 0)), 0);
    
    const feesOverdue = monthFees
      .filter((f: any) => f.status === 'overdue')
      .reduce((sum: number, f: any) => sum + ((f.amount || 0) - (f.paidAmount || 0)), 0);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayName = dayNames[new Date().getDay()];
    
    const todaysBatches = activeBatches.filter((b: any) => 
      b.schedule?.some((slot: any) => slot.day === todayName)
    ).map((b: any) => {
      const slot = b.schedule.find((s: any) => s.day === todayName);
      return {
        id: b.id,
        name: b.name,
        time: slot?.startTime || 'N/A',
        students: b.studentIds?.length || 0,
      };
    });

    return successResponse({
      totalStudents: activeStudents.length,
      activeBatches: activeBatches.length,
      feesCollectedThisMonth,
      feesPendingThisMonth,
      feesOverdue,
      todaysBatches,
      attendanceTodayMarked: attendanceToday,
      attendanceTodayPending: activeBatches.length - attendanceToday,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) {
      return errorResponse(err.message, 'Unauthorized', 401);
    }
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch dashboard', 500);
  }
}
