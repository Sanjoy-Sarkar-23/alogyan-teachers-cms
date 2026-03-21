# Prompt: Public Teacher Profile Page

**Context:** Build the SEO-optimized landing page for a teacher (`/tutor/[id]`).

**System Prompt Injection:**
`Read and apply the rules from master_prompt.md before proceeding.`
`Refer to 12_public_pages/teacher_profile.md for detailed specs.`

**Task:**
Generate a single-column, high-conversion Next.js page meant to be viewed by prospective students/parents.
1. **Hero Header:** Create an aesthetic header with the Teacher's Avatar overlapping the banner image. Include their Name, Subject, Rating Badge, and a prominent Primary Red "Enquire Now" button.
2. **Tabbed Content:** Use a Radix UI or custom tab system below the Hero. Tabs should be: About, Gallery, Batches, Reviews.
3. **Batches Section:** Design distinct "Slot Cards" showing active batches to join. Ensure they display Subject, Timing, capacity left, and individual "Apply to Join" ghost buttons.
4. **Mobile CTA:** The "Enquire Now" button MUST be cloned and rendered `fixed bottom-4 right-4` or `fixed bottom-0 w-full` only on mobile devices to ensure the primary CTA is always visible during scroll.
