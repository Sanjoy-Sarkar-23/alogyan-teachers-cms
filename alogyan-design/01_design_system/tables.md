# Tables

**References:** Zoho (data-heavy but clean tables), Stripe (financial ledgers).

## 1. Layout
Tables are contained inside a Card to give them a bounded frame. 

## 2. Components
- **Header:** `#F5F5F5` background, sticky scroll support.
- **Rows:** White background, thin bottom border.
- **Pagination:** Bottom right of the table footer.

## 3. Tables
To avoid horizontal scrolling, non-essential columns wrap their text or are hidden on smaller screens. 

## 4. Forms
Tables can contain inline checkboxes (leftmost column) for bulk actions (e.g., bulk delete, bulk assign).

## 5. Buttons
Interactive table cells use Ghost Buttons (icon only) so visual weight isn't overwhelming.

## 6. UX Flow
Clicking a table row anywhere (except on a specific button) targets the primary action for that row (e.g., opening the Student Profile).

## 7. Mobile Layout
Tables are mathematically destroyed on mobile and rebuilt as **Card Lists**. Data is stacked vertically (Row = 1 Card).

## 8. Empty States
A table with no rows displays a single merged cell spanning all columns: "No data found matching your filters."

## 9. Success States
When a row is successfully edited inline, the row flashes a faint green background for 1 second.

## 10. Error States
If a table fails to fetch data, the table body is replaced with an error illustration and a "Reload Data" button.
