import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from './firebase-admin';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp?: string;
  error?: ApiError;
}

export function successResponse<T>(data: T, meta?: ApiResponse['meta']): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta,
    timestamp: new Date().toISOString(),
  });
}

export function errorResponse(code: string, message: string, status: number = 400, details?: unknown): NextResponse<ApiError> {
  return NextResponse.json(
    {
      code,
      message,
      details,
    },
    { status }
  );
}

export async function verifyAuth(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('AUTH_TOKEN_MISSING');
  }

  const token = authHeader.slice(7);
  
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    throw new Error('AUTH_TOKEN_INVALID');
  }
}

export function parseQueryParams(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  return {
    page: parseInt(searchParams.get('page') || '1'),
    pageSize: parseInt(searchParams.get('pageSize') || '20'),
    search: searchParams.get('search') || undefined,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  };
}
