# Master Prompt: Alogyan Teacher CMS

**Context:**
You are acting as an expert Frontend Developer and UI/UX Engineer. Your task is to build out the screens for "Alogyan", an education discovery and teacher management SaaS platform. The target users are non-technical private teachers and coaching institutes. The UI must be extraordinarily simple, intuitive, and modern.

**Tech Stack (Recommended):**
- Next.js (App Router)
- React
- Tailwind CSS (for styling)
- Shadcn UI or Radix Primitives (for accessible components)
- Lucide React (for icons)

**Core Design System Elements (Implicit Reference):**
- **Colors:** 
  - Primary: Red (`#D32F2F`) -> hover (`#B71C1C`)
  - Success: Green (`#2E7D32`)
  - Warning: Orange (`#F57C00`)
  - Danger: Red (`#C62828`)
  - Backgrounds: `#F8F9FA` (app) and `#FFFFFF` (cards)
- **Typography:** Use `Inter` font family. Maintain high contrast (`#212121` for primary text) and readable sizing (16px base).
- **Spacing:** Use Tailwind's default 8px multiples. `p-4` or `p-6` for cards.
- **Card-based UI:** Use `bg-white border rounded-xl shadow-sm` for your main containers.

**Global Directives:**
1. **Always build Mobile-First:** Every screen must be flawlessly responsive. Tables on desktop must degrade gracefully into Card Lists on mobile (e.g. `hidden md:table` and `grid md:hidden`).
2. **Minimal Cognitive Load:** Do not invent complex nested UIs. Prioritize floating action buttons, clear visual boundaries, and large clickable areas.
3. **Use Semantic Components:** Use standard badges for statuses (Paid=Green, Due=Orange).

**How to Use Specific Prompts:**
When instructed to build a specific screen, refer back to the exact `.md` files in the Alogyan design folder for contextual requirements.
