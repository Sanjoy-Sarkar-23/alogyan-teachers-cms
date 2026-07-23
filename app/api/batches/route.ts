import { FieldValue, Query } from 'firebase-admin/firestore';
import { NextRequest } from 'next/server';

import { errorResponse, successResponse, verifyAuth } from '@/lib/api-response';
import { adminDb } from '@/lib/firebase-admin';
import type { BatchStatus, ScheduleSlot } from '@/types';

const PAGE_SIZE_MAX = 50;
const VALID_STATUSES = new Set<BatchStatus>(['active', 'upcoming', 'completed']);
const VALID_DAYS = new Set(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

function text(value: unknown, max = 160) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function number(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function schedule(value: unknown): ScheduleSlot[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 14).flatMap((slot) => {
    if (!slot || typeof slot !== 'object') return [];
    const candidate = slot as Record<string, unknown>;
    const day = text(candidate.day, 3) as ScheduleSlot['day'];
    const startTime = text(candidate.startTime, 5);
    const durationMins = Math.round(number(candidate.durationMins));
    if (!VALID_DAYS.has(day) || !/^\d{2}:\d{2}$/.test(startTime) || durationMins < 15) return [];
    return [{ day, startTime, durationMins }];
  });
}

export async function GET(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const status = text(req.nextUrl.searchParams.get('status'), 20);
    const subject = text(req.nextUrl.searchParams.get('subject'));
    const grade = text(req.nextUrl.searchParams.get('grade'), 60);
    const search = text(req.nextUrl.searchParams.get('search'));
    const cursor = text(req.nextUrl.searchParams.get('cursor'), 120);
    const requestedSize = Number(req.nextUrl.searchParams.get('pageSize') || 12);
    const pageSize = Math.min(Math.max(requestedSize || 12, 1), PAGE_SIZE_MAX);

    let batchesQuery: Query = adminDb
      .collection('batches')
      .where('teacherId', '==', teacherId);
    if (status && status !== 'all' && VALID_STATUSES.has(status as BatchStatus)) {
      batchesQuery = batchesQuery.where('status', '==', status);
    }
    if (subject) batchesQuery = batchesQuery.where('subject', '==', subject);
    if (grade) batchesQuery = batchesQuery.where('grade', '==', grade);
    if (search) {
      batchesQuery = batchesQuery
        .where('name', '>=', search)
        .where('name', '<=', `${search}\uf8ff`)
        .orderBy('name');
    } else {
      batchesQuery = batchesQuery.orderBy('name');
    }
    if (cursor) {
      const cursorDoc = await adminDb.collection('batches').doc(cursor).get();
      if (cursorDoc.exists && cursorDoc.data()?.teacherId === teacherId) {
        batchesQuery = batchesQuery.startAfter(cursorDoc);
      }
    }

    const snapshot = await batchesQuery.limit(pageSize + 1).get();
    const hasMore = snapshot.docs.length > pageSize;
    const pageDocs = snapshot.docs.slice(0, pageSize);
    return successResponse(
      pageDocs.map((doc) => ({ id: doc.id, ...doc.data() })),
      {
        pageSize,
        hasMore,
        nextCursor: hasMore ? pageDocs.at(-1)?.id : undefined,
      }
    );
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) return errorResponse(err.message, 'Unauthorized', 401);
    console.error('Failed to fetch batches', err);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch batches', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const teacherId = await verifyAuth(req);
    const body = (await req.json()) as Record<string, unknown>;
    const name = text(body.name);
    const subject = text(body.subject, 100);
    const grade = text(body.grade, 60);
    const status = text(body.status, 20) as BatchStatus;
    const startDate = text(body.startDate, 10);
    const endDate = text(body.endDate, 10);
    if (!name || !subject || !VALID_STATUSES.has(status)) {
      return errorResponse('VALIDATION_ERROR', 'Name, subject, and a valid status are required', 400);
    }
    if (startDate && endDate && startDate > endDate) {
      return errorResponse('VALIDATION_ERROR', 'Start date cannot be after end date', 400);
    }

    const now = FieldValue.serverTimestamp();
    const batchData = {
      teacherId,
      name,
      normalizedName: name.toLowerCase(),
      subject,
      grade,
      description: text(body.description, 1000),
      schedule: schedule(body.schedule),
      monthlyFee: number(body.monthlyFee ?? body.feeAmount),
      studentIds: [],
      studentCount: 0,
      capacity: Math.round(number(body.capacity)),
      status,
      startDate,
      endDate,
      room: text(body.room, 120),
      deliveryMode: ['offline', 'online', 'hybrid'].includes(text(body.deliveryMode))
        ? text(body.deliveryMode)
        : 'offline',
      meetingLink: text(body.meetingLink, 500),
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await adminDb.collection('batches').add(batchData);
    return successResponse({ id: docRef.id, ...batchData });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.startsWith('AUTH_')) return errorResponse(err.message, 'Unauthorized', 401);
    console.error('Failed to create batch', err);
    return errorResponse('INTERNAL_ERROR', 'Failed to create batch', 500);
  }
}
