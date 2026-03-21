# User Management

**References:** Google Workspace (Admin Directory).

## 1. Layout
List View dominating the Main Application Area. Top-level complex Filter Bar.

## 2. Components
- **Omni-Search:** Can search by UUID, Email, Phone, Name, or Payment Reference ID.
- **Role Badges:** "Super Admin", "Teacher - Pro", "Teacher - Free", "Student/Parent".

## 3. Tables
100% width, dense spacing mode. Shows ID | Name | Role | Status | Last Active | MRR Contrib.

## 4. Forms
In-line status toggles (Active <-> Suspended). Detail drawer form to modify account limits manually.

## 5. Buttons
"Impersonate User" (Ghost Button inside row actions - incredibly powerful tool requiring confirmation).

## 6. UX Flow
Searches UUID -> Locates user -> Opens Drawer -> Edits Subscription tier manually -> Saves -> Impersonates user to verify their view is correct.

## 7. Mobile Layout
Degrades poorly on mobile; prioritize Desktop view `min-width: 1024px`.

## 8. Empty States
"No users match search string 'xyz'."

## 9. Success States
"Impersonation session started as Teacher A. A red banner will display while active."

## 10. Error States
"Action forbidden. Only Super Admins can delete users."
