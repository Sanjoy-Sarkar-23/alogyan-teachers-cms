# Messaging (Announcements)

**References:** WhatsApp Web (split pane structure).

## 1. Layout
Split pane web-client structure. Left side shows message threads/announcement history, right side shows specific message contents.

## 2. Components
- **List Items (Left):** Avatar (or megaphone icon), title, timestamp.
- **Message Reader (Right):** Full content body with read receipts ("Read by 35/40").

## 3. Tables
N/A

## 4. Forms
- **Compose Modal:** "To" (Dropdown), "Subject", "Body" (Rich Text area), Delivery Toggles (WhatsApp, SMS, App Push).

## 5. Buttons
"+ New Message/Announcement" (Primary Red FAB or Header button).

## 6. UX Flow
Teacher selects "Class 10" -> Types a note about bad weather -> Selects "WhatsApp" -> Hits Send -> Entire batch receives formatted message instantly.

## 7. Mobile Layout
Reverts to a standard push-stack list. Selecting an item transitions to a full-screen message reader page. FAB to compose.

## 8. Empty States
"Start broadcasting to your students!"

## 9. Success States
"Message pushed to 42 students via WhatsApp." (Green Toast notification).

## 10. Error States
"Message body cannot be empty."
