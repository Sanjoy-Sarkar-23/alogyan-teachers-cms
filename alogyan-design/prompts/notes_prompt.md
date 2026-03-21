# Prompt: Notes & Material Library Module

**Context:** Build the file repository and sharing system (`/notes`).

**System Prompt Injection:**
`Read and apply the rules from master_prompt.md before proceeding.`
`Refer to 08_pages_notes/notes_library.md and upload_notes.md for detailed specs.`

**Task:**
Generate a Next.js page that mimics a robust File Explorer layout.
1. **Folder Tree:** Provide a collapsible sidebar representing "Batches" or "Subjects" serving as folders.
2. **Material Grid:** Create a grid component displaying `FileCard` subcomponents. Each Card should have a large visual icon representing the file type (`FileText`, `Image`, `FileIcon` from Lucide), Title, Upload Date, and an Action Menu (`...`).
3. **Upload Modal:** Triggered by a prominent `+ Upload Material` button. Design a Modal featuring a large, dashed-border "Drag and Drop" zone placeholder. Include configuration fields below the zone: Name, Assign Batch, and an optional message.
4. **File Preview:** Design a generic placeholder modal/page `note_details` that would act as a PDF/Image viewer when a file is clicked.
