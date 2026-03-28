# 🚀 Quick Start Guide - Alogyan Frontend

## ✅ Setup Complete!

The frontend infrastructure for Alogyan Teacher CMS has been successfully set up with:

- ✅ API Client (REST + GraphQL)
- ✅ React Query Hooks for all modules
- ✅ Firebase Authentication
- ✅ TypeScript Types
- ✅ Global State Management

---

## 🎯 What You Can Do Now

### 1. Fetch Students List

```tsx
'use client';

import { useStudents } from '@/lib/api-hooks';

export default function StudentsPage() {
  const { data, isLoading, error } = useStudents({
    page: 1,
    pageSize: 20,
    search: '',
    isArchived: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading students</div>;

  return (
    <div>
      <h1>Students ({data?.meta?.total || 0})</h1>
      {data?.data?.map((student: any) => (
        <div key={student.id}>
          <h3>{student.name}</h3>
          <p>{student.phone} | {student.grade}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Create a New Student

```tsx
import { useCreateStudent } from '@/lib/api-hooks';

export function AddStudentButton() {
  const createStudent = useCreateStudent();

  const handleAdd = async () => {
    const newStudent = {
      name: 'Rahul Kumar',
      phone: '9876543210',
      parentPhone: '9123456789',
      grade: '10th',
      address: 'Pune, MH',
      batchIds: ['batch_123'],
    };

    try {
      const result = await createStudent.mutateAsync(newStudent);
      console.log('Created:', result.data);
    } catch (error) {
      console.error('Failed to create student');
    }
  };

  return (
    <button onClick={handleAdd} disabled={createStudent.isPending}>
      {createStudent.isPending ? 'Creating...' : 'Add Student'}
    </button>
  );
}
```

### 3. Mark Attendance

```tsx
import { useMarkAttendance } from '@/lib/api-hooks';

export function AttendanceMarker({ batchId }: { batchId: string }) {
  const markAttendance = useMarkAttendance();
  
  const today = new Date().toISOString().split('T')[0];
  const records = {
    'student_1': 'present',
    'student_2': 'absent',
    'student_3': 'present',
  };

  const handleSubmit = async () => {
    try {
      await markAttendance.mutateAsync({
        batchId,
        date: today,
        records,
      });
      alert('Attendance marked!');
    } catch (error) {
      alert('Failed to mark attendance');
    }
  };

  return (
    <button onClick={handleSubmit} disabled={markAttendance.isPending}>
      Submit Attendance
    </button>
  );
}
```

### 4. Display Dashboard Stats

```tsx
import { useDashboardReport } from '@/lib/api-hooks';

export function DashboardStats() {
  const { data, isLoading } = useDashboardReport();

  if (isLoading) return <div>Loading stats...</div>;

  const stats = data?.data;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Students</h3>
        <p className="value">{stats?.totalStudents}</p>
      </div>
      <div className="stat-card">
        <h3>Active Batches</h3>
        <p className="value">{stats?.activeBatches}</p>
      </div>
      <div className="stat-card">
        <h3>Fees Collected</h3>
        <p className="value">₹{stats?.feesCollectedThisMonth}</p>
      </div>
      <div className="stat-card">
        <h3>Pending Fees</h3>
        <p className="value">₹{stats?.feesPendingThisMonth}</p>
      </div>
    </div>
  );
}
```

---

## 📋 Available Hooks Reference

### Students
- `useStudents(filters)` - List with pagination
- `useStudent(id)` - Single student
- `useCreateStudent()` - Create mutation
- `useUpdateStudent(id)` - Update mutation
- `useArchiveStudent()` - Archive mutation
- `useBulkImportStudents()` - CSV import

### Batches
- `useBatches(filters)` - List batches
- `useBatch(id)` - Batch details
- `useCreateBatch()` - Create
- `useUpdateBatch(id)` - Update
- `useEnrollStudents(batchId)` - Enroll
- `useCloneBatch()` - Clone for new term

### Attendance
- `useAttendance(batchId, from, to)` - Records
- `useAttendanceSummary(batchId, month)` - Summary
- `useMarkAttendance()` - Mark daily
- `useUpdateAttendance()` - Update past

### Fees
- `useFees(filters)` - List records
- `useFeeRecord(id)` - Single record
- `useGenerateFees()` - Bulk generate
- `useMarkFeePaid()` - Full payment
- `useMarkFeePartial()` - Partial payment

### Notes
- `useNotes(filters)` - List materials
- `useRequestUploadUrl()` - Get upload URL
- `useSaveNote()` - Save metadata
- `useDeleteNote()` - Delete note

### Announcements
- `useAnnouncements(filters)` - List
- `useCreateAnnouncement()` - Create
- `useUpdateAnnouncement(id)` - Update
- `useTogglePinAnnouncement(id)` - Pin toggle
- `useDeleteAnnouncement(id)` - Delete

### Reports
- `useDashboardReport()` - KPI dashboard
- `useAttendanceReport(filters)` - Analytics
- `useFeeReport(month, batchId?)` - Collection
- `useStudentReport(studentId, month?)` - Per student

---

## 🔑 Authentication

The app automatically handles authentication:

```tsx
import { useAuth } from '@/contexts/AuthContext';

export function UserProfile() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    return <button onClick={signInWithGoogle}>Sign in with Google</button>;
  }

  return (
    <div>
      <p>Welcome, {user.displayName}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

---

## 🎨 Next Steps

### Ready to Implement:

1. **Students Module** (`app/students/page.tsx`)
   - Student list with filters
   - Add/Edit student form
   - Student profile view

2. **Batches Module** (`app/batches/page.tsx`)
   - Batch cards/list
   - Create batch form
   - Enrollment management

3. **Attendance Module** (`app/attendance/[batchId]/page.tsx`)
   - Calendar view
   - Daily marking interface
   - Historical reports

4. **Fees Module** (`app/fees/page.tsx`)
   - Fee records table
   - Payment recording
   - Generate monthly fees

5. **Dashboard** (`app/dashboard/page.tsx`)
   - Stats cards
   - Charts (using recharts)
   - Quick actions

---

## 🛠️ Tips

### Query Keys
All queries are cached with unique keys:
```typescript
// Automatically refreshes after mutation
queryKeys.students.list({ page: 1 })
queryKeys.batches.detail(batchId)
```

### Optimistic Updates
Mutations automatically invalidate related queries:
```typescript
// After creating a student, the students list refreshes automatically
await createStudent.mutateAsync(data);
```

### Error Handling
Always handle errors gracefully:
```typescript
const { error } = useStudents();
if (error) return <ErrorMessage message={error.message} />;
```

---

## 📞 Need Help?

Refer to:
- `FRONTEND_SETUP_COMPLETE.md` - Detailed documentation
- `alogyan_api_design.md.resolved` - API specification
- `lib/api-hooks.ts` - All available hooks
- `types/index.ts` - TypeScript definitions

---

**Happy Coding! 🎉**
