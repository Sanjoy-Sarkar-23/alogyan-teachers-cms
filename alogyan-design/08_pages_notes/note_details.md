# Note Details

**References:** Google Drive (File Preview), Notion (Page View).

## 1. Layout
A document viewer layout. Top header contains the Note Title and metadata. Below is either a PDF/Image preview pane or the rich text content of the note.

## 2. Components
- **File Previewer:** An embedded iframe or image viewer.
- **Metadata Bar:** Uploaded Date | Size | Shared With: "Class 10 Sc".
- **Download/Print Icons:** Pinned to top right of the previewer.

## 3. Tables
N/A

## 4. Forms
N/A

## 5. Buttons
"Download File" (Primary), "Share Link" (Secondary Outline).

## 6. UX Flow
Student clicks a Note link from WhatsApp -> Native browser opens Alogyan web app -> Lands on Note Details -> Previews the PDF inline -> Clicks Download if needed.

## 7. Mobile Layout
PDF viewers can be clunky on mobile browsers; gracefully degrade to showing the File icon, Title, and a large "Download to View" primary button.

## 8. Empty States
If a text note was created without content: "This note is empty."

## 9. Success States
"Link copied to clipboard!" Toast when "Share Link" is clicked.

## 10. Error States
"File preview unavailable. Please download the file to view it." (Often happens with Word docs on browsers).
