# Screen: Announcements & Communication

The Announcements module allows teachers to broadcast messages, notices, and links to all students, specific batches, or individual parents.

## 1. Layout
- **Type:** Split View (Email client style).
- **Left Sidebar / Pane:** List of recent announcements with titles and snippets.
- **Right Main Area:** The full content of the selected announcement, including read receipts and engagement metrics.

## 2. Components
- **Announcement Items (Left Pane):**
  - Bold title if unread (from teacher's admin view, this marks if new replies exist).
  - Target Audience tag (e.g., "[Class 10]"), Date, Snippet.
- **"Compose" Button:** Large FAB or Primary Button at the top of the left pane.
- **Read Receipts:** A small sub-text below the main message body: "Read by 34/40 students".

## 3. Tables
- None needed.

## 4. Forms
- **Compose Message Form (Modal or New Page Layout):**
  - "To:" Dropdown (Batches multiselect or 'All Students').
  - "Subject/Title:" Text input.
  - "Message:" Rich text editor (Bold, Italics, Lists, Link insertion).
  - "Include Action Button (Optional):" Checkbox. If checked, asks for Button Text & URL (e.g., "Join Zoom Class").
  - "Attachments:" File drop zone.
  - "Delivery Method:" Checkboxes (In-App Notification, Email, WhatsApp).

## 5. Buttons
- **Global:** "+ New Announcement" (Primary Red).
- **Inside Form:** "Send Now" (Primary), "Save as Draft" (Secondary outline).
- **Inline Row Actions:** "Resend to Unread" (Ghost/Tertiary action inside a specific announcement's read receipts list).

## 6. UX Flow (Sending an Urgent Note)
1. Teacher clicks "+ New Announcement".
2. Selects "All Students".
3. Types "Class Canceled Today due to heavy rain. See you all tomorrow."
4. Checks "WhatsApp" delivery to ensure parents see it instantly.
5. Clicks "Send Now".
6. Success Toast: "Announcement sent to 120 users." 

## 7. Mobile Layout
- Changes from Split View to Stacked List View.
- Tap an announcement -> Animates to full screen view (Native mobile page transition).
- "Compose" becomes a Primary Red FAB fixed to the bottom right.

## 8. Empty States
- When no announcements exist: Illustration of a megaphone. "Keep your students updated. Broadcast your first message."
- Left pane empty state (if searched): "No announcements matched your search."

## 9. Success States
- Toast: "Message delivered successfully."
- Visual: Read receipt numbers updating dynamically.

## 10. Error States
- Form Validation: "Please select at least one recipient batch."
- Network error sending WhatsApp: "WhatsApp delivery failed. In-app notification was sent successfully."
