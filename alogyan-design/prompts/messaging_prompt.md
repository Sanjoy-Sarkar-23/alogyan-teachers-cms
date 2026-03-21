# Prompt: Messaging & Announcements Module

**Context:** Build the Announcements broadcast tool (`/announcements`).

**System Prompt Injection:**
`Read and apply the rules from master_prompt.md before proceeding.`
`Refer to 11_pages_announcements/messaging.md for detailed specs.`

**Task:**
Generate a Next.js page designed like a Split-Pane Email client.
1. **Left Sidebar:** Create a list containing historical announcements. Differentiate "Read" vs "Unread" visually (e.g. bold font). Include a primary `+ New Message` FAB or top button.
2. **Right Pane (Message Reader):** Display the contents of the selected announcement, alongside engagement metrics ("Read by 35/40").
3. **Compose Form:** Scaffold a form inside a Modal or separate route. Needs a `<select>` or Combobox for "To: [Batch]", a text input for "Subject", and a `<textarea>` for the message body.
4. **Mobile Layout:** The split-pane must collapse. If on mobile, only show the Left Sidebar list. Tapping an item opens a full-screen view (simulating push-state routing) containing the Right Pane content.
