/**
 * API Hooks for Alogyan Modules
 * React Query hooks for data fetching, caching, and mutations
 */

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';
import type {
  AnnouncementChannel,
  Batch,
  BatchStatus,
  NoteType,
  PaymentMode,
  ScheduleSlot,
  StudentStatus
} from '../types';

// ============================
// QUERY KEY FACTORIES
// ============================

export const queryKeys = {
  // Students
  students: {
    all: ['students'] as const,
    lists: () => [...queryKeys.students.all, 'list'] as const,
    list: (filters: StudentFilters) => [...queryKeys.students.lists(), filters] as const,
    details: () => [...queryKeys.students.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.students.details(), id] as const,
    batches: (id: string) => [...queryKeys.students.detail(id), 'batches'] as const,
    fees: (id: string) => [...queryKeys.students.detail(id), 'fees'] as const,
    attendance: (id: string) => [...queryKeys.students.detail(id), 'attendance'] as const,
  },

  // Batches
  batches: {
    all: ['batches'] as const,
    lists: () => [...queryKeys.batches.all, 'list'] as const,
    list: (filters: BatchFilters) => [...queryKeys.batches.lists(), filters] as const,
    details: () => [...queryKeys.batches.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.batches.details(), id] as const,
  },

  // Attendance
  attendance: {
    all: ['attendance'] as const,
    byBatch: (batchId: string, filters: { from: string; to: string }) => [...queryKeys.attendance.all, batchId, filters] as const,
    summary: (batchId: string, month: string) => [...queryKeys.attendance.all, batchId, 'summary', month] as const,
    byStudent: (studentId: string) => [...queryKeys.attendance.all, 'student', studentId] as const,
  },

  // Fees
  fees: {
    all: ['fees'] as const,
    lists: () => [...queryKeys.fees.all, 'list'] as const,
    list: (filters: FeeFilters) => [...queryKeys.fees.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.fees.all, id] as const,
    byStudent: (studentId: string) => [...queryKeys.fees.all, 'student', studentId] as const,
    byBatch: (batchId: string, month: string) => [...queryKeys.fees.all, 'batch', batchId, month] as const,
  },

  // Notes
  notes: {
    all: ['notes'] as const,
    lists: () => [...queryKeys.notes.all, 'list'] as const,
    list: (filters: NoteFilters) => [...queryKeys.notes.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.notes.all, id] as const,
  },

  // Announcements
  announcements: {
    all: ['announcements'] as const,
    lists: () => [...queryKeys.announcements.all, 'list'] as const,
    list: (filters: AnnouncementFilters) => [...queryKeys.announcements.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.announcements.all, id] as const,
  },

  // Reports
  reports: {
    dashboard: ['reports', 'dashboard'] as const,
    attendance: (filters: { from: string; to: string; batchId?: string }) => ['reports', 'attendance', filters] as const,
    fees: (month: string, batchId?: string) => ['reports', 'fees', month, batchId] as const,
    student: (studentId: string, month?: string) => ['reports', 'student', studentId, month] as const,
  },
};

// ============================
// MUTATION DATA TYPES
// ============================

export interface CreateStudentData {
  name: string;
  phone: string;
  parentPhone?: string;
  parentName?: string;
  email?: string;
  batchIds?: string[];
  photoURL?: string;
  address?: string;
  notes?: string;
}

export interface UpdateStudentData extends Partial<CreateStudentData> {
  status?: StudentStatus;
}

export interface CreateBatchData {
  name: string;
  subject: string;
  grade?: string;
  description?: string;
  studentIds?: string[];
  schedule: ScheduleSlot[];
  feeAmount?: number;
  monthlyFee?: number;
  capacity?: number;
  room?: string;
  deliveryMode?: 'offline' | 'online' | 'hybrid';
  meetingLink?: string;
  status?: BatchStatus;
  startDate: string;
  endDate?: string;
}

export type UpdateBatchData = Partial<CreateBatchData>;

export interface CloneBatchData {
  name: string;
  startDate: string;
  studentIds?: string[];
}

export interface GenerateFeesData {
  batchId: string;
  month: string;
  amount: number;
  dueDate: string;
}

