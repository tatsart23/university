```mermaidgit remote remove origingit remote remove origin
sequenceDiagram
        participant User
        participant Browser
        participant Server

            User->>Browser: Writes a new note and submits the form

            Note right of Browser: The Browser prevents default form submission using `event.preventDefault()`
        
            Browser->>Browser: Browser adds the new note to the `notes` array and re-renders using `redrawNotes()`
        
            Browser->>Server: POST /exampleapp/new_note_spa
            activate Server
            Server-->>Browser: 201 Created (Confirmation of successful note submission)
            deactivate Server
        
            Note right of Browser: The new note is added to the Server, and the view is updated without a full page reload