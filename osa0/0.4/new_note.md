```mermaid
sequenceDiagram
    participant user as User
        participant browser as Browser
        participant server as Server
        
        user->>browser: User types a note and clicks "Save"
        
        browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
        activate server
        Note right of server: Server processes the POST request and adds the new note to the database
        
        server-->>browser: Redirect response to /exampleapp/notes
        deactivate server
        
        Note right of browser: Browser reloads the /notes page after receiving the redirect
        
        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
        activate server
        server-->>browser: HTML document
        deactivate server
        
        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
        activate server
        server-->>browser: CSS file
        deactivate server
        
        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
        activate server
        server-->>browser: JavaScript file
        deactivate server
        
        Note right of browser: The browser starts executing JavaScript that fetches the updated notes list from the server
        
        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
        activate server
        server-->>browser: [{ "content": "New note", "date": "2024-9-21" }, ... ]
        deactivate server
    
        Note right of browser: Browser executes the callback to render the updated notes list