export interface MarkFeePaidData {
  amount: number;
  mode: PaymentMode;
  receiptNo?: string;
  notes?: string;
}

export interface SaveNoteData {
  title: string;
  description?: string;
  type: NoteType;
  fileType?: string;
  fileUrl?: string;
  linkUrl?: string;
  subject: string;
  batchId?: string;
  tags?: string[];
  fileSize?: number;
}

export interface CreateAnnouncementData {
  title: string;
  message: string;
  targetBatchIds?: string[];
  channel: AnnouncementChannel;
}

export type UpdateAnnouncementData = Partial<CreateAnnouncementData>;

// ============================
// STUDENTS HOOKS
// ============================

export interface StudentFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  batchId?: string;
  isArchived?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useStudents(filters: StudentFilters = {}) {
  return useQuery({
    queryKey: queryKeys.students.list(filters),
    queryFn: () => api.get('/students', filters as Record<string, unknown>),
  });
}

export function useStudent(studentId: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(studentId),
    queryFn: () => api.get(`/students/${studentId}`),
    enabled: !!studentId,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentData) => api.post('/students', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
    },
  });
}

export function useUpdateStudent(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudentData) => api.patch(`/students/${studentId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(studentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
    },
  });
}

export function useArchiveStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: string) => api.delete(`/students/${studentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
    },
  });
}

export function useBulkImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = await (async () => {
        const { auth } = await import('./firebase');
        return auth.currentUser?.getIdToken() || null;
      })();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'}/students/bulk`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
    },
  });
}

// ============================
// BATCHES HOOKS
// ============================

export interface BatchFilters {
  pageSize?: number;
  status?: BatchStatus | 'all';
  subject?: string;
  grade?: string;
  search?: string;
}

export function useBatches(filters: BatchFilters = {}) {
  return useQuery({
    queryKey: queryKeys.batches.list(filters),
    queryFn: () => api.get('/batches', filters as Record<string, unknown>),
    staleTime: 60_000,
  });
}

export function useInfiniteBatches(filters: BatchFilters = {}, enabled = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.batches.list(filters),
    queryFn: ({ pageParam }) =>
      api.get<Batch[]>('/batches', {
        ...filters,
        cursor: pageParam || undefined,
      } as Record<string, unknown>),
    initialPageParam: '',
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasMore ? lastPage.meta.nextCursor : undefined,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    enabled,
  });
}

export function useBatchStats(enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.batches.all, 'stats'],
    queryFn: () => api.get<{ total: number; active: number; upcoming: number; completed: number }>('/batches/stats'),
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
    enabled,
  });
}

export function useBatch(batchId: string) {
  return useQuery({
    queryKey: queryKeys.batches.detail(batchId),
    queryFn: () => api.get<Batch>(`/batches/${batchId}`),
    enabled: !!batchId,
    staleTime: 2 * 60_000,
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBatchData) => api.post('/batches', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.all });
    },
  });
}

