import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/lib/api-response';
import { adminDb } from '@/lib/firebase-admin';

const TOKEN_PATTERN = /^[a-f0-9]{64}$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!TOKEN_PATTERN.test(token)) {
      return errorResponse('INVALID_TOKEN', 'Certificate not found', 404);
    }

    const tokenDoc = await adminDb.collection('certificate_tokens').doc(token).get();
    if (!tokenDoc.exists) {
      return errorResponse('CERTIFICATE_NOT_FOUND', 'Certificate not found', 404);
    }

    const certificateId = tokenDoc.data()?.certificateId;
    const certificateDoc = await adminDb.collection('certificates').doc(certificateId).get();
    if (!certificateDoc.exists || certificateDoc.data()?.verifyToken !== token) {
      return errorResponse('CERTIFICATE_NOT_FOUND', 'Certificate not found', 404);
    }

    const certificate = certificateDoc.data()!;
    return successResponse({
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      programName: certificate.programName,
      grade: certificate.grade,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
      totalDuration: certificate.totalDuration,
      issueDate: certificate.issueDate,
      dateOfCompletion: certificate.dateOfCompletion,
      verifyUrl: certificate.verifyUrl,
      status: certificate.isRevoked ? 'revoked' : 'valid',
    });
  } catch (error) {
    console.error('Certificate verification failed', error);
    return errorResponse('INTERNAL_ERROR', 'Unable to verify certificate', 500);
  }
}
