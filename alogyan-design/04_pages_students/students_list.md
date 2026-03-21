# Students List

**References:** Razorpay (dense transaction tables), Workspace Admin (user directory).

## 1. Layout
A full-width robust data table occupying the main container space, preceded by a prominent Search & Filter header.

## 2. Components
- **Search Omnibar:** "Search by Name, Phone, or ID..."
- **Filter Chips:** "Batch: Class 10", "Status: Active".
- **Table Wrapper Card:** Includes a total count "124 Students".

## 3. Tables
High density table. Columns: Avatar+Name, ID, Batch, Joining Date, Phone, Status.

## 4. Forms
N/A - Data entry handled by `add_student.md`.

## 5. Buttons
"+ Add Student" (Primary Red Header Button). Three-dots (`...`) dropdown action per row.

## 6. UX Flow
The user can type into the search bar to instantly filter the table below without reloading the page.

## 7. Mobile Layout
Table transforms into a vertical Card List. Each Student Card displays Name, Batch, and a direct Call/WhatsApp button.

## 8. Empty States
"You haven't enrolled any students yet. Let's get started!" with a downward arrow pointing to "+ Add Student".

## 9. Success States
Skeleton loaders (`animate-pulse`) used when paginating or fetching next chunk of students.

## 10. Error States
"Connection lost. Showing offline results." (Yellow banner if caching is enabled).
