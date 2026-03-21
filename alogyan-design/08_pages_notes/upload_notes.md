# Upload Notes

**References:** Dropbox (Drag & Drop), Notion (File attachment block).

## 1. Layout
A dedicated Modal overriding the library, centrally focused.

## 2. Components
- **Drag & Drop Zone:** Large dashed border box. "Drag and drop files here to upload" or "Browse". Icon of an up-arrow cloud.
- **Configuration Panel:** Below the drop zone, inputs to rename the file and assign permissions.

## 3. Tables
N/A

## 4. Forms
- File Title input (defaults to original filename).
- "Share with Batch:" Multiselect dropdown.
- Optional: "Send Notification to students" Checkbox.

## 5. Buttons
"Cancel" (Ghost), "Upload & Save" (Primary right-aligned). The button remains unclickable until a file is added to the drop zone.

## 6. UX Flow
Teacher clicks Upload -> Drags a PDF from desktop -> Drops it in zone -> Clicks the "Notify Students" checkbox -> Hits Upload & Save.

## 7. Mobile Layout
"Drag & Drop" is non-functional on mobile browsers. Instead, the container acts as a massive native HTML `<input type="file">` button saying "Tap to select a file from your device."

## 8. Empty States
N/A

## 9. Success States
An animated green uploading progress bar (`0% -> 100%`) replaces the action buttons. Then the modal closes and a success toast appears.

## 10. Error States
"File size exceeds 50MB limit." (Instant validation alert before upload begins). "Unsupported format. We accept PDF, DOCX, JPG, and PNG."
