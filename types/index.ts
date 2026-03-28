import { Timestamp } from 'firebase/firestore';

// ============================
// API Response Types (REST)
// ============================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp?: string;
  error?: {
    code: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
  };
}

// ============================
// TEACHER
// ============================
export interface Teacher {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  title?: string;           // e.g. "Academic Head"
  photoURL?: string;
  instituteName?: string;
  createdAt: Timestamp;
}

// ============================
// STUDENT
// ============================
export type StudentStatus = 'active' | 'inactive' | 'alumni';

export interface Student {
  id: string;
  teacherId: string;
  name: string;
  phone: string;
  parentPhone?: string;
  parentName?: string;
  email?: string;
  batchIds: string[];
  status: StudentStatus;
  enrollmentDate: Timestamp;
  photoURL?: string;
  address?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================
// BATCH
// ============================
export type BatchStatus = 'active' | 'upcoming' | 'completed';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface ScheduleSlot {
  day: DayOfWeek;
  startTime: string;   // e.g. "09:00"
  durationMins: number;
}

export interface Batch {
  id: string;
  teacherId: string;
  name: string;         // e.g. "Class 10 Maths"
  subject: string;
  description?: string;
  studentIds: string[];
  schedule: ScheduleSlot[];
  feeAmount: number;    // monthly fee in INR
  status: BatchStatus;
  startDate: Timestamp;
  endDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================
// ATTENDANCE
// ============================
export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  teacherId: string;
  batchId: string;
  date: string;          // ISO: "2026-03-21"
  createdAt: Timestamp;
  records: {
    [studentId: string]: AttendanceStatus;
  };
}

// Denormalized view per student-date
export interface StudentAttendance {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
}

// ============================
// FEE
// ============================
export type FeeStatus = 'paid' | 'pending' | 'partial' | 'overdue';
export type PaymentMode = 'cash' | 'upi' | 'bank_transfer' | 'cheque';

export interface FeeRecord {
  id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  batchName: string;
  batchId: string;
  month: string;         // "2026-03"
  amount: number;
  paidAmount: number;
  status: FeeStatus;
  dueDate: Timestamp;
  dueDateString: string;
  payments: Payment[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Payment {
  amount: number;
  mode: PaymentMode;
  paidAt: Timestamp;
  receiptNo?: string;
  notes?: string;
}

// ============================
// TEST
// ============================
export interface Test {
  id: string;
  teacherId: string;
  batchId: string;
  title: string;
  subject: string;
  topics?: string;
  scheduledAt: Timestamp;
  date: string;
  durationMins: number;
  totalMarks: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: Timestamp;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  marksObtained: number;
  percentage: number;
  grade?: string;
  submittedAt: Timestamp;
}

// ============================
// NOTE / STUDY MATERIAL
// ============================
export type NoteType = 'pdf' | 'image' | 'link' | 'text';

export interface Note {
  id: string;
  teacherId: string;
  batchId?: string;        // optional — null means all batches
  title: string;
  description?: string;
  type: NoteType;
  fileType?: string;
  fileUrl?: string;
  linkUrl?: string;
  subject: string;
  tags?: string[];
  fileSize?: number;
  createdAt: Timestamp;
}

// ============================
// ANNOUNCEMENT
// ============================
export type AnnouncementChannel = 'in_app' | 'whatsapp' | 'both';

export interface Announcement {
  id: string;
  teacherId: string;
  title: string;
  message: string;
  targetBatchIds: string[];  // empty = all
  channel: AnnouncementChannel;
  publishedAt: Timestamp;
  createdAt: Timestamp;
}

// ============================
// DASHBOARD / UI HELPERS
// ============================
export interface TodayClass {
  batchId: string;
  batchName: string;
  subject: string;
  startTime: string;
  durationMins: number;
  studentCount: number;
}

export interface PendingAction {
  type: 'fee_due' | 'missed_test' | 'absent_streak';
  studentId: string;
  studentName: string;
  detail: string;
}