export function useUpdateBatch(batchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBatchData) => api.patch(`/batches/${batchId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.detail(batchId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.all });
    },
  });
}

export function useEnrollStudents(batchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentIds: string[]) => api.post(`/batches/${batchId}/enroll`, { studentIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.detail(batchId) });
    },
  });
}

export function useCloneBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, data }: { batchId: string; data: CloneBatchData }) =>
      api.post(`/batches/${batchId}/clone`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.all });
    },
  });
}

// ============================
// ATTENDANCE HOOKS
// ============================

export function useAttendance(batchId: string, from: string, to: string) {
  return useQuery({
    queryKey: queryKeys.attendance.byBatch(batchId, { from, to }),
    queryFn: () => api.get(`/attendance/${batchId}`, { from, to }),
    enabled: !!batchId && !!from && !!to,
  });
}

export function useAttendanceSummary(batchId: string, month: string) {
  return useQuery({
    queryKey: queryKeys.attendance.summary(batchId, month),
    queryFn: () => api.get(`/attendance/${batchId}/summary`, { month }),
    enabled: !!batchId && !!month,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { batchId: string; date: string; records: Record<string, string> }) =>
      api.post(`/attendance/${variables.batchId}`, { date: variables.date, records: variables.records }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.byBatch(variables.batchId, { from: '', to: '' }) });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.summary(variables.batchId, variables.date.substring(0, 7)) });
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { batchId: string; date: string; records: Record<string, string> }) =>
      api.patch(`/attendance/${variables.batchId}/${variables.date}`, { records: variables.records }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.byBatch(variables.batchId, { from: '', to: '' }) });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.summary(variables.batchId, variables.date.substring(0, 7)) });
    },
  });
}

// ============================
// FEES HOOKS
// ============================

export interface FeeFilters {
  page?: number;
  pageSize?: number;
  status?: 'pending' | 'partial' | 'paid' | 'overdue';
  batchId?: string;
  studentId?: string;
  month?: string;
}

export function useFees(filters: FeeFilters = {}) {
  return useQuery({
    queryKey: queryKeys.fees.list(filters),
    queryFn: () => api.get('/fees', filters as Record<string, unknown>),
  });
}

export function useFeeRecord(feeId: string) {
  return useQuery({
    queryKey: queryKeys.fees.detail(feeId),
    queryFn: () => api.get(`/fees/${feeId}`),
    enabled: !!feeId,
  });
}

export function useGenerateFees() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { batchId: string; month: string; amount: number; dueDate: string }) =>
      api.post('/fees/generate', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.all });
    },
  });
}

export function useMarkFeePaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feeId, data }: { feeId: string; data: MarkFeePaidData }) =>
      api.patch(`/fees/${feeId}/pay`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.all });
    },
  });
}

export function useMarkFeePartial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feeId, data }: { feeId: string; data: MarkFeePaidData }) =>
      api.patch(`/fees/${feeId}/partial`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.all });
    },
  });
}

// ============================
// NOTES HOOKS
// ============================

export interface NoteFilters {
  page?: number;
  pageSize?: number;
  batchId?: string;
  subject?: string;
  fileType?: string;
}

export function useNotes(filters: NoteFilters = {}) {
  return useQuery({
    queryKey: queryKeys.notes.list(filters),
    queryFn: () => api.get('/notes', filters as Record<string, unknown>),
  });
}

export function useRequestUploadUrl() {
  return useMutation({
    mutationFn: (data: { fileName: string; fileType: string; fileSizeBytes: number }) =>
      api.post('/notes/upload-url', data),
  });
}

export function useSaveNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveNoteData) => api.post('/notes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => api.delete(`/notes/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
    },
  });
}

// ============================
// ANNOUNCEMENTS HOOKS
// ============================

export interface AnnouncementFilters {
  page?: number;
  pageSize?: number;
  batchId?: string;
  isPinned?: boolean;
}

export function useAnnouncements(filters: AnnouncementFilters = {}) {
  return useQuery({
    queryKey: queryKeys.announcements.list(filters),
    queryFn: () => api.get('/announcements', filters as Record<string, unknown>),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementData) => api.post('/announcements', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAnnouncementData }) =>
      api.patch(`/announcements/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
    },
  });
}

export function useTogglePinAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.patch(`/announcements/${id}/pin`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
    },
  });
}

// ============================
// REPORTS HOOKS
// ============================

export function useDashboardReport() {
  return useQuery({
    queryKey: queryKeys.reports.dashboard,
    queryFn: () => api.get('/reports/dashboard'),
  });
}

export function useAttendanceReport(filters: { from: string; to: string; batchId?: string }) {
  return useQuery({
    queryKey: queryKeys.reports.attendance(filters),
    queryFn: () => api.get('/reports/attendance', filters),
    enabled: !!filters.from && !!filters.to,
  });
}

export function useFeeReport(month: string, batchId?: string) {
  return useQuery({
    queryKey: queryKeys.reports.fees(month, batchId),
    queryFn: () => api.get('/reports/fees', { month, batchId }),
    enabled: !!month,
  });
}

export function useStudentReport(studentId: string, month?: string) {
  return useQuery({
    queryKey: queryKeys.reports.student(studentId, month),
    queryFn: () => api.get(`/reports/students`, { studentId, month }),
    enabled: !!studentId,
  });
}
