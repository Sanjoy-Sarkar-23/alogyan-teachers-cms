# Prompt: Discovery Search Page

**Context:** Build the Student search and filter interface (`/search`).

**System Prompt Injection:**
`Read and apply the rules from master_prompt.md before proceeding.`
`Refer to 12_public_pages/search_page.md for detailed specs.`

**Task:**
Generate a robust Marketplace Search interface mimicking an e-commerce filter pattern.
1. **Filter Sidebar (Desktop):** Create a left-aligned `<aside>` with `<fieldset>` groups containing Checkboxes (for Subjects: Math, Physics) and Radio controls (for Mode: Online vs Offline) and a Range Slider for Pricing.
2. **Results Grid:** Output dummy "Teacher Profile Cards" on the right in a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`). Cards should display Avatar, Name, Subject, Rating, and a "View Profile" link.
3. **Mobile Filters:** Hide the left `<aside>` on mobile. Render a prominent "Filters" button floating or sticky. When clicked, it should slide up a Bottom Sheet (Drawer) containing all the exact same filter controls.
4. **Active Filter Chips:** Immediately below the top Search Bar, render dismissible Pill components (`border rounded-full flex items-center`) displaying the currently active filters.
