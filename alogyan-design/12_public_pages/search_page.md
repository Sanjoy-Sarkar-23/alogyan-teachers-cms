# Screen: Student Search & Discovery

The Discovery page is the front door of the Alogyan platform where students can search for teachers, subjects, or coaching centers near them.

## 1. Layout
- **Type:** Search Engine / Marketplace Layout.
- **Hero Header:** Large Search Bar ("Find your perfect teacher..."), Background illustration.
- **Filters/Sidebar (Desktop):** Left col for refining search (Subject, Location/PIN, Price, Mode: Online/Offline).
- **Results Area:** Grid or List of Teacher Profile Cards.

## 2. Components
- **Omnibar Search:** A prominent, centered search input that predicts/suggests as you type (e.g., typing "Ma" -> suggests "Maths", "Manoj Singh (Teacher)").
- **Teacher Card (Search Result):**
  - Avatar, Name, Location Tag.
  - Sub-label: Primary Subjects (e.g., "Physics, Chemistry").
  - Rating: ⭐ 4.8 (120 reviews).
  - CTA: "View Profile".
- **Chip Filters:** Pill-shaped tags below the search bar indicating active filters `[✖ Near Kolkata]` `[✖ Maths]`.

## 3. Tables
- None. Marketplace visual hierarchy dictates cards over tables.

## 4. Forms
- The entire sidebar acts as a continuous filter form that automatically refreshes results upon change (no explicit "Apply" button needed if technically feasible).

## 5. Buttons
- **Card Action:** "View Profile" (Primary output on click). 
- **Filter Resets:** "Clear Filters" (Ghost text button).

## 6. UX Flow (Searching for a Tutor)
1. Student lands on Alogyan.com.
2. Types "Science Tutor in Mumbai" into the hero search.
3. Hits Enter. Page transitions to the Discovery view.
4. Student uses sidebar to filter down to "Offline Mode".
5. Reviews 4 Teacher Cards that match.
6. Clicks on one, navigating to the `Public Teacher Profile`.

## 7. Mobile Layout
- **Filter Logic:** Crucial! The left sidebar is hidden. A sticky "Filter" button appears at the top or bottom. Tapping it opens a full-screen or bottom-sheet modal containing the filter form.
- **Results:** Teacher Cards span 100% width, stacked vertically.
- **Search Bar:** Stays pinned or easily accessible at the top.

## 8. Empty States
- Zero Search Results: "We couldn't find any teachers matching your criteria. Try expanding your search area or checking spelling." + "Clear Filters" button.

## 9. Success States
- Skeleton loaders during intense DB queries ensure the user knows results are coming successfully.

## 10. Error States
- "Unable to access your location" if the user denies GPS permissions when clicking a "Near Me" filter toggle. (Provide manual PIN entry alternative).
