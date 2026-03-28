<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Alogyan Teacher CMS - Agent Instructions

## Project Overview

This is a Teacher CMS application built with:
- **Next.js 16** (App Router with React 19)
- **Firebase** (Auth, Firestore, Storage)
- **Shadcn/UI** components
- **React Query** for data fetching

## Key Files

- `PROJECT.md` - Full project documentation
- `types/index.ts` - All TypeScript type definitions
- `lib/api-client.ts` - REST/GraphQL client with auth
- `lib/firebase.ts` - Firebase initialization
- `contexts/AuthContext.tsx` - Authentication state

## Common Patterns

### Making API Calls
```typescript
import { api } from '@/lib/api-client';
const response = await api.get('/students');
const result = await api.post('/students', { name: 'John' });
```

### Firebase Data
Use Firestore directly for real-time data, or REST API for server-side operations.

### UI Components
Import from `@/components/ui/` for shadcn components. See skill: `shadcn`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run dev:all` | Run both server & client |
| `npm run lint` | Run ESLint |
| `npm run build` | Build for production |

## Available Skills

- `shadcn` - Component patterns
- `firebase-basics` - Firebase help
- `recharts` - Chart implementation
- `react-aria` - Accessibility patterns
