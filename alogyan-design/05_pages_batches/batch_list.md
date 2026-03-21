# Batch List

**References:** Zoho (App grids), Google Drive (folder grid layout).

## 1. Layout
Grid-based layout instead of a table. Batches are distinct grouping entities, visualized better as large Cards.

## 2. Components
- **Batch Card:** Bold Title, Sub-tags (`Physics`), Timing (`5 PM`), and a Progress Bar (`24/30 Enrolled`).

## 3. Tables
N/A - We explicitly avoid tables here in favor of visual Cards.

## 4. Forms
Filters (e.g., "Show Active Only") hidden behind an intricate dropdown next to the search bar.

## 5. Buttons
Primary Red Header Button: `+ Create Batch`.

## 6. UX Flow
Visually scanning batches allows teachers to instantly recognize which class has low enrollment or overlaps in schedule.

## 7. Mobile Layout
Grid forces into a 1-column stack.

## 8. Empty States
"No batches created yet. Batches help you organize your students by subject or timing."

## 9. Success States
Hovering over a batch card lifts it via z-index shadow interaction (`box-shadow: 0 4px 12px rgba(0,0,0,0.1)`).

## 10. Error States
"Failed to load batches."
