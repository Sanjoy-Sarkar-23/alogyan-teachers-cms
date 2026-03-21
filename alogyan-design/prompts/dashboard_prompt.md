# Prompt: Dashboard Home Module

**Context:** Build the Alogyan Admin Dashboard page (`/dashboard`).

**System Prompt Injection:**
`Read and apply the rules from master_prompt.md before proceeding.`
`Refer to 03_pages_dashboard/dashboard_layout.md and 03_pages_dashboard/dashboard_home.md for detailed specs.`

**Task:**
Generate a Next.js page that serves as the teacher's landing dashboard.
1. Create a 12-column responsive grid layout. 
2. **Top Row (Widgets):** Generate 4 high-level KPI cards (Total Students, Active Batches, Monthly Revenue, Pending Fees) utilizing Lucide icons and basic trend visualizers. Stack these in a swiping horizontal row or 2x2 grid on mobile.
3. **Middle Section:**
   - Left Column (e.g., `col-span-8`): A "Today's Schedule" widget showing upcoming classes. Implement quick inline actions like "Mark Attendance".
   - Right Column (e.g., `col-span-4`): A "Pending Actions" widget highlighting immediate tasks (e.g., Unpaid fees).
4. Ensure the design relies heavily on white cards (`bg-white rounded-xl shadow-sm border`) sitting on a lighter grey background (`bg-gray-50`).
5. Include a generic placeholder for the Sidebar/Header layout wrapper.
