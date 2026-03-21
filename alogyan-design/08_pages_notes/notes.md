# Screen: Notes & Study Material

The Notes module is where teachers upload and share PDFs, images, links, or text documents with their batches.

## 1. Layout
- **Type:** Standard Dashboard with File Explorer style grid.
- **Header:** "Notes & Material" + "Upload Material" button.
- **Sidebar (Optional Inner):** Folder tree by Batch or Subject (e.g., "Class 10 Sc", "Class 9 Maths").
- **Main Area:** Grid of Material Cards (Representing files/links).

## 2. Components
- **File Card:** 
  - Thumbnail (Doc, PDF, Link Icon, Image preview).
  - Title (H4, truncated if long).
  - Meta info: Upload Date, Size, Visibility (e.g., "Visible to Class 10").
  - Action Menu (...): Download, Edit Visibility, Delete.
- **File Upload Area (Drag & Drop):** Dashed border area when adding new notes.
- **Visibility Badges:** Tiny tags specifying which batch can see it.

## 3. Tables
- None primarily. We prefer a grid layout for visual materials. However, a "List View" toggle can change the grid into a standard 5-column table (Name, Type, Size, Added Date, Visibility).

## 4. Forms
- **Upload Modal:**
  - Area 1: Drag and Drop zone.
  - Area 2: File Name/Title input.
  - Area 3: Multiselect dropdown -> "Share with Batches".
  - Area 4: Optional Message (e.g., "Read Chapter 4 before tomorrow's class").

## 5. Buttons
- **Global Actions:** "+ Upload Material" (Primary).
- **Toggle:** Grid View / List View (Icon only ghost buttons).
- **Row/Card Actions:** "Share Link", "Download" (Ghost).

## 6. UX Flow (Uploading Content)
1. Teacher clicks "+ Upload Material".
2. Selects "Class 10 Science" from the batch dropdown.
3. Drags a PDF of notes into the dropzone.
4. Types a descriptive title "Chapter 4: Acids & Bases Summary".
5. Clicks "Upload & Notify Students".
6. Material appears in the grid. Students in the batch receive a notification (or SMS/WhatsApp).

## 7. Mobile Layout
- Grid is forced to 2-columns (if thumbnails are small) or a 1-column vertically scrollable Card list.
- File Card height is fixed, with a clear recognizable icon mapping to file type.
- Drag & Drop zone is replaced by a standard native "Select File" mobile UI button.

## 8. Empty States
- No notes uploaded: Illustration of flying papers. "Share your knowledge! Upload your first study material here."
- No notes for a specific folder/batch: "No materials shared with this batch yet."

## 9. Success States
- Toast: "File uploaded successfully."
- Upload Progress Bar: A distinct green progress bar stretching across the top or inside the modal to visualize large file uploads.

## 10. Error States
- Validation errors: "File size exceeds 50MB limit."
- Type errors: "Unsupported file type. Please upload a PDF, DOC, or Image."
