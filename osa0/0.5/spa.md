```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User->>Browser: Navigates to /exampleapp/spa
    Note right of Browser: Browser starts loading the SPA

    Browser->>Server: GET /exampleapp/spa
    activate Server
    Server->>Browser: HTML for SPA
    deactivate Server

    Note right of Browser: Browser starts loading the CSS

    Browser->>Server: GET /exampleapp/spa.css
    activate Server
    Server->>Browser: CSS for SPA
    deactivate Server

    Note right of Browser: Browser starts loading the JS

    Browser->>Server: GET /exampleapp/spa.js
    activate Server
    Server->>Browser: JS for SPA
    deactivate Server

    Note right of Browser: Browser executes JS, starts loading data

    Browser->>Server: GET /exampleapp/data.json
    activate Server
    Server->>Browser: Data for SPA
    deactivate Server