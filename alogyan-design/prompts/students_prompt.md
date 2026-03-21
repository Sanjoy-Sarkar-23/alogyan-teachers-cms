# Prompt: Students Module

**Context:** Build the Students Data List and Management page (`/students`).

**System Prompt Injection:**
`Read and apply the rules from master_prompt.md before proceeding.`
`Refer to 04_pages_students/students_list.md and 04_pages_students/add_student.md for detailed specs.`

**Task:**
Generate a responsive Next.js page displaying the teacher's enrolled students.
1. **Header Area:** Add a large "+ Add Student" Primary Red button positioned at the top right. Below that, add a full-width Search input with a magnifying glass icon, accompanied by a 'Filters' dropdown or button.
2. **Data Table (Desktop):** Create a robust table Component listing: Avatar/Name, Batch Name, Joining Date, Phone Number, Status Badge (Active/Inactive), and an Action Menu (`...`).
3. **Card List (Mobile):** On mobile (`< 768px`), hide the complex table. Replace it with a vertical list of stacked "Student Cards". Each card should show the Avatar, Name, Status Badge, and span 100% width with a prominent "WhatsApp" icon button for immediate parent contact.
4. **Interactivity Scaffold:** Add a state-toggled Slide-Over Drawer (or Modal) that represents the "Add Student" Form. It doesn't need to be wired to a DB, just visually structured with inputs and dummy form validation logic.
