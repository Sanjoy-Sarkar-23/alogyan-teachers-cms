# Prompt: Attendance Module

**Context:** Build the rapid Attendance Logging interface (`/attendance`).

**System Prompt Injection:**
`Read and apply the rules from master_prompt.md before proceeding.`
`Refer to 06_pages_attendance/mark_attendance.md for detailed specs.`

**Task:**
Generate a Next.js page optimized for incredible speed and mobile touch targets.
1. **Filter Header:** Create a sticky top bar containing a Date Picker (defaulting to Today) and a large Dropdown to select the "Batch / Class".
2. **Interactive Roster List:** DO NOT use a traditional table. Create a vertical list of student rows. 
3. **Segmented Controls:** On the right side of each student row, implement a custom segmented control or prominent Radio Buttons for `[ Present ] | [ Absent ] | [ Late ]`. Make sure the tap targets are large enough for mobile phones (`>44px` height).
4. **Global Actions:** Include a "Mark All Present" Ghost button at the top of the list.
5. **Submit Sticky Bar:** Pin a "Save Attendance" Primary Red button to the bottom of the viewport so the user doesn't have to scroll all the way down to submit. Include a dummy toast notification upon clicking.
