# Alogyan Teacher CMS

A comprehensive teacher content management system built with Next.js 16, Firebase, and modern web technologies.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS, Shadcn/UI |
| State/Data | React Query (TanStack Query), Firebase |
| Auth | Firebase Auth |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Charts | Recharts |
| Icons | Lucide React |

## Project Structure

```
alogyan_teacher_cms/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Authentication routes
│   │   └── login/              # Login page
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── dashboard/          # Home dashboard
│   │   ├── students/           # Student management
│   │   ├── batches/            # Batch/class management
│   │   ├── attendance/         # Attendance tracking
│   │   ├── fees/               # Fee management
│   │   ├── notes/              # Study materials
│   │   ├── tests/              # Test management
│   │   ├── reports/            # Analytics & reports
│   │   ├── announcements/      # Announcements
│   │   └── settings/           # Settings
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # Shadcn UI components
│   ├── layout/                 # Header, Sidebar
│   └── reports/                # Report charts & components
├── contexts/                   # React contexts
│   ├── AuthContext.tsx         # Firebase auth context
│   └── ReactQueryProvider.tsx  # React Query provider
├── lib/
│   ├── api-client.ts           # REST/GraphQL API client
│   ├── api-hooks.ts            # React Query hooks
│   ├── firebase.ts            # Firebase initialization
│   └── utils.ts                # Utility functions
├── types/
│   └── index.ts                # TypeScript type definitions
├── public/                     # Static assets
└── alogyan-design/             # Design specifications & prompts
```

## Features

### Core Modules

1. **Dashboard** - Overview with stats, today's classes, pending actions
2. **Students** - Add, edit, view students with batch enrollment
3. **Batches** - Create and manage classes with schedules
4. **Attendance** - Mark and track student attendance
5. **Fees** - Track fee payments, dues, and generate reports
6. **Tests** - Schedule tests, record marks, view performance
7. **Notes** - Upload and share study materials
8. **Announcements** - Send notifications to students
9. **Reports** - Analytics dashboards with charts
10. **Settings** - Profile and app configuration

## Data Models

### Teacher
- `uid`, `name`, `email`, `phone`, `subject`, `title`, `photoURL`, `instituteName`

### Student
- `id`, `teacherId`, `name`, `phone`, `parentPhone`, `parentName`, `batchIds`, `status`, `enrollmentDate`

### Batch
- `id`, `teacherId`, `name`, `subject`, `studentIds`, `schedule`, `feeAmount`, `status`

### Attendance
- `batchId`, `date`, `records: { [studentId]: 'present' | 'absent' | 'late' }`

### Fee
- `studentId`, `batchId`, `month`, `amount`, `paidAmount`, `status`, `payments[]`

### Test
- `batchId`, `title`, `subject`, `scheduledAt`, `durationMins`, `totalMarks`

### Note
- `batchId`, `title`, `type` (pdf/image/link/text), `fileUrl`, `linkUrl`

### Announcement
- `title`, `message`, `targetBatchIds`, `channel` (in_app/whatsapp/both)

## API Integration

The app uses a dual API approach:
- **REST API** via `lib/api-client.ts` → Backend at `http://localhost:3001/api`
- **Firebase Firestore** for real-time data

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_GRAPHQL_ENDPOINT=/api/graphql

# Server-only Firebase Admin credentials
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Server-only, random secret of at least 32 characters
CERT_SECRET_KEY=
```

## Running the Project

```bash
# Install all dependencies
npm run install:all

# Run both server and client
npm run dev:all

# Or run separately
npm run dev:server  # Backend (port 3001)
npm run dev:client  # Frontend (port 3000)
```

### Batch query indexes

The optimized Batch section uses cursor pagination and server-side filters. Deploy
the required composite indexes before enabling it in production:

```bash
firebase deploy --only firestore:indexes
```

The index definitions are stored in `firestore.indexes.json`.

## Design System

See `alogyan-design/` directory for:
- Design system specs (colors, typography, components)
- UX flows for each feature
- Page wireframes and prompts
- Product vision and overview

## Installed Agent Skills

- `shadcn` - Shadcn/UI component guidance
- `firebase-basics` - Firebase integration help
- `recharts` - Chart implementation help
- `react-aria` - Accessible component patterns
